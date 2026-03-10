import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet, createRootRoute, redirect } from "@tanstack/react-router";
import Layout from "@/components/layout/Layout";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import PWAUpdatePrompt from "@/components/pwa/PWAUpdatePrompt";
import { useGlobalShortcuts } from "@/hooks/useKeyboardShortcuts";
import { authClient } from "@/lib/auth-client";

function GlobalShortcuts() {
  useGlobalShortcuts();
  return null;
}

function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        style={{ color: "var(--primary)", textDecoration: "underline" }}
      >
        Go back home
      </Link>
    </div>
  );
}

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    // Allow access to login page without authentication
    if (location.pathname === "/login" || location.pathname === "/login/") {
      return;
    }

    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => (
    <>
      <GlobalShortcuts />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Layout>
        <Outlet />
      </Layout>
      <PWAUpdatePrompt />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </>
  ),
  notFoundComponent: NotFound,
});
