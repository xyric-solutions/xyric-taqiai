"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Scale } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8 lg:hidden">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
          <Scale className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-display text-2xl font-extrabold" style={{ color: "#e2e8f0" }}>TaqiAI</h1>
        <p className="text-sm mt-1" style={{ color: "#475569" }}>Pakistani Law Assistant</p>
      </div>

      <div className="auth-card rounded-2xl p-8" style={{ background: "#0b0f1a", border: "1px solid #141e35", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
        <div className="mb-6">
          <h2 className="font-display text-xl font-extrabold" style={{ color: "#e2e8f0" }}>Welcome back</h2>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl p-3.5 text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>{error}</div>
          )}
          <Input type="email" label="Email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" label="Password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#94a3b8" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary-400 hover:text-primary-300">Register</Link>
        </p>
      </div>
    </div>
  );
}
