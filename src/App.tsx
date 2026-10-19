import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter, navigate } from "@/lib/router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/HomePage";
import { MatchPage } from "@/pages/MatchPage";
import { AdminLoginPage } from "@/pages/AdminLoginPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { useEffect } from "react";

function Routes() {
  const route = useRouter();
  const { isAdmin, loading } = useAuth();

  // Guard admin routes: redirect to login if not an admin (after auth resolves).
  useEffect(() => {
    if (!loading && route.path.startsWith("/admin") && route.path !== "/admin" && !isAdmin) {
      navigate("/admin");
    }
  }, [route.path, isAdmin, loading]);

  if (route.path === "/") return <HomePage />;
  if (route.path === "/match/:id") return <MatchPage id={route.params.id} />;
  if (route.path === "/admin") {
    // If signed in and admin, show dashboard; otherwise show login.
    return isAdmin ? <AdminDashboardPage /> : <AdminLoginPage />;
  }
  if (route.path === "/admin/new" || route.path === "/admin/match/:id") {
    return isAdmin ? <AdminDashboardPage /> : <AdminLoginPage />;
  }
  return <HomePage />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Header />
        <main>
          <Routes />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
