import { Loader2 } from "lucide-react";

export function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} size={20} />;
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
      <Spinner className="text-red-500" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 py-16 px-4 text-center">
      <p className="text-base font-medium text-red-300">Something went wrong</p>
      <p className="mt-2 max-w-md text-sm text-zinc-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700/60 bg-zinc-900/40 py-16 px-4 text-center">
      <div className="mb-3 text-zinc-500">{icon}</div>
      <p className="text-base font-medium text-zinc-300">{title}</p>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-zinc-500">{subtitle}</p>}
    </div>
  );
}
