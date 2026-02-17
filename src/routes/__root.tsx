import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import Layout from "@/components/layout/Layout";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import PWAUpdatePrompt from "@/components/pwa/PWAUpdatePrompt";

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
  component: () => (
    <>
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
