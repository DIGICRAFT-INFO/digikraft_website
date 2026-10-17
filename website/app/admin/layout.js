"use client";

import { usePathname } from "next/navigation";
import Asidebar from "./components/layout/Asidebar";
import Header from "./components/layout/Header";
import "./globals.css";
import AuthProvider from "@/context/ProtectedRoute";

// Auth-only pages — no sidebar/header/ProtectedRoute wrapper
const AUTH_PATHS = ["/admin/login", "/admin/register"];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // ─── Login / Register pages: bare layout, no sidebar or header ───
  if (isAuthPage) {
    return <>{children}</>;
  }

  // ─── All other admin pages: full dashboard layout ───
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#f8faf5",
      }}
    >
      {/* Left Side Fixed Sidebar Panel */}
      <Asidebar />

      {/* Right Side Working Column */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
        }}
      >
        {/* Top Bar Header */}
        <Header />

        {/* Main Content Area */}
        <main style={{ flex: 1, width: "100%", overflowY: "auto" }}>
          <AuthProvider>{children}</AuthProvider>
        </main>
      </div>
    </div>
  );
}
