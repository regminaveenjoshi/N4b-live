import { Link, navigate, useRouter } from "@/lib/router";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Menu, X, Radio, Shield, LogOut, Home } from "lucide-react";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const route = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (p: string) => route.path === p;

  const navLinks = (
    <>
      <Link
        to="/"
        onClick={() => setOpen(false)}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive("/") ? "text-white" : "text-zinc-400 hover:text-white"
        }`}
      >
        <Home size={16} /> Home
      </Link>
      {isAdmin && (
        <Link
          to="/admin"
          onClick={() => setOpen(false)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            route.path.startsWith("/admin") ? "text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Shield size={16} /> Admin
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/60 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-900/40">
            <Radio size={18} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-white">
              StreamZone <span className="text-red-500">Live</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Official Sports</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">{navLinks}</nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400">{user.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700"
            >
              <Shield size={14} /> Admin login
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-zinc-300 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-zinc-800/60 bg-black/95 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">{navLinks}</div>
          <div className="mt-3 border-t border-zinc-800/60 pt-3">
            {user ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-zinc-400">{user.email}</span>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate("/admin");
                  setOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-200"
              >
                <Shield size={14} /> Admin login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
