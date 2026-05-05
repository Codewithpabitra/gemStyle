import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { PrivateRoute, PublicOnlyRoute } from "@/components/auth/RouteGuards";

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import StudioPage from "@/pages/StudioPage";
import GalleryPage from "@/pages/GalleryPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Public-Only Routes (redirect to /dashboard if logged in) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/studio"
            element={
              <PrivateRoute>
                <StudioPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <PrivateRoute>
                <GalleryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--card)",
              color: "var(--text)",
              border: "1px solid var(--border-strong)",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "var(--font-body)",
            },
            success: {
              iconTheme: { primary: "var(--accent)", secondary: "#0d0d0f" },
            },
            error: {
              iconTheme: { primary: "var(--danger)", secondary: "#fff" },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}