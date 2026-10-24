"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Plus, X, Zap, UserPlus, ChevronDown } from "lucide-react";
import CRM_API from "@/utils/crmApi";

const EMPTY_ITEM = { description:"", quantity:1, unit_price:0, total_price:0 };
const fmt = n => `₹${Number(n||0).toLocaleString("en-IN")}`;

const CLIENT_TYPES  = ["","startup","sme","enterprise","ecommerce","agency","personal","ngo","other"];
const LEAD_SOURCES  = ["","instagram","facebook","google","linkedin","website","referral","cold_outreach","event","other"];
const INDIA_STATES  = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh","Chandigarh","Puducherry","Other"];

const EMPTY_CLIENT = { full_name:"", company_name:"", email:"", phone:"", billing_address:"", city:"", state:"", gstin:"", website:"", client_type:"", lead_source:"", social_handle:"", notes:"" };

export default function NewQuotationPage() {
  const router    = useRouter();
  const params    = useSearchParams();
  const clientId  = params.get("client")  || "";
  const projectId = params.get("project") || "";

  const [projects,    setProjects]    = useState([]);
  const [services,    setServices]    = useState([]);
  const [items,       setItems]       = useState([{ ...EMPTY_ITEM }]);
  const [newClient,   setNewClient]   = useState({ ...EMPTY_CLIENT });
  const [createdClient, setCreatedClient] = useState(null); // after inline client creation
  const [saving,      setSaving]      = useState(false);
  const [savingClient,setSavingClient]= useState(false);
  const [clientDone,  setClientDone]  = useState(false);
  const [err,         setErr]         = useState("");
  const [clientErr,   setClientErr]   = useState("");

  const [form, setForm] = useState({
    project: projectId, status:"draft", valid_until:"",
    discount_type:"fixed", discount_value:0,
    cgst_rate:9, sgst_rate:9, igst_rate:0,
    hsn_sac:"998319", place_of_supply:"Chhattisgarh", notes:"",
    _projectMode: "select",
    client_name_direct: "",
  });

  useEffect(() => {
    const q = clientId ? `/projects?client=${clientId}` : "/projects";
    Promise.all([CRM_API.get(q), CRM_API.get("/services"), CRM_API.get("/settings")])
      .then(([{data:p},{data:s},{data:cfg}]) => {
        setProjects(p);
        setServices(s.filter(x=>x.status==="active"));
        // Prefill GST defaults from settings
        setForm(prev => ({
          ...prev,
          cgst_rate:       cfg.default_cgst_rate ?? prev.cgst_rate,
          sgst_rate:       cfg.default_sgst_rate ?? prev.sgst_rate,
          igst_rate:       cfg.default_igst_rate ?? prev.igst_rate,
          hsn_sac:         cfg.default_hsn_sac   || prev.hsn_sac,
          place_of_supply: cfg.place_of_supply    || prev.place_of_supply,
        }));
      })
      .catch(()=>{});
  }, [clientId]);

  // ── Save inline new client ──────────────────────────────────────────────────
  const handleCreateClient = async () => {
    if (!newClient.full_name?.trim()) { setClientErr("Full name is required"); return; }
    if (!newClient.phone?.trim())     { setClientErr("Phone is required"); return; }
    if (!newClient.billing_address?.trim()) { setClientErr("Billing address is required"); return; }
    setSavingClient(true); setClientErr("");
    try {
      const { data } = await CRM_API.post("/clients", newClient);
      setCreatedClient(data);
      setClientDone(true);
      // Link the new client to quotation via client_name_direct
      setForm(p => ({ ...p, client_name_direct: data.full_name + (data.company_name ? ` (${data.company_name})` : "") }));
    } catch (ex) { setClientErr(ex.response?.data?.message || "Client creation failed"); }
    finally { setSavingClient(false); }
  };

  // ── Add service as line item ─────────────────────────────────────────────────
  const addServiceAsItem = (svc) => {
    const newItem = {
      description: svc.name + (svc.description ? ` — ${svc.description}` : ""),
      quantity:    1,
      unit_price:  svc.base_price || 0,
      total_price: svc.base_price || 0,
    };
    // If only one empty row exists, replace it; else append
    setItems(prev => {
      const hasEmpty = prev.length === 1 && !prev[0].description && !prev[0].unit_price;
      return hasEmpty ? [newItem] : [...prev, newItem];
    });
  };

  const updateItem = (i, k, v) => setItems(prev => prev.map((it,idx) => {
    if (idx!==i) return it;
    const u = {...it, [k]:v};
    u.total_price = (Number(u.quantity)||0) * (Number(u.unit_price)||0);
    return u;
  }));

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setErr("");
    try {
      const { _projectMode, ...payload } = form;
      // When in "name" mode, ensure project is null (not empty string which causes CastError)
      if (_projectMode === "name" || !payload.project) {
        payload.project = null;
      }
      await CRM_API.post("/quotations", { ...payload, items: items.filter(i=>i.description) });
      if (clientId) router.push(`/crm/dashboard/clients/${clientId}`);
      else          router.push("/crm/dashboard/quotations");
    } catch (ex) { setErr(ex.response?.data?.message||"Save failed"); }
    finally { setSaving(false); }
  };

  const F   = (k) => ({ value: form[k]??'', onChange: e => setForm(p=>({...p,[k]:e.target.value})) });
  const inp = { width:"100%",padding:"10px 13px",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:13,outline:"none",fontFamily:"inherit" };
  const lbl = { display:"block",fontSize:12,fontWeight:600,color:"#374151",marginBottom:5 };

  const subtotal = items.reduce((s,i)=>s+(Number(i.total_price)||0), 0);
  const disc     = form.discount_type==="percentage" ? subtotal*form.discount_value/100 : Number(form.discount_value)||0;
  const taxable  = subtotal - disc;
  const cgst     = taxable*(Number(form.cgst_rate)||0)/100;
  const sgst     = taxable*(Number(form.sgst_rate)||0)/100;
  const igst     = taxable*(Number(form.igst_rate)||0)/100;
  const grand    = taxable + cgst + sgst + igst;

  return (
    <div style={{ maxWidth:800, margin:"0 auto" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:28 }}>
        <button onClick={()=>router.back()} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,fontSize:13,fontWeight:600,color:"#475569",cursor:"pointer" }}>
          <ArrowLeft size={14}/> Back
        </button>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:"#0f172a",margin:0 }}>New Quotation</h1>
          <p style={{ fontSize:13,color:"#64748b",margin:"3px 0 0" }}>Create a price quotation for a project</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ background:"#fff",border:"1px solid #e2e8f0",borderRadius:14,padding:28,display:"flex",flexDirection:"column",gap:20 }}>
          {err && <div style={{ background:"#fee2e2",color:"#dc2626",padding:"11px 15px",borderRadius:8,fontSize:13 }}>{err}</div>}

          {/* Project + Valid Until */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          {/* Project field — Select existing | Type name | Add new client */}
          <div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6 }}>
              <label style={lbl}>Project / Client <span style={{fontSize:11,color:"#94a3b8",fontWeight:400}}>(optional)</span></label>
              <div style={{ display:"flex",gap:2,background:"#f1f5f9",borderRadius:8,padding:2 }}>
                {[
                  { k:"select", label:"Select" },
                  { k:"name",   label:"Enter Name" },
                  { k:"new_client", label:"+ New Client", color:"#7c3aed" },
                ].map(m=>(
                  <button key={m.k} type="button"
                    onClick={()=>{ setForm(p=>({...p,_projectMode:m.k,project:"",client_name_direct:""})); setClientDone(false); setClientErr(""); }}
                    style={{ padding:"4px 10px",borderRadius:6,border:"none",fontSize:11,fontWeight:700,cursor:"pointer",
                      background:form._projectMode===m.k?(m.color||"#fff"):"transparent",
                      color:form._projectMode===m.k?(m.color?"#fff":"#0f172a"):"#64748b",
                      boxShadow:form._projectMode===m.k?"0 1px 4px rgba(0,0,0,.1)":"none" }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Select mode */}
            {form._projectMode==="select" && (
              <select value={form.project} onChange={e=>setForm(p=>({...p,project:e.target.value}))} style={inp}>
                <option value="">— None (no project) —</option>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}{p.client_name_snapshot?` — ${p.client_name_snapshot}`:""}</option>)}
              </select>
            )}

            {/* Enter Name mode */}
            {form._projectMode==="name" && (
              <input value={form.client_name_direct||""} onChange={e=>setForm(p=>({...p,client_name_direct:e.target.value}))}
                style={inp} placeholder="e.g. Rahul Sharma / ABC Technologies"/>
            )}

            {/* New Client mode — inline form */}
            {form._projectMode==="new_client" && (
              <div style={{ border:"1.5px solid #ddd6fe",borderRadius:12,padding:18,background:"#faf5ff" }}>
                {clientDone && createdClient ? (
                  <div style={{ padding:"12px 14px",background:"#dcfce7",borderRadius:8,border:"1px solid #bbf7d0",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:13,fontWeight:700,color:"#15803d" }}>✅ Client created!</div>
                      <div style={{ fontSize:11,color:"#16a34a" }}>{createdClient.full_name} {createdClient.company_name?`(${createdClient.company_name})`:""}</div>
                    </div>
                    <button type="button" onClick={()=>{setClientDone(false);setNewClient({...EMPTY_CLIENT});}} style={{ fontSize:11,color:"#7c3aed",background:"none",border:"none",cursor:"pointer",fontWeight:600 }}>Edit</button>
                  </div>
                ) : (
                  <>
                    {clientErr && <div style={{ background:"#fee2e2",color:"#dc2626",padding:"9px 13px",borderRadius:7,fontSize:12,marginBottom:12 }}>{clientErr}</div>}

                    <p style={{ fontSize:11,fontWeight:700,color:"#7c3aed",textTransform:"uppercase",letterSpacing:".06em",margin:"0 0 12px",display:"flex",alignItems:"center",gap:6 }}>
                      <UserPlus size={13}/> Add New Client
                    </p>

                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
                      <div>
                        <label style={{...lbl,fontSize:11}}>Full Name <span style={{color:"#ef4444"}}>*</span></label>
                        <input value={newClient.full_name} onChange={e=>setNewClient(p=>({...p,full_name:e.target.value}))} placeholder="Rahul Sharma" style={{...inp,padding:"8px 10px"}}/>
                      </div>
                      <div>
                        <label style={{...lbl,fontSize:11}}>Company Name</label>
                        <input value={newClient.company_name} onChange={e=>setNewClient(p=>({...p,company_name:e.target.value}))} placeholder="ABC Technologies" style={{...inp,padding:"8px 10px"}}/>
                      </div>
                      <div>
                        <label style={{...lbl,fontSize:11}}>Email</label>
                        <input type="email" value={newClient.email} onChange={e=>setNewClient(p=>({...p,email:e.target.value}))} placeholder="rahul@abc.com" style={{...inp,padding:"8px 10px"}}/>
                      </div>
                      <div>
                        <label style={{...lbl,fontSize:11}}>Phone <span style={{color:"#ef4444"}}>*</span></label>
                        <input value={newClient.phone} onChange={e=>setNewClient(p=>({...p,phone:e.target.value}))} placeholder="98765 43210" style={{...inp,padding:"8px 10px"}}/>
                      </div>
                    </div>

                    <div style={{ marginBottom:10 }}>
                      <label style={{...lbl,fontSize:11}}>Billing Address <span style={{color:"#ef4444"}}>*</span></label>
                      <input value={newClient.billing_address} onChange={e=>setNewClient(p=>({...p,billing_address:e.target.value}))} placeholder="123, MG Road, Bengaluru" style={{...inp,padding:"8px 10px"}}/>
                    </div>

                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
                      <div>
                        <label style={{...lbl,fontSize:11}}>City</label>
                        <input value={newClient.city} onChange={e=>setNewClient(p=>({...p,city:e.target.value}))} placeholder="Bengaluru" style={{...inp,padding:"8px 10px"}}/>
                      </div>
                      <div>
                        <label style={{...lbl,fontSize:11}}>State</label>
                        <select value={newClient.state} onChange={e=>setNewClient(p=>({...p,state:e.target.value}))} style={{...inp,padding:"8px 10px"}}>
                          <option value="">Select…</option>
                          {INDIA_STATES.map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{...lbl,fontSize:11}}>GSTIN</label>
                        <input value={newClient.gstin} onChange={e=>setNewClient(p=>({...p,gstin:e.target.value.toUpperCase()}))} placeholder="29ABCDE1234F1Z5" style={{...inp,padding:"8px 10px",textTransform:"uppercase",letterSpacing:".04em"}}/>
                      </div>
                      <div>
                        <label style={{...lbl,fontSize:11}}>Website</label>
                        <input value={newClient.website} onChange={e=>setNewClient(p=>({...p,website:e.target.value}))} placeholder="https://abc.com" style={{...inp,padding:"8px 10px"}}/>
                      </div>
                      <div>
                        <label style={{...lbl,fontSize:11}}>Client Type</label>
                        <select value={newClient.client_type} onChange={e=>setNewClient(p=>({...p,client_type:e.target.value}))} style={{...inp,padding:"8px 10px"}}>
                          <option value="">Select…</option>
                          {CLIENT_TYPES.filter(Boolean).map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{...lbl,fontSize:11}}>Lead Source</label>
                        <select value={newClient.lead_source} onChange={e=>setNewClient(p=>({...p,lead_source:e.target.value}))} style={{...inp,padding:"8px 10px"}}>
                          <option value="">Select…</option>
                          {LEAD_SOURCES.filter(Boolean).map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom:12 }}>
                      <label style={{...lbl,fontSize:11}}>Social Handle</label>
                      <input value={newClient.social_handle} onChange={e=>setNewClient(p=>({...p,social_handle:e.target.value}))} placeholder="@abctechnologies" style={{...inp,padding:"8px 10px"}}/>
                    </div>

                    <div style={{ marginBottom:14 }}>
                      <label style={{...lbl,fontSize:11}}>Notes</label>
                      <textarea value={newClient.notes} onChange={e=>setNewClient(p=>({...p,notes:e.target.value}))} rows={2} placeholder="Any additional notes…" style={{...inp,resize:"vertical",padding:"8px 10px"}}/>
                    </div>

                    <button type="button" onClick={handleCreateClient} disabled={savingClient}
                      style={{ width:"100%",padding:"9px",background:savingClient?"#ddd6fe":"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:savingClient?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                      <UserPlus size={13}/> {savingClient ? "Creating Client…" : "Create Client & Link to Quotation"}
                    </button>
                  </>
                )}
              </div>
            )}

            {form._projectMode==="select" && (
              <p style={{fontSize:11,color:"#94a3b8",margin:"5px 0 0"}}>Select from existing projects, or switch to 'Enter Name' to type directly</p>
            )}
          </div>
            <div>
              <label style={lbl}>Valid Until</label>
              <input type="date" {...F("valid_until")} style={inp}/>
            </div>
          </div>

          {/* HSN + Place of Supply */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
            <div><label style={lbl}>HSN/SAC Code</label><input {...F("hsn_sac")} style={inp} placeholder="998319"/></div>
            <div><label style={lbl}>Place of Supply</label><input {...F("place_of_supply")} style={inp} placeholder="Chhattisgarh"/></div>
          </div>

          {/* ✅ Services Quick-Add */}
          {services.length > 0 && (
            <div style={{ background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"14px 16px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:10 }}>
                <Zap size={14} color="#16a34a"/>
                <span style={{ fontSize:12,fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:".05em" }}>Quick Add from Services</span>
                <span style={{ fontSize:11,color:"#16a34a" }}>— Click to add as line item</span>
              </div>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {services.map(svc => (
                  <button key={svc.id} type="button" onClick={() => addServiceAsItem(svc)}
                    style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,border:"1.5px solid #22c55e",background:"#fff",color:"#15803d",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="#22c55e";e.currentTarget.style.color="#fff";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#15803d";}}>
                    <Plus size={12}/>
                    {svc.name}
                    {svc.base_price > 0 && <span style={{ fontSize:11,opacity:.8 }}> · {fmt(svc.base_price)}{svc.price_unit==="monthly"?"/mo":svc.price_unit==="per_hour"?"/hr":svc.price_unit==="one_time"?" OT":""}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

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

          {/* Tax & Discount */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12 }}>
            {[["cgst_rate","CGST %"],["sgst_rate","SGST %"],["igst_rate","IGST %"],["discount_value","Discount"]].map(([k,l])=>(
              <div key={k}>
                <label style={{...lbl,marginBottom:4}}>{l}</label>
                <input type="number" min="0" step="0.01" {...F(k)} style={{...inp,padding:"8px 10px"}}/>
              </div>
            ))}
            <div>
              <label style={{...lbl,marginBottom:4}}>Disc. Type</label>
              <select {...F("discount_type")} style={{...inp,padding:"8px 10px"}}>
                <option value="fixed">Fixed ₹</option>
                <option value="percentage">%</option>
              </select>
            </div>
          </div>

          {/* Grand Total Summary */}
          <div style={{ background:"#f8fafc",borderRadius:10,padding:"16px 18px" }}>
            {[["Subtotal",fmt(subtotal)],disc>0&&["Discount",`-${fmt(disc)}`],disc>0&&["Taxable Amount",fmt(taxable)],cgst>0&&[`CGST (${form.cgst_rate}%)`,fmt(cgst)],sgst>0&&[`SGST (${form.sgst_rate}%)`,fmt(sgst)],igst>0&&[`IGST (${form.igst_rate}%)`,fmt(igst)]].filter(Boolean).map(([l,v])=>(
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
            <textarea {...F("notes")} rows={3} style={{...inp,resize:"vertical"}} placeholder="Terms, payment conditions…"/>
          </div>
        </div>

        <div style={{ display:"flex",justifyContent:"flex-end",gap:12,marginTop:20 }}>
          <button type="button" onClick={()=>router.back()} style={{padding:"10px 20px",background:"#f1f5f9",color:"#374151",border:"none",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
          <button type="submit" disabled={saving} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 22px",background:saving?"#86efac":"#22c55e",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:saving?"not-allowed":"pointer"}}>
            <Save size={14}/>{saving?"Saving…":"Create Quotation"}
          </button>
        </div>
      </form>
    </div>
  );
}
