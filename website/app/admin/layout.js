import Asidebar from "./components/layout/Asidebar";
import Header from "./components/layout/Header";
import "./globals.css";
import AuthProvider from "@/context/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#f8faf5" }}>
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
        {/* Top Bar Header Content */}
        <Header />

        {/* Main Center Area */}
        <main style={{ flex: 1, width: "100%", overflowY: "auto" }}>
          <AuthProvider>{children}</AuthProvider>
        </main>
      </div>
    </div>
  );
}
