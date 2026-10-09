"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import CrmSidebar from "../components/layout/CrmSidebar";
import CrmHeader from "../components/layout/CrmHeader";
import CRM_API from "@/utils/crmApi";
import "../../crm/crm.css";

export default function CrmDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    if (!token) { router.replace("/crm/login"); return; }

    // Verify token is still valid every route change
    CRM_API.get("/auth/verify")
      .then(() => setAuthChecked(true))
      .catch(() => {
        localStorage.removeItem("crm_token");
        localStorage.removeItem("crm_user");
        router.replace("/crm/login");
      });
  }, [pathname, router]);

  if (!authChecked) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f0fdf4", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #dcfce7", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 14px" }} />
          <p style={{ color: "#16a34a", fontWeight: "600", fontSize: "14px", margin: 0 }}>Loading CRM…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div className="crm-layout" style={{ height: "100vh", overflow: "hidden", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <CrmSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="crm-main" style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <CrmHeader onMenuToggle={() => setMobileOpen(prev => !prev)} />
        <main className="crm-content" style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
