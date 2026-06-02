import LampPanel from "@/components/LampPanel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-root min-h-screen flex" style={{ background: "#07090f" }}>
      {/* Left side - branding with interactive pull-cord lamp */}
      <LampPanel />

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#07090f" }}>
        {children}
      </div>
    </div>
  );
}
