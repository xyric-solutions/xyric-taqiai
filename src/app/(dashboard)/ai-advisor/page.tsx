"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Send, Scale, Trash2, ExternalLink, Sparkles, BookOpen, ChevronRight, Mic, MicOff, ImagePlus, X, ThumbsUp, ThumbsDown, Pencil, BookmarkPlus, AlertTriangle, Check } from "lucide-react";
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
}

interface ApiChatMessage {
  id: string;
  role: string;
  content: string;
}

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Load most recent session or create a new one
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chat/sessions", { credentials: "include" });
        if (!res.ok) return;
        const data = (await res.json()) as { sessions: ApiChatSession[] };
        if (data.sessions.length > 0) {
          const latest = data.sessions[0];
          setSessionId(latest.id);
          const sRes = await fetch(`/api/chat/sessions/${latest.id}`, { credentials: "include" });
          if (sRes.ok) {
            const sData = (await sRes.json()) as { session: { messages: ApiChatMessage[] } };
            setMessages(
              sData.session.messages.map((m) => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.content,
              }))
            );
          }
        } else {
          const newRes = await fetch("/api/chat/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({}),
          });
          if (newRes.ok) {
            const newData = (await newRes.json()) as { session: ApiChatSession };
            setSessionId(newData.session.id);
          }
        }
      } catch {
        // silent — chat works without persistence as a fallback
      }
    })();
  }, []);

  const persistMessage = async (role: "user" | "assistant", content: string) => {
    if (!sessionId) return;
    try {
      await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role, content }),
      });
    } catch {
      // fire-and-forget — don't block UX
    }
  };

  const handleNewSession = async () => {
    setMessages([]);
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
      }
    } catch {
      // ignore
    }
  };

  // Real-time intent detection on input
  const currentIntent = useMemo(() => detectIntent(input), [input]);
  const detectedIntents = useMemo(() => detectAllIntents(input), [input]);
  const primaryIntent = detectedIntents[0] || null;
  const _primaryMeta = useMemo(() => getIntentMeta(currentIntent), [currentIntent]);

  // ===== VOICE RECORDING =====
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access denied. Please allow microphone permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(",")[1];
        const res = await fetch("/api/ai/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio: base64Audio }),
        });
        if (!res.ok) throw new Error("Transcription failed");
        const data = await res.json();
        if (data.text) {
          setInput((prev) => prev ? `${prev} ${data.text}` : data.text);
        }
        setLoading(false);
      };
    } catch {
      setLoading(false);
      alert("Voice transcription failed. Please try again.");
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

    const userMessage: Message = {
      role: "user",
      content: input.trim() || (uploadedImage ? "Analyze this legal document" : ""),
      image: uploadedImage || undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    void persistMessage("user", userMessage.content);
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
            updateLast({ sources: Array.isArray(evt.sources) ? evt.sources : [] });
          } else if (evt.type === "error") {
            streamError = evt.error || "AI response failed.";
          }
        }
      }

      if (rafId !== 0) cancelAnimationFrame(rafId);
      const finalText = full || streamError || "Sorry, I encountered an error. Please try again.";
      updateLast({ content: finalText, isUncertain: isUncertainResponse(finalText) });
      void persistMessage("assistant", finalText);
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

  return (
    <div className="h-full flex flex-col gap-4">
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
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleNewSession}>
            <Trash2 className="h-4 w-4" /> New Chat
          </Button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
        {/* ===== CHAT PANEL ===== */}
        <Card className="flex-1 flex flex-col overflow-hidden min-h-[300px] sm:min-h-[400px]">
          {/* Messages */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
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
                    <div className="max-w-[85%] sm:max-w-[75%] mb-1 flex items-center gap-1.5 px-2.5 py-1 bg-warning-500/10 border border-warning-500/25 rounded-lg">
                      <AlertTriangle className="h-3 w-3 text-warning-500 flex-shrink-0" />
                      <p className="text-[10px] text-warning-500 font-medium">Uncertain response — please verify with a qualified lawyer</p>
                    </div>
                  )}

                  {/* Message bubble or edit form */}
                  {editingIndex === i ? (
                    <div className="max-w-[85%] sm:max-w-[75%] w-full space-y-2">
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
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 border ${
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
                    <div className="max-w-[85%] sm:max-w-[75%] mt-1.5 p-2.5 rounded-xl" style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                        <BookOpen className="h-3 w-3 text-success-500" /> Verified from your archive
                      </p>
                      <div className="flex flex-col gap-1">
                        {msg.sources.map((s) => (
                          <Link
                            key={s.id}
                            href={`/case-law?q=${encodeURIComponent(s.citation)}&mode=${s.reported ? "citation" : "keyword"}`}
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
                    <div className="max-w-[85%] sm:max-w-[75%] mt-1 flex items-start gap-1.5 px-2 py-1.5 bg-warning-500/10 border border-warning-500/25 rounded-xl">
                      <span className="text-warning-500 text-[10px] mt-0.5 flex-shrink-0">⚠</span>
                      <p className="text-[10px] leading-tight" style={{ color: "var(--text-secondary)" }}>
                        <span className="font-semibold text-warning-500">AI Disclaimer:</span> This AI response is general legal information only — not formal legal advice. Please consult a registered lawyer for your specific case. / یہ عمومی قانونی معلومات ہیں، باقاعدہ قانونی مشورہ نہیں۔
                      </p>
                    </div>
                  )}

                  {/* S04-03: Approve / Edit / Reject buttons */}
                  {msg.role === "assistant" && editingIndex !== i && msg.approval === "pending" && (
                    <div className="max-w-[85%] sm:max-w-[75%] mt-1.5 flex items-center gap-1.5">
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
                    <div className="max-w-[85%] sm:max-w-[75%] mt-1.5 flex items-center gap-2">
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
                    <div className="max-w-[85%] sm:max-w-[75%] mt-1">
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

            {/* Input Row */}
            <div className="flex gap-2">
              {/* Voice Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading}
                className={`flex-shrink-0 p-2.5 rounded-xl border transition-all ${
                  isRecording
                    ? "bg-danger-500/10 border-danger-500/40 text-danger-500 animate-pulse"
                    : "text-[var(--text-tertiary)] border-[var(--border-default)] bg-[var(--bg-surface-2)] hover:text-primary-400 hover:border-primary-500/40"
                }`}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
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
                placeholder={isRecording ? "🎙️ Recording... speak now" : "Ask about Pakistani law... / پاکستانی قانون کے بارے میں پوچھیں..."}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-colors"
                style={{ background: "var(--bg-surface-2)", color: "var(--text-primary)", borderColor: "var(--border-default)" }}
                disabled={loading}
              />

              {/* Send Button */}
              <Button onClick={handleSend} disabled={(!input.trim() && !uploadedImage) || loading} size="lg" className="px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] mt-2 text-center" style={{ color: "var(--text-tertiary)" }}>
              🎙️ Voice input · 📷 Document photo · AI assistance only — not formal legal advice
            </p>
          </div>
        </Card>

        {/* ===== SMART INTENT PANEL (Right Side) ===== */}
        <div className="lg:w-[300px] flex-shrink-0 space-y-3 order-first lg:order-last">
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
            <Card className="p-4">
              <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary-500" />
                Smart Detection
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                Start typing your question — AI will automatically detect the legal area and suggest relevant templates, laws &amp; actions.
              </p>
              <p className="text-xs mt-2 leading-relaxed" dir="rtl" style={{ color: "var(--text-tertiary)" }}>
                اپنا سوال لکھنا شروع کریں - AI خود بخود قانونی شعبہ پہچان لے گا
              </p>
              <div className="mt-4 space-y-1.5">
                {["Criminal", "Property", "Family", "Civil", "Tax", "Immigration"].map((area) => (
                  <div key={area} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400/40" />
                    {area} Law Detection
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
