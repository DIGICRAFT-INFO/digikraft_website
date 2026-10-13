"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import CRM_API from "@/utils/crmApi";

const EMPTY_ITEM = { description:"", quantity:1, unit_price:0, total_price:0 };
const INV_TYPES  = ["full","advance","milestone","final","monthly_retainer"];
const fmt        = n => `₹${Number(n||0).toLocaleString("en-IN")}`;

export default function NewInvoicePage() {
  const router    = useRouter();
  const params    = useSearchParams();
  const clientId  = params.get("client")  || "";
  const projectId = params.get("project") || "";

  const [projects, setProjects] = useState([]);
  const [items,    setItems]    = useState([{ ...EMPTY_ITEM }]);
  const [form, setForm] = useState({
    project: projectId,
    invoice_type:"full", invoice_date: new Date().toISOString().split("T")[0],
    due_date:"", status:"draft", milestone_label:"",
    cgst_rate:9, sgst_rate:9, igst_rate:0,
    hsn_sac:"998319", place_of_supply:"Chhattisgarh", notes:"",
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  useEffect(() => {
    const q = clientId ? `/projects?client=${clientId}` : "/projects";
    CRM_API.get(q).then(({data})=>setProjects(data)).catch(()=>{});
  }, [clientId]);

  const updateItem = (i, k, v) => setItems(prev => prev.map((it,idx) => {
    if (idx!==i) return it;
    const u = {...it, [k]:v};
    u.total_price = (Number(u.quantity)||0) * (Number(u.unit_price)||0);
    return u;
  }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setErr("");
    try {
      await CRM_API.post("/invoices", { ...form, items: items.filter(i=>i.description) });
      if (clientId) router.push(`/crm/dashboard/clients/${clientId}`);
      else          router.push("/crm/dashboard/invoices");
    } catch (ex) { setErr(ex.response?.data?.message||"Save failed"); }
    finally { setSaving(false); }
  };

  const F   = (k) => ({ value: form[k]??'', onChange: e => setForm(p=>({...p,[k]:e.target.value})) });
  const inp = { width:"100%",padding:"10px 13px",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:13,outline:"none",fontFamily:"inherit" };
  const lbl = { display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5 };

  const subtotal = items.reduce((s,i)=>s+(Number(i.total_price)||0), 0);
  const cgst     = subtotal*(Number(form.cgst_rate)||0)/100;
  const sgst     = subtotal*(Number(form.sgst_rate)||0)/100;
  const igst     = subtotal*(Number(form.igst_rate)||0)/100;
  const grand    = subtotal + cgst + sgst + igst;

  return (
    <div style={{ maxWidth:800, margin:"0 auto" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
        <button onClick={()=>router.back()} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,fontWeight:600,color:"#475569",cursor:"pointer" }}>
          <ArrowLeft size={14}/> Back
        </button>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:"#0f172a",margin:0 }}>New Invoice</h1>
          <p style={{ fontSize:13,color:"#64748b",margin:"3px 0 0" }}>Generate an invoice for a project</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:28,display:"flex",flexDirection:"column",gap:20 }}>
          {err && <div style={{ background:"#fee2e2",color:"#dc2626",padding:"11px 15px",borderRadius:8,fontSize:13 }}>{err}</div>}

          {/* Row 1: Project + Invoice Type */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
            <div>
              <label style={lbl}>Project <span style={{color:"#ef4444"}}>*</span></label>
              <select value={form.project} onChange={e=>setForm(p=>({...p,project:e.target.value}))} required style={inp}>
                <option value="">Select project…</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}{p.client_name_snapshot?` — ${p.client_name_snapshot}`:""}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Invoice Type</label>
              <select {...F("invoice_type")} style={inp}>
                {INV_TYPES.map(t=><option key={t} value={t}>{t.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: Dates */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16 }}>
            <div>
              <label style={lbl}>Invoice Date <span style={{color:"#ef4444"}}>*</span></label>
              <input type="date" {...F("invoice_date")} required style={inp}/>
            </div>
            <div>
              <label style={lbl}>Due Date <span style={{color:"#ef4444"}}>*</span></label>
              <input type="date" {...F("due_date")} required style={inp}/>
            </div>
            <div>
              <label style={lbl}>Milestone Label <span style={{fontSize:11,color:"#94a3b8",fontWeight:400}}>(optional)</span></label>
              <input {...F("milestone_label")} style={inp} placeholder="e.g. Month 1 / Phase 1"/>
            </div>
          </div>

          {/* Row 3: HSN + Place of Supply */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
            <div><label style={lbl}>HSN/SAC Code</label><input {...F("hsn_sac")} style={inp} placeholder="998319"/></div>
            <div><label style={lbl}>Place of Supply</label><input {...F("place_of_supply")} style={inp} placeholder="Chhattisgarh"/></div>
          </div>

          {/* Line Items */}
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <label style={{...lbl,margin:0}}>Line Items</label>
              <button type="button" onClick={()=>setItems(p=>[...p,{...EMPTY_ITEM}])} style={{ display:"flex",alignItems:"center",gap:5,padding:"6px 12px",background:"#f0fdf4",color:"#16a34a",border:"1px solid #bbf7d0",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer" }}>
                <Plus size={13}/> Add Row
              </button>
            </div>
            <div style={{ border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden" }}>
              <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
                <thead><tr style={{background:"#f8fafc"}}>
                  {["Description","Qty","Unit Price (₹)","Total (₹)",""].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {items.map((it,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #f8fafc"}}>
                      <td style={{padding:"7px 8px"}}><input value={it.description} onChange={e=>updateItem(i,"description",e.target.value)} placeholder="Service / deliverable" style={{width:"100%",padding:"7px 10px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:13,outline:"none",fontFamily:"inherit"}}/></td>
                      <td style={{padding:"7px 8px",width:70}}><input type="number" min="1" value={it.quantity} onChange={e=>updateItem(i,"quantity",e.target.value)} style={{width:"100%",padding:"7px 8px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:13,outline:"none",textAlign:"right",fontFamily:"inherit"}}/></td>
                      <td style={{padding:"7px 8px",width:130}}><input type="number" min="0" value={it.unit_price} onChange={e=>updateItem(i,"unit_price",e.target.value)} style={{width:"100%",padding:"7px 8px",border:"1px solid #e2e8f0",borderRadius:7,fontSize:13,outline:"none",textAlign:"right",fontFamily:"inherit"}}/></td>
                      <td style={{padding:"7px 12px",fontWeight:700,textAlign:"right",whiteSpace:"nowrap"}}>{fmt(it.total_price)}</td>
                      <td style={{padding:"7px 8px",width:32}}>{items.length>1&&<button type="button" onClick={()=>setItems(p=>p.filter((_,idx)=>idx!==i))} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",padding:3}}><X size={14}/></button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
            {[["cgst_rate","CGST %"],["sgst_rate","SGST %"],["igst_rate","IGST %"]].map(([k,l])=>(
              <div key={k}>
                <label style={{...lbl,marginBottom:4}}>{l}</label>
                <input type="number" min="0" step="0.01" {...F(k)} style={{...inp,padding:"8px 10px"}}/>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background:"#f8fafc",borderRadius:10,padding:"16px 18px" }}>
            {[["Subtotal",fmt(subtotal)],cgst>0&&[`CGST (${form.cgst_rate}%)`,fmt(cgst)],sgst>0&&[`SGST (${form.sgst_rate}%)`,fmt(sgst)],igst>0&&[`IGST (${form.igst_rate}%)`,fmt(igst)]].filter(Boolean).map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span style={{color:"#64748b"}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
            ))}
            <div style={{ display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"2px solid #e2e8f0",fontSize:15,fontWeight:800 }}>
              <span style={{color:"#0f172a"}}>Grand Total</span>
              <span style={{color:"#15803d"}}>{fmt(grand)}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={lbl}>Notes</label>
            <textarea {...F("notes")} rows={3} style={{...inp,resize:"vertical"}} placeholder="Payment instructions, bank details reference…"/>
          </div>
        </div>

        <div style={{ display:"flex",justifyContent:"flex-end",gap:12,marginTop:20 }}>
          <button type="button" onClick={()=>router.back()} style={{padding:"10px 20px",background:"#f1f5f9",color:"#374151",border:"none",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
          <button type="submit" disabled={saving} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 22px",background:saving?"#86efac":"#22c55e",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:saving?"not-allowed":"pointer"}}>
            <Save size={14}/>{saving?"Saving…":"Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
