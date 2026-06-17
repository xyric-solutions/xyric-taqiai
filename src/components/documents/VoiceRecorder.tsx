"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Loader2, Check, Upload, FileAudio } from "lucide-react";

interface VoiceRecording {
  id: string;
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  source: "mic" | "upload";
  fileName?: string;
  transcription?: string;
  isTranscribing?: boolean;
}

interface VoiceRecorderProps {
  onTranscriptionsReady: (combinedText: string) => void;
}

export default function VoiceRecorder({ onTranscriptionsReady }: VoiceRecorderProps) {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Notify parent whenever transcriptions change (avoids setState-in-render)
  useEffect(() => {
    const combined = recordings
      .filter((r) => r.transcription)
      .map((r) => r.transcription)
      .join("\n\n");
    onTranscriptionsReady(combined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordings]);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = (Date.now() - startTimeRef.current) / 1000;

        const recording: VoiceRecording = {
          id: Math.random().toString(36).slice(2),
          audioBlob,
          audioUrl,
          duration,
          source: "mic",
        };

        setRecordings((prev) => [...prev, recording]);
        transcribeRecording(recording);

        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      startTimeRef.current = Date.now();
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Microphone access denied: ${err.message}`
          : "Microphone access error. Please check browser permissions."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setError("Only audio files are supported (MP3, M4A, WAV, WebM, OGG)");
      if (uploadInputRef.current) uploadInputRef.current.value = "";
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("Audio file must be under 25MB");
      if (uploadInputRef.current) uploadInputRef.current.value = "";
      return;
    }

    setError("");
    const audioUrl = URL.createObjectURL(file);
    const recording: VoiceRecording = {
      id: Math.random().toString(36).slice(2),
      audioBlob: file,
      audioUrl,
      duration: 0,
      source: "upload",
      fileName: file.name,
    };

    // Read duration from metadata (best-effort)
    const probe = new Audio(audioUrl);
    probe.onloadedmetadata = () => {
      const d = isFinite(probe.duration) ? probe.duration : 0;
      setRecordings((prev) => prev.map((r) => (r.id === recording.id ? { ...r, duration: d } : r)));
    };

    setRecordings((prev) => [...prev, recording]);
    transcribeRecording(recording);
    if (uploadInputRef.current) uploadInputRef.current.value = "";
  };

  const transcribeRecording = async (recording: VoiceRecording) => {
    setRecordings((prev) =>
      prev.map((r) => (r.id === recording.id ? { ...r, isTranscribing: true } : r))
    );

    try {
      const formData = new FormData();
      formData.append("audio", recording.audioBlob, recording.fileName || "recording.webm");

      const res = await fetch("/api/ai/voice-transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Transcription failed");

      const data = await res.json();

      setRecordings((prev) =>
        prev.map((r) =>
          r.id === recording.id
            ? { ...r, transcription: data.transcription, isTranscribing: false }
            : r
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed");
      setRecordings((prev) =>
        prev.map((r) => (r.id === recording.id ? { ...r, isTranscribing: false } : r))
      );
    }
  };

  const deleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
          <Mic className="h-3.5 w-3.5" />
          Voice Recording / آواز ریکارڈنگ
          {recordings.length > 0 && (
            <span className="text-xs bg-primary-500/15 text-primary-400 px-2 py-0.5 rounded-full">
              {recordings.length}
            </span>
          )}
        </label>
      </div>

      {/* Record / Upload */}
      {isRecording ? (
        <div className="p-4 bg-danger-500/10 border-2 border-danger-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-danger-500 flex items-center justify-center animate-pulse">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <span className="absolute inset-0 rounded-full bg-danger-500 animate-ping opacity-30" />
              </div>
              <div>
                <p className="text-sm font-semibold text-danger-500">Recording discussion...</p>
                <p className="text-xs text-danger-500 font-mono">{formatTime(recordingTime)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-500/80 font-medium text-sm transition-colors"
            >
              <Square className="h-4 w-4" /> Stop
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--border-default)] rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:border-primary-500 hover:bg-primary-500/5 hover:text-primary-400 transition-colors"
          >
            <Mic className="h-4 w-4" />
            Record Discussion
          </button>
          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[var(--border-default)] rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:border-primary-500 hover:bg-primary-500/5 hover:text-primary-400 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Audio File
          </button>
        </div>
      )}

      <input
        ref={uploadInputRef}
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <div className="text-xs text-danger-500 bg-danger-500/10 border border-danger-500/30 rounded-lg p-2.5">
          {error}
        </div>
      )}

      {/* Recordings List */}
      {recordings.length > 0 && (
        <div className="space-y-2">
          {recordings.map((rec, idx) => (
            <div key={rec.id} className="p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-default)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-500/15 text-primary-400">
                  {rec.source === "upload" ? <FileAudio className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </div>

                {/* Audio player */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] truncate">
                      {rec.source === "upload" ? (rec.fileName || "Audio file") : `Recording ${idx + 1}`}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)] flex-shrink-0 ml-2">{rec.duration ? formatTime(rec.duration) : ""}</span>
                  </div>
                  <audio controls src={rec.audioUrl} className="w-full h-8" style={{ maxWidth: "100%" }} />
                </div>

                <button
                  type="button"
                  onClick={() => deleteRecording(rec.id)}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-danger-500 hover:bg-danger-500/10 flex-shrink-0 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Transcription */}
              {rec.isTranscribing ? (
                <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  AI transcribing voice...
                </div>
              ) : rec.transcription ? (
                <div className="mt-2 p-2.5 bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-lg">
                  <div className="flex items-start gap-1.5">
                    <Check className="h-3.5 w-3.5 text-success-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{rec.transcription}</p>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
