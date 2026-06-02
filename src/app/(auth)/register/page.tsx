"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Scale } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", barCouncilId: "", phone: "", city: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6 lg:hidden">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
          <Scale className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-display text-2xl font-extrabold" style={{ color: "#e2e8f0" }}>TaqiAI</h1>
      </div>

      <div className="auth-card rounded-2xl p-8" style={{ background: "#0b0f1a", border: "1px solid #141e35", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
        <div className="mb-6">
          <h2 className="font-display text-xl font-extrabold" style={{ color: "#e2e8f0" }}>Create Account</h2>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>Register as a legal professional</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-xl p-3.5 text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>{error}</div>}
          <Input label="Full Name" placeholder="Your full name" value={formData.name} onChange={update("name")} required />
          <Input type="email" label="Email" placeholder="your@email.com" value={formData.email} onChange={update("email")} required />
          <Input type="password" label="Password" placeholder="Min 6 characters" value={formData.password} onChange={update("password")} required />
          <Input label="Bar Council License No." placeholder="Optional" value={formData.barCouncilId} onChange={update("barCouncilId")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone" placeholder="03XX-XXXXXXX" value={formData.phone} onChange={update("phone")} />
            <Input label="City" placeholder="Your city" value={formData.city} onChange={update("city")} />
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "#94a3b8" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary-400 hover:text-primary-300">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
