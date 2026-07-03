"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Send, Scale, Trash2, ExternalLink, Sparkles, BookOpen, ChevronRight, Mic, ImagePlus, X, ThumbsUp, ThumbsDown, Pencil, BookmarkPlus, AlertTriangle, Check, Plus, History, HelpCircle } from "lucide-react";
import { detectIntent, detectAllIntents, getIntentMeta, getIntentSystemPrompt } from "@/lib/intent-detection";
import Link from "next/link";

type ApprovalStatus = "pending" | "approved" | "rejected" | "edited";

interface GroundingSource {
  id: number;
  citation: string;
  court: string;
  year: number;
  title: string | null;
  reported: boolean;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
  // S04-03: approval workflow
  approval?: ApprovalStatus;
  // S04-05: uncertainty flag
  isUncertain?: boolean;
  // S04-07: saved as note
  savedAsNote?: boolean;
  // verified judgments retrieved from the corpus that grounded this answer
  sources?: GroundingSource[];
}

interface ApiChatSession {
  id: string;
  title: string | null;
  updatedAt: string;
  messageCount?: number;
  _count?: { messages: number };
  // First-message snippet, used as a label when title is null (older chats).
  preview?: string | null;
}

// After this many messages in one chat we gently nudge the user to start a
// fresh chat — long chats drift off-topic and dilute the grounded context,
// which is the real driver of hallucination (not the per-turn history window).
const SOFT_MESSAGE_LIMIT = 30;

interface ApiChatMessage {
  id: string;
  role: string;
  content: string;
}

// The chat DB stores only a plain content string per message. To persist an
// assistant answer's grounded judgment sources (so reopening a chat from history
// restores them instead of dropping the judgments), we append them after this
// separator and split/parse them back out on load. The SOH control char never appears in
// real text and is invisible, so it can't leak into the displayed answer.
const SOURCES_SEP = "SOURCES";

/** Split a persisted content string into its display text and stored sources. */
function splitStoredContent(raw: string): { content: string; sources?: GroundingSource[] } {
  const idx = raw.indexOf(SOURCES_SEP);
  if (idx === -1) return { content: raw };
  const content = raw.slice(0, idx);
  try {
    const parsed = JSON.parse(raw.slice(idx + SOURCES_SEP.length));
    if (Array.isArray(parsed) && parsed.length) return { content, sources: parsed };
  } catch {
    // corrupt tail — just show the text
  }
  return { content };
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ApiChatSession[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  // Smart Detection panel is hidden by default so the chat gets full width;
  // the user reveals it on demand via the "?" button in the header.
  const [smartOpen, setSmartOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [sessionLoading, setSessionLoading] = useState(false);
  const [openError, setOpenError] = useState(false);
  // True during the very first history fetch on page load, so the sidebar shows
  // skeleton rows instead of a misleading "No chats yet" while the (slow) proxy
  // is still responding.
  const [sessionsLoading, setSessionsLoading] = useState(true);
  // Cache loaded chats in memory so re-opening one is instant (the Railway
  // Postgres proxy is slow), plus a guard against out-of-order open clicks.
  const sessionCache = useRef<Map<string, Message[]>>(new Map());
  const openReqRef = useRef<string | null>(null);
  // Which session was actually loaded successfully (has its messages). Distinct
  // from sessionId, which we set optimistically on click — so a re-click after
  // a failed/slow load can still retry instead of being short-circuited.
  const loadedSessionRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // WhatsApp-style recording UI: live elapsed timer + a cancel flag so we can
  // discard a recording without transcribing it.
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Keep the view pinned to the latest message, but smoothly:
  //  - use "auto" (instant) while streaming so per-token "smooth" animations
  //    don't pile up and stutter; "smooth" only when a turn finishes.
  //  - don't yank the user down if they've scrolled up to read history.
  useEffect(() => {
    const c = scrollContainerRef.current;
    if (!c) return;
    const nearBottom = c.scrollHeight - c.scrollTop - c.clientHeight < 140;
    if (nearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: loading ? "auto" : "smooth" });
    }
  }, [messages, loading]);

  // Fetch the user's chat list for the history sidebar. The Railway Postgres
  // public proxy is flaky/slow, so retry a few times (with a per-attempt
  // timeout) before giving up — otherwise a single dropped request wrongly
  // shows "No chats yet" even though the chats are safely in the DB.
  const loadSessions = async (): Promise<ApiChatSession[]> => {
    for (let attempt = 0; attempt < 4; attempt++) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch("/api/chat/sessions", { credentials: "include", signal: ctrl.signal });
        if (res.ok) {
          const data = (await res.json()) as { sessions: ApiChatSession[] };
          const mapped = data.sessions.map((s) => ({
            ...s,
            messageCount: s._count?.messages ?? s.messageCount ?? 0,
          }));
          setSessions(mapped);
          return mapped;
        }
      } catch {
        // timed out / dropped — fall through to retry
      } finally {
        clearTimeout(t);
      }
      if (attempt < 3) await new Promise((r) => setTimeout(r, 800));
    }
    // All attempts failed — keep whatever list we already have on screen rather
    // than blanking it out to a misleading "No chats yet".
    return sessions;
  };

  // Load a saved chat's messages into the view.
  const openSession = async (id: string) => {
    // On narrow screens the list overlays the chat, so close it after picking.
    if (typeof window !== "undefined" && window.innerWidth < 1024) setHistoryOpen(false);
    // Only short-circuit if this chat is BOTH active AND already loaded — that
    // way re-clicking a chat whose load failed or is still hanging retries it.
    if (id === sessionId && loadedSessionRef.current === id) return;
    setSessionId(id);
    setOpenError(false);
    openReqRef.current = id;

    // Instant if we've already loaded this chat this session.
    const cached = sessionCache.current.get(id);
    if (cached) {
      setMessages(cached);
      loadedSessionRef.current = id;
      setSessionLoading(false);
      return;
    }

    // Otherwise clear + show a loader so the click feels responsive while the
    // (slow) DB fetch runs.
    setMessages([]);
    setSessionLoading(true);

    // The Railway Postgres public proxy is flaky/slow, so retry a couple of
    // times before giving up (with a per-attempt timeout so we never hang).
    const fetchWithTimeout = async (ms: number) => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), ms);
      try {
        return await fetch(`/api/chat/sessions/${id}`, { credentials: "include", signal: ctrl.signal });
      } finally {
        clearTimeout(t);
      }
    };

    let loaded = false;
    for (let attempt = 0; attempt < 3 && !loaded; attempt++) {
      // A newer click superseded this one — abandon quietly.
      if (openReqRef.current !== id) return;
      try {
        const sRes = await fetchWithTimeout(12000);
        if (sRes.ok) {
          const sData = (await sRes.json()) as { session: { messages: ApiChatMessage[] } };
          const msgs: Message[] = sData.session.messages.map((m) => {
            const role = m.role === "user" ? "user" : "assistant";
            // Recover any judgments stashed alongside an assistant answer so the
            // restored chat shows exactly what it did live — nothing dropped.
            const { content, sources } = splitStoredContent(m.content);
            return sources ? { role, content, sources } : { role, content };
          });
          sessionCache.current.set(id, msgs);
          if (openReqRef.current === id) {
            setMessages(msgs);
            loadedSessionRef.current = id;
            loaded = true;
          }
        }
      } catch {
        // timed out or network error — fall through to retry
      }
      if (!loaded && attempt < 2) await new Promise((r) => setTimeout(r, 600));
    }

    if (openReqRef.current === id) {
      if (!loaded) setOpenError(true);
      setSessionLoading(false);
    }
  };

  // Create a fresh empty session and make it active.
  const createSession = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = (await res.json()) as { session: ApiChatSession };
        setSessionId(data.session.id);
        await loadSessions();
        return data.session.id;
      }
    } catch {
      // silent — chat works without persistence as a fallback
    }
    return null;
  };

  // Load most recent session or create a new one
  useEffect(() => {
    // Show the history panel by default on desktop, collapsed on mobile.
    if (typeof window !== "undefined") setHistoryOpen(window.innerWidth >= 1024);
    (async () => {
      try {
        const list = await loadSessions();
        if (list.length > 0) {
          await openSession(list[0].id);
        } else {
          await createSession();
        }
      } finally {
        setSessionsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the active chat's cached copy in sync (e.g. after sending a message),
  // so switching away and back stays instant and never shows stale content.
  useEffect(() => {
    if (sessionId && !sessionLoading) sessionCache.current.set(sessionId, messages);
  }, [messages, sessionId, sessionLoading]);

  const persistMessage = async (
    role: "user" | "assistant",
    content: string,
    sources?: GroundingSource[],
  ) => {
    if (!sessionId) return;
    // Stash the grounded judgments alongside the text so reopening the chat from
    // history restores them instead of dropping the judgments.
    const payload =
      role === "assistant" && sources && sources.length
        ? content + SOURCES_SEP + JSON.stringify(sources)
        : content;
    try {
      await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role, content: payload }),
      });
    } catch {
      // fire-and-forget — don't block UX
    }
  };

  const handleNewSession = async () => {
    setMessages([]);
    await createSession();
  };

  // Rename a chat from the history sidebar.
  const handleRenameSession = async (id: string) => {
    const title = renameValue.trim();
    setRenamingId(null);
    setRenameValue("");
    if (!title) return;
    try {
      await fetch(`/api/chat/sessions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title }),
      });
    } catch {
      // ignore
    }
    await loadSessions();
  };

  // Delete a chat; if it was the open one, fall back to the next chat (or a new one).
  const handleDeleteSession = async (id: string) => {
    if (!window.confirm("Delete this chat? This cannot be undone.")) return;
    try {
      await fetch(`/api/chat/sessions/${id}`, { method: "DELETE", credentials: "include" });
    } catch {
      // ignore
    }
    const remaining = await loadSessions();
    if (id === sessionId) {
      if (remaining.length > 0) {
        await openSession(remaining[0].id);
      } else {
        setMessages([]);
        await createSession();
      }
    }
  };

  // Real-time intent detection on input
  const currentIntent = useMemo(() => detectIntent(input), [input]);
  const detectedIntents = useMemo(() => detectAllIntents(input), [input]);
  const primaryIntent = detectedIntents[0] || null;
  const _primaryMeta = useMemo(() => getIntentMeta(currentIntent), [currentIntent]);

  // ===== VOICE RECORDING =====
  const startRecording = async () => {
    // getUserMedia needs a secure context (HTTPS or localhost). If the page is
    // opened over a plain LAN IP, mediaDevices is undefined — say so clearly
    // instead of failing silently.
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      alert("Microphone isn't available here. Open the app on localhost or over HTTPS to use voice input.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Pick a container the browser actually supports (Chrome→webm, Safari→mp4).
      const candidates = ["audio/webm", "audio/mp4", "audio/ogg"];
      const supported = candidates.find(
        (t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(t),
      );
      const mediaRecorder = supported ? new MediaRecorder(stream, { mimeType: supported }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      cancelledRef.current = false;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (recordTimerRef.current) { clearInterval(recordTimerRef.current); recordTimerRef.current = null; }
        // Cancelled → throw the audio away without transcribing.
        if (cancelledRef.current) {
          audioChunksRef.current = [];
          return;
        }
        const type = mediaRecorder.mimeType || supported || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      // Live elapsed-time counter, WhatsApp-style.
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        alert("Microphone permission denied. Please allow mic access in your browser, then try again.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        alert("No microphone found. Please connect a mic and try again.");
      } else {
        alert("Couldn't start recording. Please check your microphone and try again.");
      }
    }
  };

  // Stop + send for transcription.
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      cancelledRef.current = false;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Discard the current recording (trash button) — no transcription.
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      cancelledRef.current = true;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recordTimerRef.current) { clearInterval(recordTimerRef.current); recordTimerRef.current = null; }
    setRecordSeconds(0);
  };

  // mm:ss for the live recording timer.
  const fmtDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Clean up the timer if the component unmounts mid-recording.
  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  // Promise-based base64 read so errors actually propagate to the caller's
  // try/catch (the old FileReader.onloadend callback swallowed them).
  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(",")[1] || "");
      reader.onerror = () => reject(new Error("Could not read the recording."));
      reader.readAsDataURL(blob);
    });

  const transcribeAudio = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      if (audioBlob.size === 0) throw new Error("Recording was empty — please try again.");
      const base64Audio = await blobToBase64(audioBlob);
      const res = await fetch("/api/ai/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ audio: base64Audio, mimeType: audioBlob.type || "audio/webm" }),
      });
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Transcription failed. Please try again.");
      if (data.text) {
        setInput((prev) => (prev ? `${prev} ${data.text}` : data.text!));
      } else {
        alert("Couldn't catch any speech. Please speak clearly and try again.");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Voice transcription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ===== IMAGE UPLOAD =====
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be under 10MB");
      return;
    }

    setUploadedImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = () => {
    setUploadedImage(null);
    setUploadedImageName("");
  };

  // ===== SEND MESSAGE =====
  const handleSend = async () => {
    if ((!input.trim() && !uploadedImage) || loading) return;

    const isFirstMessage = messages.length === 0;
    const userMessage: Message = {
      role: "user",
      content: input.trim() || (uploadedImage ? "Analyze this legal document" : ""),
      image: uploadedImage || undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    void persistMessage("user", userMessage.content);

    // Auto-title a brand-new chat with an AI-generated, ChatGPT-style name
    // from its first question so the history list reads meaningfully.
    if (isFirstMessage && sessionId && userMessage.content) {
      void fetch(`/api/chat/sessions/${sessionId}/title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: userMessage.content }),
      }).then(() => loadSessions());
    }
    const currentInput = input;
    const currentImage = uploadedImage;
    setInput("");
    setUploadedImage(null);
    setUploadedImageName("");
    setLoading(true);

    const intentPrompt = getIntentSystemPrompt(currentInput);
    const compactHistory = messages.slice(-8).map((msg) => ({
      role: msg.role,
      content: msg.content.slice(0, 1200),
    }));

    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: intentPrompt
            ? `${intentPrompt}\n\nUSER QUESTION: ${userMessage.content}`
            : userMessage.content,
          history: compactHistory,
          image: currentImage || undefined,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to get response");

      // Add an empty assistant message that we fill as the stream arrives.
      // It is always the last message, so we patch it by last index.
      setMessages((prev) => [...prev, { role: "assistant", content: "", approval: "pending", isUncertain: false, sources: [] }]);
      const updateLast = (patch: Partial<Message>) =>
        setMessages((prev) => prev.map((m, i) => (i === prev.length - 1 ? { ...m, ...patch } : m)));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";
      let streamError = "";
      let finalSources: GroundingSource[] = [];

      // Coalesce token updates to one render per animation frame for smoothness.
      let rafId = 0;
      const flush = () => {
        rafId = 0;
        updateLast({ content: full });
      };
      const scheduleFlush = () => {
        if (rafId === 0) rafId = requestAnimationFrame(flush);
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          let evt: { type: string; text?: string; error?: string; sources?: GroundingSource[] };
          try {
            evt = JSON.parse(trimmed);
          } catch {
            continue;
          }
          if (evt.type === "delta" && evt.text) {
            full += evt.text;
            scheduleFlush();
          } else if (evt.type === "done") {
            finalSources = Array.isArray(evt.sources) ? evt.sources : [];
            updateLast({ sources: finalSources });
          } else if (evt.type === "error") {
            streamError = evt.error || "AI response failed.";
          }
        }
      }

      if (rafId !== 0) cancelAnimationFrame(rafId);
      const finalText = full || streamError || "Sorry, I encountered an error. Please try again.";
      updateLast({ content: finalText, isUncertain: isUncertainResponse(finalText) });
      void persistMessage("assistant", finalText, finalSources);
      void loadSessions();
    } catch {
      const errorMsg = "Sorry, I encountered an error. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
      void persistMessage("assistant", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // S04-05: Uncertainty detection
  const isUncertainResponse = (text: string): boolean => {
    const patterns = [
      /i('m| am) not sure/i,
      /consult (a |your )?(qualified |registered )?lawyer/i,
      /i cannot (provide|give|offer)/i,
      /please (seek|consult|contact).*legal/i,
      /not (entirely |completely )?certain/i,
      /i('m| am) unable to (provide|give|offer) (legal )?advice/i,
    ];
    return patterns.some((p) => p.test(text));
  };

  // S04-03: Approval workflow handlers
  const handleApprove = (i: number) =>
    setMessages((prev) => prev.map((m, idx) => (idx === i ? { ...m, approval: "approved" as ApprovalStatus } : m)));

  const handleReject = (i: number) =>
    setMessages((prev) => prev.map((m, idx) => (idx === i ? { ...m, approval: "rejected" as ApprovalStatus } : m)));

  const handleEditSave = (i: number) => {
    setMessages((prev) => prev.map((m, idx) => (idx === i ? { ...m, content: editValue, approval: "edited" as ApprovalStatus } : m)));
    setEditingIndex(null);
    setEditValue("");
  };

  // S04-07: Save as Note
  const handleSaveNote = (i: number) =>
    setMessages((prev) => prev.map((m, idx) => (idx === i ? { ...m, savedAsNote: true } : m)));

  // S04-02: Render message content with citation block highlighted
  const renderMessageContent = (content: string, isUser: boolean): React.ReactNode => {
    if (isUser) return <span className="whitespace-pre-wrap">{content}</span>;

    const citationSplit = content.split(/\n(📚 CITATIONS:)/);
    if (citationSplit.length < 2) {
      return <span className="whitespace-pre-wrap">{content}</span>;
    }

    const mainText = citationSplit[0];
    const citationsBody = citationSplit.slice(2).join("").trim();

    const citationLines = citationsBody.split("\n").filter(l => l.trim());

    return (
      <>
        <span className="whitespace-pre-wrap">{mainText}</span>
        <div className="mt-3 pt-2.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
            📚 Citations
          </p>
          <div className="flex flex-col gap-1.5">
            {citationLines.map((line, idx) => {
              const clean = line.replace(/^[•\-]\s*/, "").trim();
              if (!clean) return null;
              const [ref, desc] = clean.split(/\s*—\s*/);
              const isCase = /\d{4}\s+(SCMR|PLD|PCr\.?LJ|MLD|YLR|CLC)\s+\d+/i.test(ref ?? "");
              return (
                <div key={idx} className={`flex items-start gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium border ${isCase ? "bg-success-500/10 text-success-500 border-success-500/25" : "bg-primary-500/10 text-primary-300 border-primary-500/25"}`}>
                  <span className="flex-shrink-0">{isCase ? "⚖️" : "§"}</span>
                  <span>
                    <span className="font-bold">{ref}</span>
                    {desc && <span className="font-normal text-[10px] opacity-80 ml-1">— {desc}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const colorMap: Record<string, { bg: string; text: string; border: string; light: string }> = {
    red: { bg: "bg-red-500", text: "text-red-300", border: "border-red-500/25", light: "bg-red-500/10" },
    blue: { bg: "bg-blue-500", text: "text-blue-300", border: "border-blue-500/25", light: "bg-blue-500/10" },
    emerald: { bg: "bg-emerald-500", text: "text-emerald-300", border: "border-emerald-500/25", light: "bg-emerald-500/10" },
    pink: { bg: "bg-pink-500", text: "text-pink-300", border: "border-pink-500/25", light: "bg-pink-500/10" },
    amber: { bg: "bg-amber-500", text: "text-amber-300", border: "border-amber-500/25", light: "bg-amber-500/10" },
    indigo: { bg: "bg-indigo-500", text: "text-indigo-300", border: "border-indigo-500/25", light: "bg-indigo-500/10" },
    cyan: { bg: "bg-cyan-500", text: "text-cyan-300", border: "border-cyan-500/25", light: "bg-cyan-500/10" },
    sky: { bg: "bg-sky-500", text: "text-sky-300", border: "border-sky-500/25", light: "bg-sky-500/10" },
  };

  // Only list chats that actually have messages — keeps the history clean
  // (no empty "New chat" placeholders piling up like the current mess).
  const visibleSessions = sessions.filter((s) => (s.messageCount ?? 0) > 0);

  return (
    <div className="h-[calc(100dvh-5.5rem)] sm:h-[calc(100dvh-6.5rem)] lg:h-[calc(100dvh-7.5rem)] flex gap-4">
      {/* ===== CHAT HISTORY — full-height side panel (ChatGPT-style) ===== */}
      {historyOpen && (
        <>
          {/* Mobile backdrop — tap to dismiss */}
          <div onClick={() => setHistoryOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />

          <aside
            className="fixed inset-y-0 left-0 z-40 w-72 flex flex-col min-h-0 lg:static lg:z-auto lg:inset-auto lg:w-[210px] lg:flex-shrink-0 lg:self-start lg:max-h-full overflow-hidden rounded-none lg:rounded-2xl border-r lg:border"
            style={{ background: "var(--bg-surface-1)", borderColor: "var(--border-subtle)" }}
          >
            {/* New chat */}
            <div className="p-2.5">
              <button
                onClick={handleNewSession}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-semibold border transition-colors hover:border-primary-500/40 hover:bg-[var(--bg-surface-2)]"
                style={{ color: "var(--text-secondary)", borderColor: "var(--border-default)" }}
              >
                <Plus className="h-4 w-4" /> New chat
              </button>
            </div>

            {/* Recents heading */}
            <div className="px-4 pt-1 pb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Recents
              </span>
            </div>

            {/* Chat list */}
            <div className="flex-1 min-h-0 overflow-y-auto px-1.5 pb-3 space-y-0.5">
              {sessionsLoading && visibleSessions.length === 0 ? (
                /* Skeleton rows while the (slow) proxy loads the history */
                <div className="px-1.5 pt-1 space-y-1.5" aria-label="Loading chats">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 rounded-lg animate-pulse"
                      style={{ background: "var(--bg-surface-2)", opacity: 1 - i * 0.11 }}
                    />
                  ))}
                </div>
              ) : visibleSessions.length === 0 ? (
                <p className="text-xs text-center py-6" style={{ color: "var(--text-tertiary)" }}>
                  No chats yet
                </p>
              ) : (
                visibleSessions.map((s) => {
                  const active = s.id === sessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => renamingId !== s.id && openSession(s.id)}
                      className="group flex items-center gap-1 pl-3 pr-1 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--bg-surface-2)]"
                      style={active ? { background: "var(--bg-surface-2)" } : undefined}
                    >
                      {renamingId === s.id ? (
                        <input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameSession(s.id);
                            if (e.key === "Escape") { setRenamingId(null); setRenameValue(""); }
                          }}
                          onBlur={() => handleRenameSession(s.id)}
                          autoFocus
                          className="flex-1 min-w-0 px-1.5 py-0.5 text-[13px] rounded border focus:outline-none focus:ring-1 focus:ring-primary-500/40"
                          style={{ background: "var(--bg-surface-1)", color: "var(--text-primary)", borderColor: "var(--border-default)" }}
                        />
                      ) : (
                        <>
                          <span className="flex-1 min-w-0 truncate text-[13px]" style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}>
                            {s.title || s.preview || "New chat"}
                          </span>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); setRenamingId(s.id); setRenameValue(s.title || s.preview || ""); }}
                              className="p-1 rounded hover:bg-[var(--bg-surface-3)]"
                              title="Rename"
                            >
                              <Pencil className="h-3 w-3" style={{ color: "var(--text-tertiary)" }} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                              className="p-1 rounded hover:bg-danger-500/10"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3 text-danger-500" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </>
      )}

      {/* ===== RIGHT SIDE: header + chat ===== */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-extrabold flex items-center gap-2.5" style={{ color: "var(--text-primary)" }}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700" style={{ boxShadow: "var(--glow-cyan-sm)" }}>
              <Scale className="h-5 w-5" style={{ color: "var(--text-inverse)" }} />
            </div>
            AI Legal <span className="text-primary-400">Advisor</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>Ask about Pakistani law — PPC, CrPC, CPC, Family Laws &amp; more</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setHistoryOpen((v) => !v)}>
            <History className="h-4 w-4" /> History
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNewSession}>
            <Plus className="h-4 w-4" /> New Chat
          </Button>
          {/* Reveal the Smart Detection panel on demand — keeps the chat full-width */}
          <button
            onClick={() => setSmartOpen((v) => !v)}
            title="Smart Detection"
            aria-label="Smart Detection"
            className={`grid place-items-center h-9 w-9 rounded-xl border transition-all ${
              smartOpen
                ? "bg-primary-500/15 border-primary-500/40 text-primary-300"
                : "border-[var(--border-default)] bg-[var(--bg-surface-2)] text-[var(--text-tertiary)] hover:text-primary-400 hover:border-primary-500/40"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
        {/* ===== CHAT PANEL ===== */}
        <Card className="flex-1 flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
          {/* Messages */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {sessionLoading ? (
              <div className="h-full flex flex-col items-center justify-center py-12 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Loading chat…</p>
              </div>
            ) : openError ? (
              <div className="h-full flex flex-col items-center justify-center py-12 gap-3 text-center px-6">
                <div className="grid place-items-center h-11 w-11 rounded-2xl bg-warning-500/10 border border-warning-500/25">
                  <AlertTriangle className="h-5 w-5 text-warning-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Couldn&apos;t load this chat</p>
                  <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>The connection was slow or dropped. Please try again.</p>
                </div>
                <button
                  onClick={() => sessionId && openSession(sessionId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary-500/10 text-primary-300 border border-primary-500/25 hover:bg-primary-500/20 font-medium transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="relative w-16 h-16 mx-auto mb-4 grid place-items-center">
                  <span className="absolute inset-0 rounded-2xl bg-primary-500/10 blur-xl" />
                  <span className="relative w-14 h-14 rounded-2xl grid place-items-center border" style={{ background: "var(--bg-surface-2)", borderColor: "var(--border-default)" }}>
                    <Scale className="h-7 w-7 text-primary-400" strokeWidth={1.5} />
                  </span>
                </div>
                <h3 className="font-display text-base font-bold" style={{ color: "var(--text-primary)" }}>Start a conversation</h3>
                <p className="text-sm mt-1.5" style={{ color: "var(--text-tertiary)" }}>Ask me anything about Pakistani law</p>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                  {[
                    { en: "Grounds for divorce under Muslim Family Laws?", ur: "مسلم خاندانی قوانین کے تحت طلاق کی بنیادیں؟" },
                    { en: "Explain Section 420 PPC", ur: "دفعہ ۴۲۰ ضابطہ تعزیرات کی وضاحت" },
                    { en: "How to file a civil suit?", ur: "دیوانی مقدمہ کیسے دائر کریں؟" },
                    { en: "Property transfer process in Punjab", ur: "پنجاب میں جائیداد کی منتقلی کا طریقہ" },
                    { en: "How to write a bail application?", ur: "ضمانت کی درخواست کیسے لکھی جائے؟" },
                    { en: "What is the procedure for Khula?", ur: "خلع کا طریقہ کیا ہے؟" },
                  ].map((suggestion) => (
                    <button
                      key={suggestion.en}
                      onClick={() => setInput(suggestion.en)}
                      className="group flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-left border transition-all hover:border-primary-500/40"
                      style={{ background: "var(--bg-surface-2)", borderColor: "var(--border-subtle)" }}
                    >
                      <Sparkles className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-primary-400/60 group-hover:text-primary-400 transition-colors" strokeWidth={2} />
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold transition-colors group-hover:text-primary-300" style={{ color: "var(--text-secondary)" }}>{suggestion.en}</span>
                        <span className="block text-[10px] mt-0.5" dir="rtl" style={{ color: "var(--text-tertiary)" }}>{suggestion.ur}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {/* S04-05: Uncertainty banner */}
                  {msg.role === "assistant" && msg.isUncertain && (
                    <div className="max-w-[92%] mb-1 flex items-center gap-1.5 px-2.5 py-1 bg-warning-500/10 border border-warning-500/25 rounded-lg">
                      <AlertTriangle className="h-3 w-3 text-warning-500 flex-shrink-0" />
                      <p className="text-[10px] text-warning-500 font-medium">Uncertain response — please verify with a qualified lawyer</p>
                    </div>
                  )}

                  {/* Message bubble or edit form */}
                  {editingIndex === i ? (
                    <div className="max-w-[92%] w-full space-y-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full p-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 min-h-[100px] resize-y border border-primary-500/40"
                        style={{ background: "var(--bg-surface-2)", color: "var(--text-primary)" }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSave(i)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary-500 hover:bg-primary-400 rounded-lg font-semibold transition-colors"
                          style={{ color: "var(--text-inverse)" }}
                        >
                          <Check className="h-3 w-3" /> Save Edit
                        </button>
                        <button
                          onClick={() => { setEditingIndex(null); setEditValue(""); }}
                          className="px-3 py-1.5 text-xs rounded-lg font-medium transition-colors border"
                          style={{ color: "var(--text-secondary)", borderColor: "var(--border-default)", background: "var(--bg-surface-2)" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-3 border ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-primary-500 to-primary-600 rounded-br-md border-primary-400/30"
                          : `rounded-bl-md ${msg.approval === "rejected" ? "opacity-50" : ""}`
                      }`}
                      style={msg.role === "user"
                        ? { color: "var(--text-inverse)", boxShadow: "var(--glow-cyan-sm)" }
                        : { background: "var(--bg-surface-2)", color: "var(--text-primary)", borderColor: "var(--border-subtle)" }}
                    >
                      {msg.image && (
                        <div className="mb-2">
                          <img src={msg.image} alt="Uploaded document" className="max-w-[200px] max-h-[200px] rounded-lg border border-white/20 object-cover" />
                        </div>
                      )}
                      <div className="text-sm leading-relaxed">{renderMessageContent(msg.content, msg.role === "user")}</div>
                      {msg.approval === "edited" && (
                        <span className="text-[9px] text-primary-500 font-medium block mt-1">✎ Edited</span>
                      )}
                    </div>
                  )}

                  {/* Verified judgments from the corpus that grounded this answer */}
                  {msg.role === "assistant" && editingIndex !== i && msg.sources && msg.sources.length > 0 && (
                    <div className="max-w-[92%] mt-1.5 p-2.5 rounded-xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                        <BookOpen className="h-3 w-3 text-success-500" /> Verified from your archive
                      </p>
                      <div className="flex flex-col gap-1">
                        {msg.sources.map((s) => (
                          <Link
                            key={s.id}
                            href={`/case-law?open=${s.id}&q=${encodeURIComponent(s.citation)}&mode=${s.reported ? "citation" : "keyword"}&court=${encodeURIComponent(s.court)}&year=${s.year}&title=${encodeURIComponent(s.title || "")}&rep=${s.reported ? 1 : 0}`}
                            className="group flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] transition-all hover:border-success-500/40"
                            style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}
                          >
                            <span className="flex-shrink-0">⚖️</span>
                            <span className="font-bold font-mono text-success-500">{s.citation}</span>
                            <span className="truncate" style={{ color: "var(--text-tertiary)" }}>
                              {s.title ? `· ${s.title}` : ""} · {s.court}{s.year ? ` ${s.year}` : ""}
                            </span>
                            <ChevronRight className="h-3 w-3 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100" style={{ color: "var(--text-tertiary)" }} />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* S04-08: Mandatory disclaimer on every AI response */}
                  {msg.role === "assistant" && editingIndex !== i && (
                    <div className="max-w-[92%] mt-1 flex items-start gap-1.5 px-2 py-1.5 bg-warning-500/10 border border-warning-500/25 rounded-xl">
                      <span className="text-warning-500 text-[10px] mt-0.5 flex-shrink-0">⚠</span>
                      <p className="text-[10px] leading-tight" style={{ color: "var(--text-secondary)" }}>
                        <span className="font-semibold text-warning-500">AI Disclaimer:</span> This AI response is general legal information only — not formal legal advice. Please consult a registered lawyer for your specific case. / یہ عمومی قانونی معلومات ہیں، باقاعدہ قانونی مشورہ نہیں۔
                      </p>
                    </div>
                  )}

                  {/* S04-03: Approve / Edit / Reject buttons */}
                  {msg.role === "assistant" && editingIndex !== i && msg.approval === "pending" && (
                    <div className="max-w-[92%] mt-1.5 flex items-center gap-1.5">
                      <button
                        onClick={() => handleApprove(i)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-lg bg-success-500/10 text-success-500 border border-success-500/25 hover:bg-success-500/20 font-medium transition-colors"
                      >
                        <ThumbsUp className="h-3 w-3" /> Approve
                      </button>
                      <button
                        onClick={() => { setEditingIndex(i); setEditValue(msg.content); }}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-lg bg-primary-500/10 text-primary-300 border border-primary-500/25 hover:bg-primary-500/20 font-medium transition-colors"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleReject(i)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-lg bg-danger-500/10 text-danger-500 border border-danger-500/25 hover:bg-danger-500/20 font-medium transition-colors"
                      >
                        <ThumbsDown className="h-3 w-3" /> Reject
                      </button>
                    </div>
                  )}

                  {/* S04-03: Approved status + S04-07: Save as Note */}
                  {msg.role === "assistant" && editingIndex !== i && (msg.approval === "approved" || msg.approval === "edited") && (
                    <div className="max-w-[92%] mt-1.5 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] text-success-500 font-medium">
                        <Check className="h-3 w-3" /> Approved
                      </span>
                      {!msg.savedAsNote ? (
                        <button
                          onClick={() => handleSaveNote(i)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-lg border font-medium transition-colors hover:bg-[var(--bg-surface-3)]"
                          style={{ background: "var(--bg-surface-2)", color: "var(--text-secondary)", borderColor: "var(--border-default)" }}
                        >
                          <BookmarkPlus className="h-3 w-3" /> Save locally
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-primary-400 font-medium">
                          <BookmarkPlus className="h-3 w-3" /> Note saved locally
                        </span>
                      )}
                    </div>
                  )}

                  {/* S04-03: Rejected status */}
                  {msg.role === "assistant" && editingIndex !== i && msg.approval === "rejected" && (
                    <div className="max-w-[92%] mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-danger-500 font-medium">
                        <ThumbsDown className="h-3 w-3" /> Rejected
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (messages.length === 0 || messages[messages.length - 1]?.role === "user" || !messages[messages.length - 1]?.content) && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md px-4 py-3 border" style={{ background: "var(--bg-surface-2)", borderColor: "var(--border-subtle)" }}>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            {/* Soft message-limit nudge — long chats drift, so suggest a fresh one */}
            {messages.length >= SOFT_MESSAGE_LIMIT && (
              <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-warning-500/10 border border-warning-500/25">
                <AlertTriangle className="h-3.5 w-3.5 text-warning-500 flex-shrink-0" />
                <p className="text-[11px] leading-tight flex-1" style={{ color: "var(--text-secondary)" }}>
                  This chat is getting long. For sharper, more accurate answers, start a new chat.
                </p>
                <button
                  onClick={handleNewSession}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg bg-primary-500/10 text-primary-300 border border-primary-500/25 hover:bg-primary-500/20 font-medium transition-colors"
                >
                  <Plus className="h-3 w-3" /> New Chat
                </button>
              </div>
            )}

            {/* Image Preview */}
            {uploadedImage && (
              <div className="mb-2 flex items-center gap-2 p-2 rounded-lg border" style={{ background: "var(--bg-surface-2)", borderColor: "var(--border-subtle)" }}>
                <img src={uploadedImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--text-secondary)" }}>{uploadedImageName}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Document attached</p>
                </div>
                <button onClick={removeImage} className="p-1 rounded-lg transition-colors hover:bg-[var(--bg-surface-3)]">
                  <X className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                </button>
              </div>
            )}

            {isRecording ? (
              /* ===== WhatsApp-style recording bar ===== */
              <div className="flex items-center gap-2">
                {/* Keyframes for the live waveform */}
                <style>{`@keyframes waveBar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}`}</style>

                {/* Cancel / discard */}
                <button
                  onClick={cancelRecording}
                  title="Cancel recording"
                  aria-label="Cancel recording"
                  className="flex-shrink-0 p-2.5 rounded-xl border border-danger-500/40 bg-danger-500/10 text-danger-500 hover:bg-danger-500/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Live status: red dot + timer + animated waveform */}
                <div
                  className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl border overflow-hidden"
                  style={{ background: "var(--bg-surface-2)", borderColor: "var(--border-default)" }}
                >
                  <span className="flex-shrink-0 h-2.5 w-2.5 rounded-full bg-danger-500 animate-pulse" />
                  <span className="flex-shrink-0 text-sm font-mono font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                    {fmtDuration(recordSeconds)}
                  </span>
                  <div className="flex-1 flex items-center gap-[3px] h-6 min-w-0 overflow-hidden">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <span
                        key={i}
                        className="flex-shrink-0 w-[3px] rounded-full bg-primary-400/70"
                        style={{
                          height: `${10 + ((i * 13) % 14)}px`,
                          transformOrigin: "center",
                          animation: "waveBar 0.9s ease-in-out infinite",
                          animationDelay: `${(i % 8) * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="flex-shrink-0 text-[11px] hidden sm:inline" style={{ color: "var(--text-tertiary)" }}>
                    Recording…
                  </span>
                </div>

                {/* Stop & send */}
                <Button onClick={stopRecording} size="lg" className="px-4" title="Stop & transcribe">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              /* ===== Normal input row ===== */
              <div className="flex gap-2">
                {/* Voice Button */}
                <button
                  onClick={startRecording}
                  disabled={loading}
                  className="flex-shrink-0 p-2.5 rounded-xl border transition-all text-[var(--text-tertiary)] border-[var(--border-default)] bg-[var(--bg-surface-2)] hover:text-primary-400 hover:border-primary-500/40"
                  title="Voice input"
                >
                  <Mic className="h-4 w-4" />
                </button>

                {/* Image Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex-shrink-0 p-2.5 rounded-xl border text-[var(--text-tertiary)] border-[var(--border-default)] bg-[var(--bg-surface-2)] hover:text-primary-400 hover:border-primary-500/40 transition-all"
                  title="Upload document photo"
                >
                  <ImagePlus className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Text Input */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask about Pakistani law... / پاکستانی قانون کے بارے میں پوچھیں..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-colors"
                  style={{ background: "var(--bg-surface-2)", color: "var(--text-primary)", borderColor: "var(--border-default)" }}
                  disabled={loading}
                />

                {/* Send Button */}
                <Button onClick={handleSend} disabled={(!input.trim() && !uploadedImage) || loading} size="lg" className="px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-[10px] mt-2 text-center" style={{ color: "var(--text-tertiary)" }}>
              {isRecording ? "🔴 Recording… tap ✈ to transcribe or 🗑 to cancel" : "🎙️ Voice input · 📷 Document photo · AI assistance only — not formal legal advice"}
            </p>
          </div>
        </Card>

        {/* ===== SMART INTENT PANEL — revealed on demand via the "?" button ===== */}
        {smartOpen && (
        <div className="lg:w-[260px] flex-shrink-0 flex flex-col min-h-0 order-first lg:order-last">
          {/* Panel toolbar */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <Sparkles className="h-3.5 w-3.5 text-primary-500" /> Smart Detection
            </span>
            <button
              onClick={() => setSmartOpen(false)}
              title="Close"
              aria-label="Close Smart Detection"
              className="grid place-items-center h-6 w-6 rounded-lg transition-colors hover:bg-[var(--bg-surface-2)]"
            >
              <X className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-0.5">
          {/* Intent Detection */}
          {input.length > 2 && detectedIntents.length > 0 ? (
            <>
              {/* Detected Intent Badge */}
              <Card className="p-4">
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary-500" />
                  Detected Legal Area
                </h3>
                <div className="space-y-2">
                  {detectedIntents.slice(0, 3).map((intent) => {
                    const colors = colorMap[intent.color] || colorMap.blue;
                    return (
                      <div key={intent.type} className={`flex items-center gap-3 p-2.5 rounded-xl ${colors.light} border ${colors.border}`}>
                        <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${colors.text}`}>{intent.label}</p>
                          <p className="text-[10px]" dir="rtl" style={{ color: "var(--text-tertiary)" }}>{intent.labelUrdu}</p>
                        </div>
                        <span className="text-[10px] font-mono" style={{ color: "var(--text-tertiary)" }}>{Math.round(intent.confidence * 100)}%</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Quick Actions */}
              {primaryIntent && primaryIntent.actions.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Quick Actions
                  </h3>
                  <div className="space-y-1.5">
                    {primaryIntent.actions.map((action) => (
                      <Link key={action.href + action.label} href={action.href}>
                        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--bg-surface-2)] group cursor-pointer transition-colors">
                          <ChevronRight className="h-3.5 w-3.5 text-[var(--text-tertiary)] group-hover:text-primary-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium group-hover:text-primary-300 transition-colors" style={{ color: "var(--text-secondary)" }}>{action.label}</p>
                            <p className="text-[10px]" dir="rtl" style={{ color: "var(--text-tertiary)" }}>{action.labelUrdu}</p>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium border ${
                            action.type === "template" ? "bg-primary-500/10 text-primary-300 border-primary-500/25" : "bg-warning-500/10 text-warning-500 border-warning-500/25"
                          }`}>
                            {action.type === "template" ? "Template" : "Tool"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}

              {/* Relevant Laws */}
              {primaryIntent && primaryIntent.laws.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    Relevant Laws
                  </h3>
                  <div className="space-y-1">
                    {primaryIntent.laws.slice(0, 5).map((law) => (
                      <div key={law} className="flex items-start gap-2 py-1">
                        <span className="w-1 h-1 rounded-full bg-primary-400/60 mt-1.5 flex-shrink-0" />
                        <p className="text-[11px] leading-tight" style={{ color: "var(--text-secondary)" }}>{law}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Matched Keywords */}
              <Card className="p-4">
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-1.5">
                  {detectedIntents.flatMap(i => i.keywords).slice(0, 8).map((kw, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-[10px] bg-primary-500/10 text-primary-300 border border-primary-500/25 rounded-full font-medium">{kw}</span>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            /* Default - no input yet */
            <Card className="p-0 overflow-hidden">
              {/* Header with subtle gradient wash */}
              <div className="relative px-4 pt-4 pb-3.5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.07] to-transparent pointer-events-none" />
                <div className="relative flex items-center gap-2.5">
                  <div className="grid place-items-center h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-500/5 border border-primary-500/25">
                    <Sparkles className="h-4 w-4 text-primary-400" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-bold leading-none" style={{ color: "var(--text-primary)" }}>Smart Detection</h3>
                    <p className="text-[10px] mt-1 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
                      AI ready
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 py-3.5">
                <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                  Start typing — AI auto-detects the legal area and suggests templates, laws &amp; actions.
                </p>
                <p className="text-[11px] mt-1.5 leading-relaxed" dir="rtl" style={{ color: "var(--text-tertiary)" }}>
                  سوال لکھیں — AI خود قانونی شعبہ پہچان لے گا
                </p>

                <div className="mt-3.5 pt-3 border-t grid grid-cols-2 gap-1.5" style={{ borderColor: "var(--border-subtle)" }}>
                  {[
                    { area: "Criminal", color: "red" },
                    { area: "Property", color: "amber" },
                    { area: "Family", color: "pink" },
                    { area: "Civil", color: "blue" },
                    { area: "Tax", color: "emerald" },
                    { area: "Immigration", color: "indigo" },
                  ].map(({ area, color }) => {
                    const c = colorMap[color] || colorMap.blue;
                    return (
                      <div key={area} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border ${c.light} ${c.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${c.bg} flex-shrink-0`} />
                        <span className={`text-[10px] font-semibold truncate ${c.text}`}>{area}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}
          </div>
        </div>
        )}
      </div>
      </div>
    </div>
  );
}
