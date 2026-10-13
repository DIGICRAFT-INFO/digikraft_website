"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, X, CreditCard, Search, Filter } from "lucide-react";
import CRM_API from "@/utils/crmApi";

const EMPTY = { invoice:"", amount_paid:"", payment_date:"", payment_mode:"upi", reference_number:"", notes:"" };
const MODES = [
  {v:"upi",      l:"UPI"},
  {v:"bank_transfer", l:"Bank Transfer"},
  {v:"neft",     l:"NEFT / IMPS"},
  {v:"cheque",   l:"Cheque"},
  {v:"cash",     l:"Cash"},
  {v:"razorpay", l:"Razorpay"},
  {v:"paypal",   l:"PayPal"},
  {v:"other",    l:"Other"},
];
const MODE_COLOR = { upi:"#ede9fe", bank_transfer:"#dbeafe", neft:"#dbeafe", cheque:"#fef9c3", cash:"#dcfce7", razorpay:"#ffedd5", paypal:"#dbeafe", other:"#f1f5f9" };
const MODE_TEXT  = { upi:"#5b21b6", bank_transfer:"#1d4ed8", neft:"#1d4ed8", cheque:"#a16207", cash:"#15803d", razorpay:"#c2410c", paypal:"#1d4ed8", other:"#475569" };

const fmt     = n => `₹${Number(n||0).toLocaleString("en-IN")}`;
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";

export default function CrmPaymentsPage() {
  const [payments,  setPayments]  = useState([]);
  const [invoices,  setInvoices]  = useState([]);  // outstanding only
  const [allInvoices, setAllInvoices] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filterMode,setFilterMode]= useState("");
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [{ data:p }, { data:inv }] = await Promise.all([
        CRM_API.get("/payments"),
        CRM_API.get("/invoices"),
      ]);
      setPayments(p);
      setAllInvoices(inv);
      // Only outstanding invoices in selector
      setInvoices(inv.filter(i => ["issued","partial","overdue"].includes(i.status)));
    } catch { setPayments([]); } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = payments.filter(p => {
    const matchSearch = !search ||
      p.invoice?.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
      p.invoice?.client_name_snapshot?.toLowerCase().includes(search.toLowerCase()) ||
      p.reference_number?.toLowerCase().includes(search.toLowerCase());
    const matchMode = !filterMode || p.payment_mode === filterMode;
    return matchSearch && matchMode;
  });

  const openModal = () => {
    setForm({ ...EMPTY, payment_date: new Date().toISOString().split("T")[0] });
    setError(""); setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      await CRM_API.post("/payments", { ...form, amount_paid: Number(form.amount_paid) });
      closeModal(); load();
    } catch (err) { setError(err.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this payment record? Invoice balance will be recalculated.")) return;
    try { await CRM_API.delete(`/payments/${id}`); load(); }
    catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  const closeModal = () => { setModal(false); setForm(EMPTY); setError(""); };
  const F = (k) => ({ value: form[k]??'', onChange: e => setForm(p=>({...p,[k]:e.target.value})) });

  const total    = payments.reduce((s,p) => s+(Number(p.amount_paid)||0), 0);
  const thisMonth = payments.filter(p => {
    if (!p.payment_date) return false;
    const d = new Date(p.payment_date);
    const now = new Date();
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  }).reduce((s,p) => s+(Number(p.amount_paid)||0), 0);

  // Get selected invoice details for balance hint
  const selectedInv = invoices.find(i => i.id === form.invoice);

  const inp = { width:"100%",padding:"10px 12px",border:"1.5px solid #e2e8f0",borderRadius:8,fontSize:13,outline:"none",fontFamily:"inherit" };
  const lbl = { display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5 };

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12 }}>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:"#0f172a",margin:"0 0 4px" }}>Payments</h1>
          <p style={{ fontSize:13,color:"#64748b",margin:0 }}>{payments.length} records · Total received: <strong style={{color:"#15803d"}}>{fmt(total)}</strong> · This month: <strong style={{color:"#1d4ed8"}}>{fmt(thisMonth)}</strong></p>
        </div>
        <button onClick={openModal} style={{ display:"flex",alignItems:"center",gap:6,padding:"10px 18px",background:"#22c55e",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer" }}>
          <Plus size={16}/> Record Payment
        </button>
      </div>

      {/* Summary stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:14,marginBottom:24 }}>
        {[
          ["Total Received",  fmt(total),    "#15803d","#f0fdf4","#bbf7d0"],
          ["This Month",      fmt(thisMonth),"#1d4ed8","#eff6ff","#bfdbfe"],
          ["Pending Invoices",`${invoices.length}`, "#c2410c","#fff7ed","#fed7aa"],
          ["Outstanding",     fmt(invoices.reduce((s,i)=>s+(Number(i.balance_due)||0),0)),"#dc2626","#fef2f2","#fecaca"],
        ].map(([l,v,color,bg,border])=>(
          <div key={l} style={{ background:bg,border:`1px solid ${border}`,borderRadius:12,padding:"16px 18px" }}>
            <p style={{ fontSize:11,fontWeight:700,color,textTransform:"uppercase",letterSpacing:".05em",margin:"0 0 4px" }}>{l}</p>
            <p style={{ fontSize:20,fontWeight:800,color,margin:0 }}>{v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:9,padding:"8px 14px",flex:1,minWidth:200,maxWidth:360 }}>
          <Search size={15} color="#94a3b8"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by invoice, client, reference…" style={{ border:"none",background:"transparent",outline:"none",fontSize:13,flex:1,minWidth:0,fontFamily:"inherit" }}/>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
          <Filter size={13} color="#94a3b8"/>
          <select value={filterMode} onChange={e=>setFilterMode(e.target.value)} style={{ padding:"8px 12px",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:13,background:"#f8fafc",outline:"none",fontFamily:"inherit" }}>
            <option value="">All Modes</option>
            {MODES.map(m=><option key={m.v} value={m.v}>{m.l}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Invoice #","Client","Amount","Date","Mode","Reference","Actions"].map(h=>(
                  <th key={h} style={{ padding:"11px 16px",textAlign:"left",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:"#64748b",borderBottom:"1px solid #e2e8f0",whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding:48,textAlign:"center",color:"#94a3b8" }}>Loading…</td></tr>
              ) : filtered.length===0 ? (
                <tr><td colSpan={7} style={{ padding:48,textAlign:"center" }}>
                  <CreditCard size={40} color="#e2e8f0" style={{ display:"block",margin:"0 auto 10px" }}/>
                  <p style={{ color:"#94a3b8",margin:0 }}>No payments {search||filterMode?"match filters":"recorded yet"}.</p>
                </td></tr>
              ) : filtered.map(p=>(
                <tr key={p.id} style={{ borderBottom:"1px solid #f8fafc" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#fafafa"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"13px 16px",fontWeight:700,color:"#0f172a" }}>{p.invoice?.invoice_number||"—"}</td>
                  <td style={{ padding:"13px 16px",color:"#374151" }}>{p.invoice?.client_name_snapshot||"—"}</td>
                  <td style={{ padding:"13px 16px",fontWeight:700,color:"#16a34a",fontSize:14 }}>{fmt(p.amount_paid)}</td>
                  <td style={{ padding:"13px 16px",fontSize:12,color:"#64748b" }}>{fmtDate(p.payment_date)}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ background:MODE_COLOR[p.payment_mode]||"#f1f5f9",color:MODE_TEXT[p.payment_mode]||"#475569",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700 }}>
                      {MODES.find(m=>m.v===p.payment_mode)?.l||p.payment_mode}
                    </span>
                  </td>
                  <td style={{ padding:"13px 16px",color:"#64748b",fontSize:12 }}>{p.reference_number||"—"}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <button onClick={()=>handleDelete(p.id)} style={{ padding:6,background:"#fee2e2",color:"#dc2626",border:"none",borderRadius:6,cursor:"pointer" }} title="Delete"><Trash2 size={13}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {modal && (
        <div className="crm-modal-overlay">
          <div className="crm-modal" style={{ maxWidth:520 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px",borderBottom:"1px solid #f1f5f9",position:"sticky",top:0,background:"#fff",zIndex:1 }}>
              <h2 style={{ fontSize:17,fontWeight:700,color:"#0f172a",margin:0 }}>Record Payment</h2>
              <button onClick={closeModal} style={{ background:"#f1f5f9",border:"none",width:30,height:30,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}><X size={16}/></button>
            </div>
            <form onSubmit={handleSave} style={{ padding:24,display:"flex",flexDirection:"column",gap:16 }}>
              {error && <div style={{ background:"#fee2e2",color:"#dc2626",padding:"10px 14px",borderRadius:8,fontSize:13 }}>{error}</div>}

              {/* Invoice Selector — shows client + amount + balance */}
              <div>
                <label style={lbl}>Invoice <span style={{color:"#ef4444"}}>*</span></label>
                <select value={form.invoice} onChange={e=>setForm(p=>({...p,invoice:e.target.value}))} required style={inp}>
                  <option value="">Select outstanding invoice…</option>
                  {invoices.length===0
                    ? <option disabled>No outstanding invoices</option>
                    : invoices.map(i=>(
                      <option key={i.id} value={i.id}>
                        {i.invoice_number} · {i.client_name_snapshot} · Balance: {fmt(i.balance_due)}
                      </option>
                    ))
                  }
                </select>
                {/* Show selected invoice details */}
                {selectedInv && (
                  <div style={{ marginTop:8,padding:"10px 14px",background:"#f0fdf4",borderRadius:8,fontSize:12,display:"flex",gap:16,flexWrap:"wrap" }}>
                    <span>Grand Total: <strong>{fmt(selectedInv.grand_total)}</strong></span>
                    <span>Paid: <strong style={{color:"#15803d"}}>{fmt(selectedInv.amount_paid)}</strong></span>
                    <span>Balance Due: <strong style={{color:"#dc2626"}}>{fmt(selectedInv.balance_due)}</strong></span>
                  </div>
                )}
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                <div>
                  <label style={lbl}>Amount (₹) <span style={{color:"#ef4444"}}>*</span></label>
                  <input {...F("amount_paid")} type="number" min="0.01" step="0.01" required style={inp}
                    placeholder={selectedInv ? String(selectedInv.balance_due) : "0.00"}/>
                  {selectedInv && <p style={{fontSize:11,color:"#64748b",margin:"4px 0 0"}}>Max: {fmt(selectedInv.balance_due)}</p>}
                </div>
                <div>
                  <label style={lbl}>Payment Date <span style={{color:"#ef4444"}}>*</span></label>
                  <input {...F("payment_date")} type="date" required style={inp}/>
                </div>
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
                <div>
                  <label style={lbl}>Payment Mode</label>
                  <select {...F("payment_mode")} style={inp}>
                    {MODES.map(m=><option key={m.v} value={m.v}>{m.l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Reference / UTR / Transaction ID</label>
                  <input {...F("reference_number")} style={inp} placeholder="TXN123456"/>
                </div>
              </div>

              <div>
                <label style={lbl}>Notes</label>
                <textarea {...F("notes")} rows={2} style={{...inp,resize:"vertical"}} placeholder="Optional notes…"/>
              </div>

              <div style={{ display:"flex",justifyContent:"flex-end",gap:10,paddingTop:8,borderTop:"1px solid #f1f5f9" }}>
                <button type="button" onClick={closeModal} style={{ padding:"9px 18px",background:"#f1f5f9",color:"#374151",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer" }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding:"9px 20px",background:saving?"#86efac":"#22c55e",color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:saving?"not-allowed":"pointer" }}>
                  {saving?"Saving…":"Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
