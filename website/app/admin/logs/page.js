"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/utils/api";
import { FileText, RefreshCw, Trash2, Loader2, Filter, MessageCircle, Instagram, Facebook, Send, Phone } from "lucide-react";

export default function ActivityLogsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterPlatform, setFilterPlatform] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "superadmin") { router.push("/admin/dashboard"); return; }
    setAuthorized(true);
    fetchLogs();
  }, []);

  useEffect(() => { if (authorized) fetchLogs(); }, [page, filterPlatform]);

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(""), 3000); };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = `?page=${page}&limit=30${filterPlatform ? `&platform=${filterPlatform}` : ""}`;
      const { data } = await API.get(`/logs${params}`);
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (err) { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleClearOld = async (days) => {
    if (!window.confirm(`Delete logs older than ${days} days?`)) return;
    try {
      const { data } = await API.delete(`/logs/clear?days=${days}`);
      notify(`Deleted ${data.deleted} old logs`);
      fetchLogs();
    } catch (err) { notify("Failed to clear logs"); }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "whatsapp": return <Phone size={12} color="#25D366" />;
      case "facebook": return <Facebook size={12} color="#1877F2" />;
      case "instagram": return <Instagram size={12} color="#E4405F" />;
      case "telegram": return <Send size={12} color="#0088CC" />;
      default: return <FileText size={12} color="#6b7280" />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case "whatsapp": return { bg: "#f0fdf4", color: "#25D366" };
      case "facebook": return { bg: "#eff6ff", color: "#1877F2" };
      case "instagram": return { bg: "#fef2f2", color: "#E4405F" };
      case "telegram": return { bg: "#ecfeff", color: "#0088CC" };
      default: return { bg: "#f3f4f6", color: "#6b7280" };
    }
  };

  const formatTime = (d) => new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });

  if (!authorized) return null;

  return (
    <div style={{ padding: "28px", maxWidth: "1000px", margin: "0 auto" }}>
      {notification && (
        <div style={{ background: "#ecfccb", border: "1px solid #bef264", color: "#3f6212", padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "12px", fontWeight: "600" }}>{notification}</div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#1a2e05", margin: 0 }}>Activity Logs</h1>
          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>Track all admin & author social media activity ({total} total logs)</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={fetchLogs} style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600", color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}><RefreshCw size={12} /> Refresh</button>
          <button onClick={() => handleClearOld(30)} style={{ background: "#fee2e2", border: "1px solid #fecaca", padding: "7px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "600", color: "#dc2626", display: "flex", alignItems: "center", gap: "4px" }}><Trash2 size={12} /> Clear 30d+</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
        {["", "whatsapp", "facebook", "instagram", "telegram", "system"].map((p) => (
          <button key={p} onClick={() => { setFilterPlatform(p); setPage(1); }} style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "600", cursor: "pointer", background: filterPlatform === p ? "#8ce600" : "#f3f4f6", color: filterPlatform === p ? "#1a2e05" : "#6b7280", border: filterPlatform === p ? "1px solid #8ce600" : "1px solid #e5e7eb" }}>
            {p === "" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} color="#8ce600" /></div>
        ) : logs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
            <FileText size={28} style={{ opacity: 0.3, marginBottom: "8px" }} />
            <p style={{ fontSize: "13px" }}>No activity logs found.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Action</th>
                <th style={thStyle}>Platform</th>
                <th style={thStyle}>Details</th>
                <th style={thStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const pc = getPlatformColor(log.platform);
                return (
                  <tr key={log._id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                    <td style={tdStyle}>
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: "600", color: "#1a2e05" }}>{log.userName || "Unknown"}</div>
                        <div style={{ fontSize: "10px", color: "#9ca3af" }}>{log.userRole}</div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "12px", color: "#374151" }}>{log.action}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "600", background: pc.bg, color: pc.color, padding: "3px 8px", borderRadius: "10px" }}>
                        {getPlatformIcon(log.platform)} {log.platform}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "11px", color: "#6b7280" }}>{log.details || "—"}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "10px", color: "#9ca3af" }}>{formatTime(log.createdAt)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > 30 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "11px", cursor: "pointer", background: "#fff" }}>← Prev</button>
          <span style={{ padding: "6px 12px", fontSize: "11px", color: "#6b7280" }}>Page {page}</span>
          <button onClick={() => setPage(page + 1)} disabled={logs.length < 30} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "11px", cursor: "pointer", background: "#fff" }}>Next →</button>
        </div>
      )}

      <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const thStyle = { textAlign: "left", padding: "10px 14px", fontSize: "10px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.4px" };
const tdStyle = { padding: "10px 14px", verticalAlign: "middle" };
