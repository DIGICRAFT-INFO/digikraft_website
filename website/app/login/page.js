"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const PORTALS = [
  {
    id:       "cms",
    label:    "CMS",
    name:     "Content Management",
    desc:     "Manage website content, blog posts, projects, homepage, SEO and all public-facing pages.",
    href:     "/admin/login",
    gradient: "linear-gradient(135deg,#16a34a 0%,#15803d 100%)",
    glow:     "rgba(22,163,74,.25)",
    badge:    "#f0fdf4",
    badgeC:   "#15803d",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    modules: ["Blog Posts","Projects","Homepage","SEO","Enquiries"],
  },
  {
    id:       "crm",
    label:    "CRM",
    name:     "Client Management",
    desc:     "Handle clients, projects, proposals, quotations, invoices, payments and business pipeline.",
    href:     "/crm/login",
    gradient: "linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)",
    glow:     "rgba(37,99,235,.25)",
    badge:    "#eff6ff",
    badgeC:   "#1d4ed8",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    modules: ["Clients","Proposals","Quotations","Invoices","Payments"],
  },
  {
    id:       "hrm",
    label:    "HRM",
    name:     "HR Management",
    desc:     "Manage employees, attendance, leaves, payroll, tasks, announcements and HR operations.",
    href:     "/hrm/login",
    gradient: "linear-gradient(135deg,#7c3aed 0%,#5b21b6 100%)",
    glow:     "rgba(124,58,237,.25)",
    badge:    "#f5f3ff",
    badgeC:   "#5b21b6",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    modules: ["Employees","Attendance","Leaves","Payroll","Reports"],
  },
  {
    id:       "emp",
    label:    "EMP",
    name:     "Employee Portal",
    desc:     "Self-service portal — check in/out, log tasks, apply leaves, download salary slips.",
    href:     "/emp/login",
    gradient: "linear-gradient(135deg,#0891b2 0%,#0e7490 100%)",
    glow:     "rgba(8,145,178,.25)",
    badge:    "#ecfeff",
    badgeC:   "#0e7490",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    modules: ["Check In/Out","My Tasks","Leaves","Salary Slips","Team Directory"],
  },
];

export default function LoginHub() {
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Remove any cursor overrides from global css
    const style = document.createElement("style");
    style.id = "hub-cursor-fix";
    style.textContent = `* { cursor: auto !important; } .custom-cursor, .custom-cursor-outer { display: none !important; }`;
    document.head.appendChild(style);
    return () => { const el = document.getElementById("hub-cursor-fix"); if (el) el.remove(); };
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0f0c29 0%,#1a1a3e 50%,#0f0c29 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "40px 20px",
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      position: "relative", overflow: "hidden",
    }}>

      {/* Background orbs */}
      <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
        {[["15%","10%","rgba(124,58,237,.12)","600px"],["85%","80%","rgba(37,99,235,.1)","500px"],["50%","50%","rgba(8,145,178,.08)","700px"]].map(([l,t,c,s],i)=>(
          <div key={i} style={{ position:"absolute",left:l,top:t,width:s,height:s,borderRadius:"50%",background:`radial-gradient(circle,${c},transparent 70%)`,transform:"translate(-50%,-50%)" }}/>
        ))}
      </div>

      {/* Logo + Title */}
      <div style={{ textAlign:"center", marginBottom:52, position:"relative", zIndex:1, animation: mounted?"fadeInDown .6s ease":"none" }}>
        {/* DigiKraft logo mark */}
        <div style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#7c3aed,#2563eb)",marginBottom:20,boxShadow:"0 8px 32px rgba(124,58,237,.4)" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="8.5" x2="22" y2="8.5"/>
          </svg>
        </div>
        <h1 style={{ fontSize:"clamp(28px,5vw,42px)", fontWeight:800, color:"#fff", margin:"0 0 10px", letterSpacing:"-.02em" }}>
          DigiKraft Social
        </h1>
        <p style={{ fontSize:16, color:"rgba(255,255,255,.55)", margin:0, maxWidth:440 }}>
          Unified portal hub — Select your workspace to continue
        </p>
      </div>

      {/* Portal Cards Grid */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",
        gap:24, maxWidth:1160, width:"100%",
        position:"relative", zIndex:1,
      }}>
        {PORTALS.map((portal, idx) => {
          const isHovered = hovered === portal.id;
          return (
            <Link key={portal.id} href={portal.href} style={{ textDecoration:"none" }}>
              <div
                onMouseEnter={() => setHovered(portal.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHovered
                    ? "rgba(255,255,255,.1)"
                    : "rgba(255,255,255,.055)",
                  border: isHovered
                    ? `1.5px solid rgba(255,255,255,.25)`
                    : "1.5px solid rgba(255,255,255,.1)",
                  borderRadius: 20,
                  padding: "28px 26px 26px",
                  cursor: "pointer",
                  transition: "all .25s cubic-bezier(.4,0,.2,1)",
                  backdropFilter: "blur(12px)",
                  boxShadow: isHovered
                    ? `0 20px 60px ${portal.glow}, 0 4px 24px rgba(0,0,0,.3)`
                    : "0 4px 24px rgba(0,0,0,.2)",
                  transform: isHovered ? "translateY(-6px) scale(1.015)" : "translateY(0) scale(1)",
                  animationDelay: `${idx * 0.1}s`,
                }}>

                {/* Card top — icon + badge */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
                  <div style={{
                    width:60, height:60, borderRadius:16,
                    background: portal.gradient,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow: isHovered ? `0 8px 24px ${portal.glow}` : `0 4px 12px ${portal.glow}`,
                    transition:"box-shadow .25s",
                    flexShrink: 0,
                  }}>
                    {portal.icon}
                  </div>
                  <span style={{
                    padding:"4px 12px", borderRadius:20,
                    background: isHovered ? portal.gradient : portal.badge,
                    color: isHovered ? "#fff" : portal.badgeC,
                    fontSize:11, fontWeight:800, letterSpacing:".08em",
                    textTransform:"uppercase", transition:"all .25s",
                    border: isHovered ? "none" : `1px solid ${portal.badgeC}22`,
                  }}>
                    {portal.label}
                  </span>
                </div>

                {/* Name + description */}
                <h3 style={{ fontSize:19, fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-.01em" }}>
                  {portal.name}
                </h3>
                <p style={{ fontSize:13, color:"rgba(255,255,255,.55)", margin:"0 0 20px", lineHeight:1.6 }}>
                  {portal.desc}
                </p>

                {/* Module pills */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:22 }}>
                  {portal.modules.map(m => (
                    <span key={m} style={{
                      padding:"3px 10px", borderRadius:20,
                      background:"rgba(255,255,255,.08)",
                      color:"rgba(255,255,255,.65)",
                      fontSize:11, fontWeight:600,
                      border:"1px solid rgba(255,255,255,.1)",
                    }}>
                      {m}
                    </span>
                  ))}
                </div>

                {/* Open button */}
                <div style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  paddingTop:18, borderTop:"1px solid rgba(255,255,255,.08)",
                }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,.8)" }}>
                    Open {portal.label} Portal
                  </span>
                  <div style={{
                    width:34, height:34, borderRadius:"50%",
                    background: isHovered ? portal.gradient : "rgba(255,255,255,.1)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"all .25s",
                    boxShadow: isHovered ? `0 4px 14px ${portal.glow}` : "none",
                    transform: isHovered ? "translateX(4px)" : "translateX(0)",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop:52, textAlign:"center", position:"relative", zIndex:1 }}>
        <p style={{ fontSize:12, color:"rgba(255,255,255,.25)", margin:"0 0 8px" }}>
          © 2026 DigiKraft Social. All portals secured with JWT + Role-based access.
        </p>
        <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
          {PORTALS.map(p => (
            <Link key={p.id} href={p.href}
              style={{ fontSize:12, color:"rgba(255,255,255,.35)", textDecoration:"none",
                fontWeight:600, transition:"color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.7)"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.35)"}>
              {p.name}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity:0; transform:translateY(-20px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
