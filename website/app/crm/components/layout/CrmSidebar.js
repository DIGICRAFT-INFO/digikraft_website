"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Briefcase, FileText, Receipt,
  CreditCard, Image, DollarSign, ShieldAlert, MessageSquare,
  Clock, Bell, Wrench, X,
} from "lucide-react";

const navItems = [
  { id: "dashboard",     label: "Dashboard",     href: "/crm/dashboard",                icon: LayoutDashboard, roles: ["owner","manager","accountant","executive"] },
  { id: "clients",       label: "Clients",        href: "/crm/dashboard/clients",        icon: Users,           roles: ["owner","manager","executive"] },
  { id: "services",      label: "Services",       href: "/crm/dashboard/services",       icon: Wrench,          roles: ["owner","manager"] },
  { id: "projects",      label: "Projects",       href: "/crm/dashboard/projects",       icon: Briefcase,       roles: ["owner","manager","executive"] },
  { id: "proposals",     label: "Proposals",      href: "/crm/dashboard/proposals",      icon: FileText,        roles: ["owner","manager","executive"] },
  { id: "quotations",    label: "Quotations",     href: "/crm/dashboard/quotations",     icon: Receipt,         roles: ["owner","manager"] },
  { id: "invoices",      label: "Invoices",       href: "/crm/dashboard/invoices",       icon: FileText,        roles: ["owner","manager","accountant"] },
  { id: "portfolio",     label: "Portfolio",      href: "/crm/dashboard/portfolio",      icon: Image,           roles: ["owner","manager"] },
  { id: "payments",      label: "Payments",       href: "/crm/dashboard/payments",       icon: CreditCard,      roles: ["owner","manager","accountant"] },
  { id: "pending-users", label: "Pending Users",  href: "/crm/dashboard/pending-users",  icon: ShieldAlert,     roles: ["owner","manager"] },
  { id: "enquiries",     label: "Enquiries",      href: "/crm/dashboard/enquiries",      icon: MessageSquare,   roles: ["owner","manager","executive"] },
  { id: "history",       label: "History",        href: "/crm/dashboard/history",        icon: Clock,           roles: ["owner","manager"] },
  { id: "notifications", label: "Notifications",  href: "/crm/dashboard/notifications",  icon: Bell,            roles: ["owner","manager","accountant","executive"] },
  { id: "settings",      label: "Settings",        href: "/crm/dashboard/settings",        icon: Wrench,          roles: ["owner","manager"] },
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

  // Track mobile breakpoint reliably via resize listener
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visible = navItems.filter(i => i.roles.includes(userRole));

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,.45)",
            zIndex: 99,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      <aside
        style={{
          width: "220px",
          height: "100vh",
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflowY: "auto",
          overflowX: "hidden",
          // On mobile: fixed + slide in/out. On desktop: static in flex row.
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          zIndex: isMobile ? 100 : "auto",
          transform: isMobile ? (mobileOpen ? "translateX(0)" : "translateX(-100%)") : "none",
          transition: "transform .28s cubic-bezier(.4,0,.2,1)",
          boxShadow: isMobile && mobileOpen ? "4px 0 24px rgba(0,0,0,.12)" : "none",
        }}>

        {/* Logo */}
        <div style={{
          padding: "18px 18px 14px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px",
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#14532d", lineHeight: 1.1 }}>DigiKraft</div>
              <div style={{ fontSize: "9px", color: "#16a34a", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" }}>CRM</div>
            </div>
          </div>
          {/* Close btn — mobile only */}
          {isMobile && (
            <button onClick={onClose} style={{
              background: "#f1f5f9", border: "none", borderRadius: "6px",
              width: "28px", height: "28px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#64748b",
            }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Section label */}
        <p style={{
          fontSize: "10px", fontWeight: "700", letterSpacing: ".1em",
          textTransform: "uppercase", color: "#94a3b8",
          padding: "10px 18px 4px", margin: 0, flexShrink: 0,
        }}>Menu</p>

        {/* Nav links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 10px", flex: 1 }}>
          {visible.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href
              || (item.href !== "/crm/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                style={{
                  display: "flex", alignItems: "center", gap: "9px",
                  padding: "10px 11px", borderRadius: "8px",
                  textDecoration: "none", fontSize: "13px", fontWeight: "500",
                  transition: "background .15s, color .15s",
                  background: active ? "linear-gradient(135deg,#22c55e,#16a34a)" : "transparent",
                  color: active ? "#fff" : "#475569",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role footer */}
        {/* Other Portals — HRM + EMP */}
        <div style={{ borderTop:"1px solid #f1f5f9", margin:"8px 10px 0", paddingTop:8 }}>
          <p style={{ fontSize:"9px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:".1em", padding:"0 8px 4px", margin:0 }}>Other Portals</p>
          {[{ href:"/hrm/login", label:"HRM Portal", color:"#7c3aed", bg:"#f5f3ff", badge:"New" },
            { href:"/emp/login", label:"EMP Portal", color:"#2563eb", bg:"#eff6ff", badge:"New" }].map(p => (
            <a key={p.href} href={p.href} target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", borderRadius:"7px", textDecoration:"none", color:p.color, fontSize:"12px", fontWeight:"600", transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background=p.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:p.color, flexShrink:0 }}/>
              {p.label}
              <span style={{ fontSize:"8px",fontWeight:700,background:p.color,color:"#fff",padding:"1px 5px",borderRadius:8,marginLeft:2 }}>{p.badge}</span>
              <span style={{ marginLeft:"auto", fontSize:"10px" }}>↗</span>
            </a>
          ))}
        </div>

        <div style={{
          padding: "12px 18px", borderTop: "1px solid #f1f5f9", flexShrink: 0,
        }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".05em" }}>
            Role: {userRole}
          </div>
        </div>
      </aside>
    </>
  );
}
