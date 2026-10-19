import { Radio, Shield } from "lucide-react";
import { navigate } from "@/lib/router";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-black/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-700">
                <Radio size={16} className="text-white" />
              </div>
              <span className="text-base font-bold text-white">
                StreamZone <span className="text-red-500">Live</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              A live sports streaming portal linking you to verified, official broadcasts. We never bypass
              DRM, geo-restrictions, or access controls, and never extract unauthorized streams.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Links</p>
            <button onClick={() => navigate("/")} className="text-sm text-zinc-400 hover:text-white">
              Home
            </button>
            <button onClick={() => navigate("/admin")} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
              <Shield size={14} /> Admin
            </button>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-800/60 pt-6 text-xs text-zinc-600">
          © {new Date().getFullYear()} StreamZone Live. Links to official sources only. No pirated streams.
        </div>
      </div>
    </footer>
  );
}
