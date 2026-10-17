"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Briefcase, FileText, Receipt,
  CreditCard, Package, UserCheck, MessageSquare,
  History, Bell, Settings, X, TrendingUp,
} from "lucide-react";

const NAV_ITEMS = [
  {
    section: "Main",
    items: [
      { id: "dashboard",  label: "Dashboard",        href: "/crm/dashboard",               icon: LayoutDashboard, roles: ["owner","manager","accountant","executive"] },
      { id: "clients",    label: "Clients",           href: "/crm/dashboard/clients",       icon: Users,           roles: ["owner","manager","executive"] },
      { id: "projects",   label: "Projects",          href: "/crm/dashboard/projects",      icon: Briefcase,       roles: ["owner","manager","executive"] },
      { id: "enquiries",  label: "Enquiries",         href: "/crm/dashboard/enquiries",     icon: MessageSquare,   roles: ["owner","manager","executive"] },
    ],
  },
  {
    section: "Sales",
    items: [
      { id: "proposals",  label: "Proposals",         href: "/crm/dashboard/proposals",     icon: FileText,        roles: ["owner","manager","executive"] },
      { id: "quotations", label: "Quotations",        href: "/crm/dashboard/quotations",    icon: Receipt,         roles: ["owner","manager"] },
      { id: "invoices",   label: "Invoices",          href: "/crm/dashboard/invoices",      icon: FileText,        roles: ["owner","manager","accountant"] },
      { id: "payments",   label: "Payments",          href: "/crm/dashboard/payments",      icon: CreditCard,      roles: ["owner","manager","accountant"] },
    ],
  },
  {
    section: "Manage",
    items: [
      { id: "services",      label: "Service Catalog", href: "/crm/dashboard/services",      icon: Package,         roles: ["owner","manager"] },
      { id: "pending-users", label: "User Approvals",  href: "/crm/dashboard/pending-users", icon: UserCheck,       roles: ["owner","manager"] },
      { id: "history",       label: "Activity Log",    href: "/crm/dashboard/history",       icon: History,         roles: ["owner","manager"] },
      { id: "notifications", label: "Notifications",   href: "/crm/dashboard/notifications", icon: Bell,            roles: ["owner","manager","accountant","executive"] },
      { id: "settings",      label: "Settings",        href: "/crm/dashboard/settings",      icon: Settings,        roles: ["owner","manager"] },
    ],
  },
];

export default function CrmSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState("executive");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("crm_user") || "{}");
      if (u.role) setUserRole(u.role);
    } catch {}
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isActive = (href) =>
    href === "/crm/dashboard"
      ? pathname === "/crm/dashboard"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,.5)",
            zIndex: 99,
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      <aside style={{
        width: "230px",
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        scrollbarColor: "#e2e8f0 transparent",
        position: isMobile ? "fixed" : "relative",
        top: 0, left: 0,
        zIndex: isMobile ? 100 : "auto",
        transform: isMobile ? (mobileOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "transform .28s cubic-bezier(.4,0,.2,1)",
        boxShadow: isMobile && mobileOpen ? "6px 0 28px rgba(0,0,0,.14)" : "none",
      }}>

        {/* ── Logo ── */}
        <div style={{
          padding: "16px 18px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0, minHeight: "66px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* DigiKraft Logo image */}
            <img
              src="/assets/imgs/template/logo.png"
              alt="DigiKraft Social"
              style={{ height: "28px", objectFit: "contain", display: "block" }}
              onError={e => { e.target.style.display = "none"; }}
            />
            {/* CRM badge */}
            <span style={{
              fontSize: "9px", fontWeight: "800", letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "#fff",
              padding: "2px 7px", borderRadius: "5px",
              lineHeight: "16px",
            }}>CRM</span>
          </div>

          {/* Close — mobile only */}
          {isMobile && (
            <button onClick={onClose} style={{
              background: "#f1f5f9", border: "none", borderRadius: "7px",
              width: "30px", height: "30px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#64748b", flexShrink: 0,
            }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── Nav sections ── */}
        <div style={{ flex: 1, padding: "8px 0 4px", overflowY: "auto" }}>
          {NAV_ITEMS.map(section => {
            const visible = section.items.filter(i => i.roles.includes(userRole));
            if (!visible.length) return null;
            return (
              <div key={section.section} style={{ marginBottom: "4px" }}>
                <p style={{
                  fontSize: "9.5px", fontWeight: "700", letterSpacing: ".1em",
                  textTransform: "uppercase", color: "#b0bec5",
                  padding: "8px 18px 3px", margin: 0,
                }}>{section.section}</p>

                <nav style={{ padding: "0 8px" }}>
                  {visible.map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={isMobile ? onClose : undefined}
                        style={{
                          display: "flex", alignItems: "center", gap: "9px",
                          padding: "9px 11px", borderRadius: "8px",
                          textDecoration: "none", fontSize: "13px", fontWeight: active ? "600" : "500",
                          marginBottom: "1px",
                          background: active ? "linear-gradient(135deg,#22c55e,#16a34a)" : "transparent",
                          color: active ? "#fff" : "#4a5568",
                          transition: "all .15s",
                          boxShadow: active ? "0 2px 8px rgba(34,197,94,.25)" : "none",
                        }}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.color = "#15803d"; } }}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4a5568"; } }}
                      >
                        <Icon size={15} style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }} />
                        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* ── Other Portals ── */}
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "10px 10px 6px", flexShrink: 0 }}>
          <p style={{ fontSize: "9px", fontWeight: "700", color: "#b0bec5", textTransform: "uppercase", letterSpacing: ".1em", padding: "0 8px 5px", margin: 0 }}>
            Other Portals
          </p>
          {[
            { href: "/hrm/login",  label: "HR Management",   short: "HRM", color: "#7c3aed", bg: "#f5f3ff" },
            { href: "/emp/login",  label: "Employee Portal",  short: "EMP", color: "#2563eb", bg: "#eff6ff" },
            { href: "/admin/login",label: "Content Admin",   short: "CMS", color: "#0891b2", bg: "#ecfeff" },
          ].map(p => (
            <a key={p.href} href={p.href} target="_blank" rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: "9px",
                padding: "7px 10px", borderRadius: "7px",
                textDecoration: "none", fontSize: "12px", fontWeight: "500",
                color: "#4a5568", transition: "all .15s", marginBottom: "1px",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = p.bg; e.currentTarget.style.color = p.color; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#4a5568"; }}>
              <span style={{
                fontSize: "8px", fontWeight: "800", padding: "2px 5px",
                borderRadius: "4px", background: p.color, color: "#fff",
                letterSpacing: ".05em", flexShrink: 0,
              }}>{p.short}</span>
              {p.label}
              <span style={{ marginLeft: "auto", fontSize: "11px", opacity: 0.4 }}>↗</span>
            </a>
          ))}
        </div>

        {/* ── Role badge ── */}
        <div style={{ padding: "10px 18px 14px", flexShrink: 0 }}>
          <span style={{
            fontSize: "9.5px", fontWeight: "700", color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: ".07em",
          }}>
            Role: {userRole}
          </span>
        </div>
      </aside>
    </>
  );
}
