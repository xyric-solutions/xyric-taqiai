"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Loader2, User, Briefcase, Check } from "lucide-react";

interface VoiceRecording {
  id: string;
  speaker: "client" | "lawyer";
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  transcription?: string;
  isTranscribing?: boolean;
}

interface VoiceRecorderProps {
  onTranscriptionsReady: (combinedText: string) => void;
}

export default function VoiceRecorder({ onTranscriptionsReady }: VoiceRecorderProps) {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<"client" | "lawyer">("client");
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

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
      .map((r) => {
        const label = r.speaker === "lawyer" ? "LAWYER" : "CLIENT";
        return `[${label}]: ${r.transcription}`;
      })
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
          speaker: currentSpeaker,
          audioBlob,
          audioUrl,
          duration,
        };

        setRecordings((prev) => [...prev, recording]);

        // Auto-transcribe
        transcribeRecording(recording);

        // Cleanup
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

  const transcribeRecording = async (recording: VoiceRecording) => {
    setRecordings((prev) =>
      prev.map((r) => (r.id === recording.id ? { ...r, isTranscribing: true } : r))
    );

    try {
      const formData = new FormData();
      formData.append("audio", recording.audioBlob, "recording.webm");
      formData.append("speaker", recording.speaker);

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
        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <Mic className="h-3.5 w-3.5" />
          Voice Recording / آواز ریکارڈنگ
          {recordings.length > 0 && (
            <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
              {recordings.length}
            </span>
          )}
        </label>
      </div>

      {/* Speaker Toggle */}
      {!isRecording && (
        <div className="flex bg-slate-100 rounded-xl p-1 w-full">
          <button
            type="button"
            onClick={() => setCurrentSpeaker("client")}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
              currentSpeaker === "client" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <User className="h-4 w-4" />
            Client / موکل
          </button>
          <button
            type="button"
            onClick={() => setCurrentSpeaker("lawyer")}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
              currentSpeaker === "lawyer" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Lawyer / وکیل
          </button>
        </div>
      )}

      {/* Recording Button */}
      {isRecording ? (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700">Recording {currentSpeaker === "lawyer" ? "Lawyer" : "Client"}...</p>
                <p className="text-xs text-red-600 font-mono">{formatTime(recordingTime)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
            >
              <Square className="h-4 w-4" /> Stop
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:border-primary-400 hover:bg-primary-50/50 hover:text-primary-600"
        >
          <Mic className="h-4 w-4" />
          Start Recording ({currentSpeaker === "lawyer" ? "Lawyer" : "Client"}) / ریکارڈنگ شروع کریں
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
          {error}
        </div>
      )}

      {/* Recordings List */}
      {recordings.length > 0 && (
        <div className="space-y-2">
          {recordings.map((rec) => (
            <div key={rec.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                {/* Speaker icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  rec.speaker === "lawyer" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                }`}>
                  {rec.speaker === "lawyer" ? <Briefcase className="h-5 w-5" /> : <User className="h-5 w-5" />}
                </div>

                {/* Audio player */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">
                      {rec.speaker === "lawyer" ? "Lawyer / وکیل" : "Client / موکل"}
                    </span>
                    <span className="text-[10px] text-slate-500">{formatTime(rec.duration)}</span>
                  </div>
                  <audio controls src={rec.audioUrl} className="w-full h-8" style={{ maxWidth: "100%" }} />
                </div>

                <button
                  type="button"
                  onClick={() => deleteRecording(rec.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Transcription */}
              {rec.isTranscribing ? (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  AI transcribing voice...
                </div>
              ) : rec.transcription ? (
                <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-start gap-1.5">
                    <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 leading-relaxed">{rec.transcription}</p>
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
