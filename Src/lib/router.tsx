import { useEffect, useState } from "react";

export interface Route {
  path: string;
  params: Record<string, string>;
}

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const parts = hash.split("/").filter(Boolean);
  // route shapes: /, /match/:id, /admin, /admin/match/:id, /admin/new, /admin/login
  if (parts.length === 0) return { path: "/", params: {} };
  if (parts[0] === "match" && parts[1]) {
    return { path: "/match/:id", params: { id: parts[1] } };
  }
  if (parts[0] === "admin") {
    if (parts[1] === "new") return { path: "/admin/new", params: {} };
    if (parts[1] === "match" && parts[2]) {
      return { path: "/admin/match/:id", params: { id: parts[2] } };
    }
    return { path: "/admin", params: {} };
  }
  return { path: "/", params: {} };
}

export function navigate(to: string) {
  const target = to.startsWith("#") ? to : `#${to}`;
  if (window.location.hash === target) {
    // force re-render even if same hash
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = target;
  }
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

export function Link({
  to,
  children,
  className,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

export function useRouter(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
