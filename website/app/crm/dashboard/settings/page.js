"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Building2, CreditCard, Landmark, Receipt, Save,
  CheckCircle, AlertCircle, Settings, User, FileText,
} from "lucide-react";
import CRM_API from "@/utils/crmApi";

// ── Style helpers ─────────────────────────────────────────────────────────────
const card = { background:"#fff", border:"1px solid #e2e8f0", borderRadius:14, overflow:"hidden", marginBottom:24 };
const cardHeader = { display:"flex", alignItems:"center", gap:10, padding:"16px 22px", borderBottom:"1px solid #f1f5f9", background:"#f8fafc" };
const cardBody  = { padding:"24px 22px" };
const grid2 = { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16, marginBottom:16 };
const grid3 = { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16, marginBottom:16 };
const label = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 };
const input = { width:"100%", padding:"9px 12px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box", transition:"border-color .15s" };

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={cardHeader}>
      <div style={{ padding:8, background:"#f0fdf4", borderRadius:8, color:"#22c55e" }}>{icon}</div>
      <div>
        <h3 style={{ fontSize:14, fontWeight:700, color:"#0f172a", margin:0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize:12, color:"#64748b", margin:"2px 0 0" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({ label: lbl, children }) {
  return (
    <div>
      <label style={label}>{lbl}</label>
      {children}
    </div>
  );
}

export default function CrmSettingsPage() {
  const [form, setForm]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  // Track which tab is active
  const [tab, setTab] = useState("company");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await CRM_API.get("/settings");
      setForm(data);
    } catch (e) {
      setError("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSaved(false);
    try {
      const { data } = await CRM_API.put("/settings", form);
      setForm(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const F = (k) => ({
    value: form?.[k] ?? "",
    onChange: (e) => setForm(p => ({ ...p, [k]: e.target.value })),
    onFocus: (e) => e.target.style.borderColor = "#22c55e",
    onBlur:  (e) => e.target.style.borderColor = "#e2e8f0",
  });

  const Fn = (k) => ({
    ...F(k),
    type: "number",
    min: "0",
    value: form?.[k] ?? 0,
    onChange: (e) => setForm(p => ({ ...p, [k]: Number(e.target.value) })),
  });

  const TABS = [
    { key:"company",  label:"Company",     icon:<Building2 size={14}/> },
    { key:"gst",      label:"GST / Tax",   icon:<Receipt size={14}/> },
    { key:"bank",     label:"Bank Details",icon:<Landmark size={14}/> },
    { key:"invoice",  label:"Invoice",     icon:<FileText size={14}/> },
    { key:"profile",  label:"My Profile",  icon:<User size={14}/> },
  ];

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"40vh", fontFamily:"'Inter',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:36, height:36, border:"3px solid #dcfce7", borderTopColor:"#22c55e", borderRadius:"50%", animation:"spin .7s linear infinite", margin:"0 auto 12px" }}/>
        <p style={{ color:"#64748b", fontSize:14, margin:0 }}>Loading settings…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", maxWidth:860, animation:"fadeIn .2s ease" }}>
      {/* Page Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>CRM Settings</h1>
          <p style={{ fontSize:13, color:"#64748b", margin:0 }}>Configure company info, tax defaults, bank details and invoice settings</p>
        </div>
        <button
          onClick={handleSave} disabled={saving || !form}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 22px", background: saving ? "#86efac" : "#22c55e", color:"#fff", border:"none", borderRadius:9, fontSize:14, fontWeight:700, cursor: saving ? "not-allowed" : "pointer", transition:"background .15s" }}>
          {saving ? (
            <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }}/> Saving…</>
          ) : saved ? (
            <><CheckCircle size={16}/> Saved!</>
          ) : (
            <><Save size={16}/> Save Changes</>
          )}
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fee2e2", color:"#dc2626", padding:"12px 16px", borderRadius:9, fontSize:13, marginBottom:20, border:"1px solid #fecaca" }}>
          <AlertCircle size={15}/> {error}
        </div>
      )}
      {saved && (
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"#dcfce7", color:"#15803d", padding:"12px 16px", borderRadius:9, fontSize:13, marginBottom:20, border:"1px solid #bbf7d0" }}>
          <CheckCircle size={15}/> Settings saved successfully!
        </div>
      )}

      {/* Tab Bar */}
      <div style={{ display:"flex", gap:2, background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:4, marginBottom:24, flexWrap:"wrap" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", borderRadius:8, border:"none", fontSize:13, fontWeight:600, cursor:"pointer", background: tab===t.key ? "#22c55e" : "transparent", color: tab===t.key ? "#fff" : "#64748b", transition:"all .15s", whiteSpace:"nowrap" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {form && (
        <form onSubmit={handleSave}>

          {/* ── COMPANY INFO ── */}
          {tab === "company" && (
            <div style={card}>
              <SectionHeader icon={<Building2 size={16}/>} title="Company Information" subtitle="Details shown on all invoices and proposals"/>
              <div style={cardBody}>
                <div style={{ ...grid2, gridTemplateColumns:"1fr" }}>
                  <Field label="Company Name *">
                    <input {...F("company_name")} required style={input}/>
                  </Field>
                </div>
                <div style={grid2}>
                  <Field label="Email"><input {...F("company_email")} type="email" style={input}/></Field>
                  <Field label="Phone"><input {...F("company_phone")} style={input}/></Field>
                  <Field label="Website"><input {...F("company_website")} placeholder="https://digikraftsocial.com" style={input}/></Field>
                </div>
                <div style={{ ...grid2, gridTemplateColumns:"1fr", marginBottom:16 }}>
                  <Field label="Street Address">
                    <input {...F("company_address")} style={input}/>
                  </Field>
                </div>
                <div style={grid3}>
                  <Field label="City"><input {...F("company_city")} style={input}/></Field>
                  <Field label="State"><input {...F("company_state")} style={input}/></Field>
                  <Field label="Pincode"><input {...F("company_pincode")} style={input}/></Field>
                  <Field label="Country"><input {...F("company_country")} style={input}/></Field>
                </div>
                <div style={{ marginTop:16, padding:"14px 16px", background:"#f8fafc", borderRadius:8, border:"1px solid #e2e8f0" }}>
                  <p style={{ fontSize:12, color:"#64748b", margin:0, lineHeight:1.8 }}>
                    <strong>Preview on Invoice:</strong><br/>
                    <span style={{ color:"#0f172a" }}>{form.company_name}</span><br/>
                    {form.company_address}<br/>
                    {[form.company_city, form.company_state, form.company_country].filter(Boolean).join(", ")} {form.company_pincode}<br/>
                    Phone: {form.company_phone} | {form.company_email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── GST / TAX ── */}
          {tab === "gst" && (
            <div style={card}>
              <SectionHeader icon={<Receipt size={16}/>} title="GST & Tax Settings" subtitle="These defaults auto-fill on new invoices and quotations"/>
              <div style={cardBody}>
                <div style={grid2}>
                  <Field label="GSTIN">
                    <input {...F("gstin")} placeholder="22AARFD5166H1ZB" style={{ ...input, textTransform:"uppercase", letterSpacing:".04em" }}/>
                  </Field>
                  <Field label="State Code">
                    <input {...F("state_code")} placeholder="22" style={input}/>
                  </Field>
                  <Field label="Place of Supply">
                    <input {...F("place_of_supply")} placeholder="Chhattisgarh" style={input}/>
                  </Field>
                  <Field label="Default HSN/SAC Code">
                    <input {...F("default_hsn_sac")} placeholder="998319" style={input}/>
                  </Field>
                </div>

                <div style={{ ...grid3, marginTop:8 }}>
                  <Field label="Default CGST Rate (%)">
                    <input {...Fn("default_cgst_rate")} style={input}/>
                  </Field>
                  <Field label="Default SGST Rate (%)">
                    <input {...Fn("default_sgst_rate")} style={input}/>
                  </Field>
                  <Field label="Default IGST Rate (%)">
                    <input {...Fn("default_igst_rate")} style={input}/>
                  </Field>
                </div>

                <div style={{ marginTop:16, padding:"14px 16px", background:"#f0fdf4", borderRadius:8, border:"1px solid #bbf7d0" }}>
                  <p style={{ fontSize:12, color:"#15803d", margin:0, lineHeight:1.8 }}>
                    <strong>ℹ️ Note:</strong> CGST + SGST apply for intra-state (within {form.place_of_supply || "state"}). IGST applies for inter-state.
                    Default rates are used only when creating new documents — you can override per document.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── BANK DETAILS ── */}
          {tab === "bank" && (
            <div style={card}>
              <SectionHeader icon={<Landmark size={16}/>} title="Bank Account Details" subtitle="Shown in the payment section of every invoice"/>
              <div style={cardBody}>
                <div style={grid2}>
                  <Field label="Bank Name">
                    <input {...F("bank_name")} placeholder="HDFC Bank" style={input}/>
                  </Field>
                  <Field label="Account Holder Name">
                    <input {...F("account_name")} placeholder="Digikraft Social" style={input}/>
                  </Field>
                  <Field label="Account Number">
                    <input {...F("account_number")} placeholder="50200054829505" style={{ ...input, letterSpacing:".06em", fontFamily:"monospace" }}/>
                  </Field>
                  <Field label="IFSC Code">
                    <input {...F("ifsc_code")} placeholder="HDFC0002706" style={{ ...input, textTransform:"uppercase", letterSpacing:".06em" }}/>
                  </Field>
                  <Field label="Branch">
                    <input {...F("branch")} placeholder="Raipur Main Branch" style={input}/>
                  </Field>
                  <Field label="UPI ID">
                    <input {...F("upi_id")} placeholder="9021073372@hdfcbank" style={input}/>
                  </Field>
                </div>

                {/* Preview */}
                <div style={{ marginTop:8, padding:"16px 18px", background:"#f8fafc", borderRadius:8, border:"1px solid #e2e8f0" }}>
                  <p style={{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:8 }}>Preview on Invoice:</p>
                  <div style={{ fontSize:12, color:"#374151", lineHeight:2 }}>
                    <strong>Firm Name:</strong> {form.account_name}<br/>
                    <strong>Bank:</strong> {form.bank_name}<br/>
                    <strong>Account No.:</strong> {form.account_number}<br/>
                    <strong>IFSC:</strong> {form.ifsc_code}<br/>
                    <strong>UPI:</strong> {form.upi_id}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── INVOICE SETTINGS ── */}
          {tab === "invoice" && (
            <div style={card}>
              <SectionHeader icon={<FileText size={16}/>} title="Invoice & Numbering" subtitle="Prefixes and default payment terms"/>
              <div style={cardBody}>
                <div style={grid3}>
                  <Field label="Invoice Prefix">
                    <input {...F("invoice_prefix")} placeholder="DKS-INV" style={input}/>
                    <p style={{ fontSize:11, color:"#94a3b8", margin:"4px 0 0" }}>e.g. DKS-INV-2026-0001</p>
                  </Field>
                  <Field label="Quotation Prefix">
                    <input {...F("quotation_prefix")} placeholder="DKS-Q" style={input}/>
                    <p style={{ fontSize:11, color:"#94a3b8", margin:"4px 0 0" }}>e.g. DKS-Q-2026-0001</p>
                  </Field>
                  <Field label="Proposal Prefix">
                    <input {...F("proposal_prefix")} placeholder="DKS-PROP" style={input}/>
                    <p style={{ fontSize:11, color:"#94a3b8", margin:"4px 0 0" }}>e.g. DKS-PROP-2026-0001</p>
                  </Field>
                </div>

                <div style={{ ...grid2, marginTop:8 }}>
                  <Field label="Default Due Days">
                    <input {...Fn("default_due_days")} style={input}/>
                    <p style={{ fontSize:11, color:"#94a3b8", margin:"4px 0 0" }}>Days from invoice date</p>
                  </Field>
                  <Field label="Late Fee (% per month)">
                    <input {...Fn("late_fee_percent")} step="0.1" style={input}/>
                  </Field>
                </div>

                <div style={{ marginTop:8 }}>
                  <Field label="Invoice Footer Text">
                    <input {...F("invoice_footer_text")} placeholder="This is a Computer Generated Invoice" style={input}/>
                  </Field>
                </div>

                <div style={{ marginTop:16 }}>
                  <Field label="Signatory Name (for proposal sign block)">
                    <input {...F("signature_name")} placeholder="Authorized Signatory" style={input}/>
                  </Field>
                </div>

                <div style={{ marginTop:16 }}>
                  <Field label="Custom Payment Terms (leave blank to use default)">
                    <textarea
                      {...F("payment_terms_text")}
                      rows={4}
                      placeholder="Leave blank to use default payment terms on invoices…"
                      style={{ ...input, resize:"vertical", minHeight:90 }}
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── MY PROFILE ── */}
          {tab === "profile" && (
            <ProfileSection />
          )}

        </form>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Profile Section (change password + name) ──────────────────────────────────
function ProfileSection() {
  const [user, setUser]         = useState(null);
  const [nameForm, setNameForm] = useState({ full_name:"", phone:"" });
  const [pwForm, setPwForm]     = useState({ old_password:"", new_password:"", confirm_password:"" });
  const [nameSaving, setNameSaving] = useState(false);
  const [pwSaving,   setPwSaving]   = useState(false);
  const [nameMsg, setNameMsg]   = useState("");
  const [pwMsg,   setPwMsg]     = useState("");
  const [pwErr,   setPwErr]     = useState("");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("crm_user") || "{}");
      if (u.full_name) { setUser(u); setNameForm({ full_name: u.full_name, phone: u.phone||"" }); }
    } catch {}
  }, []);

  const saveName = async (e) => {
    e.preventDefault(); setNameSaving(true); setNameMsg("");
    try {
      const { data } = await CRM_API.patch("/auth/me", nameForm);
      localStorage.setItem("crm_user", JSON.stringify({ ...user, ...data }));
      setUser(p => ({ ...p, ...data }));
      setNameMsg("Profile updated!");
      setTimeout(() => setNameMsg(""), 3000);
    } catch (e) { setNameMsg("Update failed."); }
    finally { setNameSaving(false); }
  };

  const savePw = async (e) => {
    e.preventDefault(); setPwErr(""); setPwMsg("");
    if (pwForm.new_password !== pwForm.confirm_password) { setPwErr("New passwords don't match."); return; }
    if (pwForm.new_password.length < 6) { setPwErr("Password must be at least 6 characters."); return; }
    setPwSaving(true);
    try {
      await CRM_API.post("/auth/me/change-password", { old_password: pwForm.old_password, new_password: pwForm.new_password });
      setPwForm({ old_password:"", new_password:"", confirm_password:"" });
      setPwMsg("Password changed successfully!");
      setTimeout(() => setPwMsg(""), 3000);
    } catch (e) { setPwErr(e.response?.data?.message || "Change failed."); }
    finally { setPwSaving(false); }
  };

  const initials = user?.full_name?.[0]?.toUpperCase() || "U";
  const inputS   = { width:"100%", padding:"9px 12px", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
  const lbl      = { display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:5 };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Profile card */}
      <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 22px", borderBottom:"1px solid #f1f5f9", background:"#f8fafc" }}>
          <div style={{ padding:8, background:"#f0fdf4", borderRadius:8, color:"#22c55e" }}><User size={16}/></div>
          <div>
            <h3 style={{ fontSize:14, fontWeight:700, color:"#0f172a", margin:0 }}>My Profile</h3>
            <p style={{ fontSize:12, color:"#64748b", margin:"2px 0 0" }}>Update your name and contact info</p>
          </div>
        </div>
        <div style={{ padding:"24px 22px" }}>
          {/* Avatar */}
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", fontSize:22, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{initials}</div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:"#0f172a" }}>{user?.full_name||"—"}</div>
              <div style={{ fontSize:12, color:"#64748b", textTransform:"capitalize" }}>{user?.role||"—"} · {user?.email||"—"}</div>
            </div>
          </div>

          <form onSubmit={saveName} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <label style={lbl}>Full Name</label>
                <input value={nameForm.full_name} onChange={e=>setNameForm(p=>({...p,full_name:e.target.value}))} style={inputS}/>
              </div>
              <div>
                <label style={lbl}>Phone</label>
                <input value={nameForm.phone} onChange={e=>setNameForm(p=>({...p,phone:e.target.value}))} style={inputS}/>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <button type="submit" disabled={nameSaving}
                style={{ padding:"8px 18px", background: nameSaving?"#86efac":"#22c55e", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor: nameSaving?"not-allowed":"pointer" }}>
                {nameSaving ? "Saving…" : "Update Profile"}
              </button>
              {nameMsg && <span style={{ fontSize:13, color:"#15803d", fontWeight:600 }}>✓ {nameMsg}</span>}
            </div>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:14, overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 22px", borderBottom:"1px solid #f1f5f9", background:"#f8fafc" }}>
          <div style={{ padding:8, background:"#fff7ed", borderRadius:8, color:"#ea580c" }}><Settings size={16}/></div>
          <div>
            <h3 style={{ fontSize:14, fontWeight:700, color:"#0f172a", margin:0 }}>Change Password</h3>
            <p style={{ fontSize:12, color:"#64748b", margin:"2px 0 0" }}>Use a strong password with letters, numbers and symbols</p>
          </div>
        </div>
        <div style={{ padding:"24px 22px" }}>
          <form onSubmit={savePw} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {pwErr && <div style={{ background:"#fee2e2", color:"#dc2626", padding:"10px 14px", borderRadius:8, fontSize:13 }}>{pwErr}</div>}
            <div>
              <label style={lbl}>Current Password</label>
              <input type="password" value={pwForm.old_password} onChange={e=>setPwForm(p=>({...p,old_password:e.target.value}))} required style={inputS}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div>
                <label style={lbl}>New Password</label>
                <input type="password" value={pwForm.new_password} onChange={e=>setPwForm(p=>({...p,new_password:e.target.value}))} required minLength={6} style={inputS}/>
              </div>
              <div>
                <label style={lbl}>Confirm New Password</label>
                <input type="password" value={pwForm.confirm_password} onChange={e=>setPwForm(p=>({...p,confirm_password:e.target.value}))} required style={inputS}/>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <button type="submit" disabled={pwSaving}
                style={{ padding:"8px 18px", background: pwSaving?"#86efac":"#22c55e", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor: pwSaving?"not-allowed":"pointer" }}>
                {pwSaving ? "Changing…" : "Change Password"}
              </button>
              {pwMsg && <span style={{ fontSize:13, color:"#15803d", fontWeight:600 }}>✓ {pwMsg}</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
