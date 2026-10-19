import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { navigate } from "@/lib/router";
import { bootstrapAdmin } from "@/lib/matchesApi";
import { Spinner } from "@/components/ui/states";
import { Shield, Lock, Mail, Radio, Info, CheckCircle2 } from "lucide-react";

export function AdminLoginPage() {
  const { signIn, signUp, session, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [bootstrapMsg, setBootstrapMsg] = useState<string | null>(null);
  const [bootstrapErr, setBootstrapErr] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="text-red-500" />
      </div>
    );
  }

  if (session && isAdmin) {
    // Already an admin — redirect to dashboard.
    navigate("/admin");
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const fn = mode === "login" ? signIn : signUp;
      const { error: err } = await fn(email.trim(), password);
      if (err) setError(err);
    } finally {
      setBusy(false);
    }
  };

  const onBootstrap = async () => {
    setBootstrapErr(null);
    setBootstrapMsg(null);
    setBusy(true);
    const { error: err } = await bootstrapAdmin();
    setBusy(false);
    if (err) setBootstrapErr(err);
    else
      setBootstrapMsg(
        "You are now the first admin. Reload the dashboard to manage matches."
      );
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-900/40">
            <Shield size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="mt-1 text-sm text-zinc-400">Sign in to manage match listings on StreamZone Live.</p>
        </div>

        <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/60 p-6 sm:p-8">
          <div className="mb-6 flex rounded-lg bg-zinc-800/60 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                mode === "login" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                mode === "signup" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {busy ? <Spinner className="text-white" /> : <Shield size={16} />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {session && !isAdmin && (
            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-start gap-2">
                <Info size={16} className="mt-0.5 flex-shrink-0 text-amber-400" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-amber-200">
                    You're signed in but not an admin yet.
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    If no admin exists yet, you can promote yourself to become the first admin. Once an
                    admin exists, only they can promote others (via the database).
                  </p>
                  <button
                    onClick={onBootstrap}
                    disabled={busy}
                    className="mt-3 flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-500 disabled:opacity-60"
                  >
                    {busy ? <Spinner className="text-white" /> : <Shield size={14} />}
                    Promote me to admin
                  </button>
                  {bootstrapMsg && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300">
                      <CheckCircle2 size={14} /> {bootstrapMsg}
                    </div>
                  )}
                  {bootstrapErr && (
                    <div className="mt-2 text-xs text-red-300">{bootstrapErr}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Radio size={12} className="text-red-500" /> StreamZone Live admin
        </div>
      </div>
    </div>
  );
}
