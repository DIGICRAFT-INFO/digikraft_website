"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CRM_API from "@/utils/crmApi";
import {
  Users, Briefcase, FileText, CreditCard, TrendingUp,
  MessageSquare, DollarSign, AlertCircle, ArrowRight,
  CheckCircle, Clock, Activity,
} from "lucide-react";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_COLOR = {
  active: "badge-green", completed: "badge-blue", on_hold: "badge-yellow", cancelled: "badge-red",
  paid: "badge-green", issued: "badge-blue", partial: "badge-orange", overdue: "badge-red", draft: "badge-gray",
  new: "badge-blue", contacted: "badge-yellow", converted: "badge-green", lost: "badge-red",
};

export default function CrmDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ full_name: "User", role: "executive" });
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    try { const u = JSON.parse(localStorage.getItem("crm_user") || "{}"); if (u.full_name) setUser(u); } catch {}
    fetchStats();
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data: d } = await CRM_API.get("/dashboard/stats");
      setData(d);
    } catch (e) {
      console.error("Dashboard stats error:", e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const formatDate = (d) => d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "36px", height: "36px", border: "3px solid #dcfce7", borderTopColor: "#22c55e", borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Loading dashboard…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const c = data?.counts || {};
  const rev = data?.revenue || {};

  const statCards = [
    { label: "Total Clients", value: c.clients || 0, icon: Users, color: "green", href: "/crm/dashboard/clients" },
    { label: "Active Projects", value: c.projects?.active || 0, icon: Briefcase, color: "blue", href: "/crm/dashboard/projects" },
    { label: "Total Billed", value: fmt(rev.total_billed), icon: DollarSign, color: "purple", href: "/crm/dashboard/invoices" },
    { label: "Revenue Received", value: fmt(rev.total_received), icon: TrendingUp, color: "teal", href: "/crm/dashboard/payments" },
    { label: "Outstanding", value: fmt(rev.outstanding), icon: AlertCircle, color: "orange", href: "/crm/dashboard/invoices" },
    { label: "New Enquiries", value: c.enquiries?.new || 0, icon: MessageSquare, color: "blue", href: "/crm/dashboard/enquiries" },
    { label: "Overdue Invoices", value: c.invoices?.overdue || 0, icon: AlertCircle, color: "red", href: "/crm/dashboard/invoices" },
    { label: "Accepted Proposals", value: c.proposals?.accepted || 0, icon: CheckCircle, color: "green", href: "/crm/dashboard/proposals" },
  ];

  return (
    <div style={{ animation: "fadeIn .2s ease" }}>
      {/* Welcome Banner */}
      <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "clamp(16px,3vw,22px) clamp(16px,3vw,28px)", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#15803d", background: "#dcfce7", padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: ".05em" }}>{user.role}</span>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#14532d", margin: "6px 0 4px" }}>Welcome back, {user.full_name.split(" ")[0]} 👋</h1>
          <p style={{ fontSize: "13px", color: "#166534", margin: 0 }}>DigiKraft Social CRM — Manage clients, projects & billing</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="crm-clock" style={{ textAlign: "right" }}>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#14532d", fontVariantNumeric: "tabular-nums" }}>{formatTime(time)}</div>
            <div style={{ fontSize: "11px", color: "#166534" }}>{formatDate(time)}</div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="crm-stats-grid" style={{ marginBottom: "28px" }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const colorMap = { green: { bg: "#dcfce7", color: "#16a34a" }, blue: { bg: "#dbeafe", color: "#2563eb" }, purple: { bg: "#ede9fe", color: "#7c3aed" }, teal: { bg: "#ccfbf1", color: "#0d9488" }, orange: { bg: "#ffedd5", color: "#ea580c" }, red: { bg: "#fee2e2", color: "#dc2626" } };
          const cl = colorMap[card.color] || colorMap.blue;
          return (
            <Link href={card.href} key={i} style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "18px 20px", cursor: "pointer", transition: "box-shadow .15s", display: "flex", flexDirection: "column", gap: "12px" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.06)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em", margin: "0 0 4px" }}>{card.label}</p>
                    <p style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{card.value}</p>
                  </div>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: cl.bg, color: cl.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#94a3b8" }}>
                  <Activity size={11} /> Live data
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3-col recent panels — stack on mobile */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "20px" }}>
        {/* Recent Clients */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Recent Clients</span>
            <Link href="/crm/dashboard/clients" style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>View All <ArrowRight size={12} /></Link>
          </div>
          {(data?.recent?.clients || []).length === 0
            ? <div style={{ padding: "32px 20px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>No clients yet</div>
            : (data.recent.clients).map((cl, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "12px", flexShrink: 0 }}>
                  {cl.full_name?.[0]?.toUpperCase() || "C"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cl.full_name}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>{cl.city || "—"}</div>
                </div>
              </div>
            ))}
        </div>

        {/* Recent Invoices */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Recent Invoices</span>
            <Link href="/crm/dashboard/invoices" style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>View All <ArrowRight size={12} /></Link>
          </div>
          {(data?.recent?.invoices || []).length === 0
            ? <div style={{ padding: "32px 20px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>No invoices yet</div>
            : (data.recent.invoices).map((inv, i) => (
              <div key={i} style={{ padding: "12px 20px", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{inv.invoice_number}</span>
                  <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", textTransform: "capitalize", ...(inv.status === "paid" ? { background: "#dcfce7", color: "#15803d" } : inv.status === "overdue" ? { background: "#fee2e2", color: "#dc2626" } : { background: "#f1f5f9", color: "#475569" }) }}>
                    {inv.status}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#64748b" }}>{inv.client_name_snapshot} · {fmt(inv.grand_total)}</div>
              </div>
            ))}
        </div>

        {/* Recent Enquiries */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Recent Enquiries</span>
            <Link href="/crm/dashboard/enquiries" style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>View All <ArrowRight size={12} /></Link>
          </div>
          {(data?.recent?.enquiries || []).length === 0
            ? <div style={{ padding: "32px 20px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>No enquiries yet</div>
            : (data.recent.enquiries).map((enq, i) => (
              <div key={i} style={{ padding: "12px 20px", borderBottom: "1px solid #f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "140px" }}>{enq.client_name}</span>
                  <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", textTransform: "capitalize", ...(enq.status === "new" ? { background: "#dbeafe", color: "#1d4ed8" } : enq.status === "converted" ? { background: "#dcfce7", color: "#15803d" } : { background: "#f1f5f9", color: "#475569" }) }}>
                    {enq.status}
                  </span>
                </div>
                <div style={{ fontSize: "11px", color: "#94a3b8" }}>{enq.mobile_number} · {fmtDate(enq.enquiry_date)}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
        {[
          { href: "/crm/dashboard/clients", label: "+ New Client", bg: "#22c55e" },
          { href: "/crm/dashboard/enquiries", label: "+ Log Enquiry", bg: "#3b82f6" },
          { href: "/crm/dashboard/projects", label: "+ New Project", bg: "#8b5cf6" },
          { href: "/crm/dashboard/invoices", label: "+ New Invoice", bg: "#f59e0b" },
        ].map((btn, i) => (
          <Link key={i} href={btn.href} style={{ textDecoration: "none" }}>
            <button style={{ padding: "10px 20px", background: btn.bg, color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
              {btn.label}
            </button>
          </Link>
        ))}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
