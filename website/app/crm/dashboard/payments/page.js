"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, X, CreditCard, Search } from "lucide-react";
import CRM_API from "@/utils/crmApi";

const EMPTY = { invoice: "", amount_paid: "", payment_date: "", payment_mode: "upi", reference_number: "", notes: "" };
const MODES = ["upi","bank_transfer","neft","cheque","cash","razorpay","paypal","other"];
const fmt = n => `₹${Number(n||0).toLocaleString("en-IN")}`;
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";

export default function CrmPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [{ data: p }, { data: inv }] = await Promise.all([CRM_API.get("/payments"), CRM_API.get("/invoices")]);
      setPayments(p); setInvoices(inv.filter(i => ["issued","partial","overdue"].includes(i.status)));
    } catch { setPayments([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = payments.filter(p => !search || p.invoice?.invoice_number?.toLowerCase().includes(search.toLowerCase()) || p.invoice?.client_name_snapshot?.toLowerCase().includes(search.toLowerCase()) || p.reference_number?.toLowerCase().includes(search.toLowerCase()));

  const openModal = () => { setForm({ ...EMPTY, payment_date: new Date().toISOString().split("T")[0] }); setError(""); setModal(true); };
  const closeModal = () => { setModal(false); setForm(EMPTY); setError(""); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      await CRM_API.post("/payments", { ...form, amount_paid: Number(form.amount_paid) });
      closeModal(); load();
    } catch (err) { setError(err.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this payment? Invoice balance will be recalculated.")) return;
    try { await CRM_API.delete(`/payments/${id}`); load(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const F = (k) => ({ value: form[k] ?? "", onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) });
  const total = payments.reduce((s, p) => s + (Number(p.amount_paid)||0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>Payments</h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{payments.length} records · Total received: <strong>{fmt(total)}</strong></p>
        </div>
        <button onClick={openModal} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: "#22c55e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          <Plus size={16} /> Record Payment
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "9px", padding: "8px 14px", maxWidth: "360px" }}>
          <Search size={15} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments…" style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", flex: 1, minWidth: 0, fontFamily: "inherit" }} />
        </div>
      </div>

      <div className="crm-card">
        <div className="crm-table-wrap">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Invoice #", "Client", "Amount", "Date", "Mode", "Reference", "Actions"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".05em", color: "#64748b", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (<tr><td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>Loading…</td></tr>)
              : filtered.length === 0 ? (<tr><td colSpan={7} style={{ padding: "48px", textAlign: "center" }}><CreditCard size={40} color="#e2e8f0" style={{ display: "block", margin: "0 auto 10px" }} /><p style={{ color: "#94a3b8", margin: 0 }}>No payments recorded yet.</p></td></tr>)
              : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f8fafc" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "13px 16px", fontWeight: "700", color: "#0f172a" }}>{p.invoice?.invoice_number || "—"}</td>
                  <td style={{ padding: "13px 16px", color: "#374151" }}>{p.invoice?.client_name_snapshot || "—"}</td>
                  <td style={{ padding: "13px 16px", fontWeight: "700", color: "#16a34a" }}>{fmt(p.amount_paid)}</td>
                  <td style={{ padding: "13px 16px", fontSize: "12px", color: "#64748b" }}>{fmtDate(p.payment_date)}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ background: "#f0fdf4", color: "#15803d", padding: "3px 9px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>{p.payment_mode}</span>
                  </td>
                  <td style={{ padding: "13px 16px", color: "#64748b", fontSize: "12px" }}>{p.reference_number || "—"}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <button onClick={() => handleDelete(p.id)} style={{ padding: "6px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", cursor: "pointer" }}><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="crm-modal-overlay">
          <div className="crm-modal" style={{ maxWidth: "480px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Record Payment</h2>
              <button onClick={closeModal} style={{ background: "#f1f5f9", border: "none", width: "30px", height: "30px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px" }}>{error}</div>}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>Invoice <span style={{ color: "#ef4444" }}>*</span></label>
                <select value={form.invoice} onChange={e => setForm(p=>({...p,invoice:e.target.value}))} required style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "inherit" }}>
                  <option value="">Select invoice…</option>
                  {invoices.map(i => <option key={i.id} value={i.id}>{i.invoice_number} — {i.client_name_snapshot} (Balance: {fmt(i.balance_due)})</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>Amount (₹) <span style={{ color: "#ef4444" }}>*</span></label>
                  <input {...F("amount_paid")} type="number" min="0.01" step="0.01" required style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>Payment Date <span style={{ color: "#ef4444" }}>*</span></label>
                  <input {...F("payment_date")} type="date" required style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>Payment Mode</label>
                  <select {...F("payment_mode")} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "inherit" }}>
                    {MODES.map(m => <option key={m} value={m}>{m.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>Reference / UTR</label>
                  <input {...F("reference_number")} placeholder="Transaction ID" style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "5px" }}>Notes</label>
                <textarea {...F("notes")} rows={2} style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
                <button type="button" onClick={closeModal} style={{ padding: "9px 18px", background: "#f1f5f9", color: "#374151", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: "9px 20px", background: saving ? "#86efac" : "#22c55e", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Saving…" : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
