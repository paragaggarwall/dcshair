// import React, { useState, useMemo, useRef } from "react";
// import { Check, Plus, Minus } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";


// const DEFAULT_TEXTURES = [
//     {
//         id: "double-drawn",
//         name: "Double Drawn",
//         desc: "Uniform length, full thickness end to end",
//         price: 120,
//         icon: (
//             <svg width="34" height="18" viewBox="0 0 34 18">
//                 <path d="M2 3 C 10 3, 10 15, 18 15 S 30 3, 32 3" stroke="var(--apf-gold)" strokeWidth="1.4" fill="none" opacity="0.9" />
//                 <path d="M2 8 C 10 8, 10 15, 18 15 S 30 8, 32 8" stroke="var(--apf-gold)" strokeWidth="1.4" fill="none" opacity="0.6" />
//                 <path d="M2 13 C 10 13, 10 15, 18 15 S 30 13, 32 13" stroke="var(--apf-gold)" strokeWidth="1.4" fill="none" opacity="0.4" />
//             </svg>
//         ),
//     },
//     {
//         id: "single-drawn",
//         name: "Single Drawn",
//         desc: "Natural taper, mixed lengths in the weft",
//         price: 85,
//         icon: (
//             <svg width="34" height="18" viewBox="0 0 34 18">
//                 <path d="M2 3 L 32 15" stroke="var(--apf-gold)" strokeWidth="1.2" opacity="0.9" />
//                 <path d="M2 8 L 26 15" stroke="var(--apf-gold)" strokeWidth="1.2" opacity="0.6" />
//                 <path d="M2 13 L 20 15.5" stroke="var(--apf-gold)" strokeWidth="1.2" opacity="0.4" />
//             </svg>
//         ),
//     },
//     {
//         id: "remy",
//         name: "Remy",
//         desc: "Cuticle intact, aligned root-to-tip",
//         price: 150,
//         icon: (
//             <svg width="34" height="18" viewBox="0 0 34 18">
//                 <path d="M2 4 C 12 4, 12 14, 22 14 S 30 6, 32 4" stroke="var(--apf-gold)" strokeWidth="1.6" fill="none" />
//                 <path d="M2 9 C 12 9, 14 14, 22 14 S 30 10, 32 9" stroke="var(--apf-gold)" strokeWidth="1.6" fill="none" opacity="0.7" />
//             </svg>
//         ),
//     },
// ];

// const DEFAULT_SHADES = [
//     { name: "Natural Black", hex: "#12100e" },
//     { name: "Dark Brown", hex: "#3a2618" },
//     { name: "Chestnut", hex: "#6b4226" },
//     { name: "Honey Blonde", hex: "#c99a4a" },
//     { name: "Platinum", hex: "#e6d9c2" },
//     { name: "Burgundy", hex: "#5c1f2e" },
//     { name: "Grey", hex: "#9b978f" },
// ];

// const DEFAULT_LENGTHS = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

// const fmt = (n) =>
//     "$" + (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// let instanceCounter = 0;


// const emptyform = {
//     productid: "",
//     textureId: "",
//     selectedShades: [],
//     setVariantData: "",

// }


// export function AddProductForm({
//     eyebrow = "DC Shairs International — Ledger",
//     title = "Add Product",
//     sourceLabel = "Sourced — Chennai, IN",
//     startingEntryNo = 148,
//     textures = DEFAULT_TEXTURES,
//     shades = DEFAULT_SHADES,
//     lengths = DEFAULT_LENGTHS,
//     defaultWeight = 100,
//     onAddToInvoice,
// }) {
//     const instanceId = useRef(++instanceCounter).current;

//     const [textureId, setTextureId] = useState(textures[0].id);
//     const [selectedShades, setSelectedShades] = useState(new Set([shades[0].name]));
//     const [selectedLengths, setSelectedLengths] = useState(new Set([String(lengths[1] ?? lengths[0])]));
//     const [variantData, setVariantData] = useState({}); // key "shade|len" -> {qty, price}
//     const [name, setName] = useState(textures[0].name);
//     const [nameEdited, setNameEdited] = useState(false);
//     const [sku, setSku] = useState("");
//     const [imgUrl, setImgUrl] = useState("");
//     const [weight, setWeight] = useState(defaultWeight);
//     const [entryNo, setEntryNo] = useState(startingEntryNo);
//     const [toast, setToast] = useState({ show: false, msg: "" });

//     const [productform, setproductform] = useState(emptyform)

//     const texture = useMemo(() => textures.find((t) => t.id === textureId) ?? textures[0], [textureId, textures]);

//     const toggleShade = (shadeName) => {
//         setSelectedShades((prev) => {
//             const next = new Set(prev);
//             if (next.has(shadeName)) {
//                 if (next.size > 1) next.delete(shadeName);
//             } else {
//                 next.add(shadeName);
//             }
//             return next;
//         });
//     };

//     const toggleLength = (len) => {
//         setSelectedLengths((prev) => {
//             const next = new Set(prev);
//             if (next.has(len)) {
//                 if (next.size > 1) next.delete(len);
//             } else {
//                 next.add(len);
//             }
//             return next;
//         });
//     };

//     const selectTexture = (t) => {
//         setTextureId(t.id);
//         if (!nameEdited) setName(t.name);
//     };

//     const variantFor = (key, fallbackPrice) => variantData[key] ?? { qty: 5, price: fallbackPrice };

//     const setVariant = (key, patch) => {
//         setVariantData((prev) => ({
//             ...prev,
//             [key]: { ...variantFor(key, texture.price), ...patch },
//         }));
//     };

//     const lines = useMemo(() => {
//         const shadeList = Array.from(selectedShades);
//         const lengthList = Array.from(selectedLengths).sort((a, b) => Number(a) - Number(b));
//         const rows = [];
//         shadeList.forEach((shade) => {
//             lengthList.forEach((len) => {
//                 const key = `${shade}|${len}`;
//                 const v = variantFor(key, texture.price);
//                 rows.push({
//                     key,
//                     shade,
//                     length: len,
//                     qty: v.qty,
//                     price: v.price,
//                     subtotal: (parseFloat(v.qty) || 0) * (parseFloat(v.price) || 0),
//                 });
//             });
//         });
//         return rows;
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [selectedShades, selectedLengths, variantData, texture]);

//     const total = lines.reduce((sum, l) => sum + l.subtotal, 0);

//     const handleAdd = () => {
//         const msg = `${lines.length} line${lines.length === 1 ? "" : "s"} added to invoice — ${fmt(total)}`;
//         setToast({ show: true, msg });
//         setEntryNo((n) => n + 1);
//         onAddToInvoice?.(lines, total);
//         window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
//         return productform;
//     };

//     const scope = `apf-${instanceId}`;

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
//             onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
//         >
//             <motion.div
//                 initial={{ scale: 0.95, y: 16 }}
//                 animate={{ scale: 1, y: 0 }}
//                 exit={{ scale: 0.95, y: 16 }}
//                 className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg max-h-[92vh] flex flex-col"
//             >
//                 <div className={`${scope} apf-root`}>
//                     <style>{`
//         .${scope}.apf-root{
//           --apf-walnut:#241612;
//           --apf-ivory:#f6efe4;
//           --apf-ivory-dim:#e4d8c4;
//           --apf-gold:#c9a063;
//           --apf-gold-bright:#e2bd82;
//           --apf-line: rgba(246,239,228,0.14);
//           font-family:'Jost',sans-serif;
//           color:var(--apf-ivory);
//           background:
//             radial-gradient(1100px 500px at 15% -10%, rgba(201,160,99,0.14), transparent 60%),
//             var(--apf-walnut);
//           padding:40px 20px 64px;
//           border-radius:6px;
//         }
//         .${scope} *{box-sizing:border-box;}
//         .${scope} .apf-wrap{max-width:980px;margin:0 auto;}
//         .${scope} .apf-masthead{
//           display:flex;justify-content:space-between;align-items:flex-end;
//           border-bottom:1px solid var(--apf-line);padding-bottom:22px;margin-bottom:32px;
//         }
//         .${scope} .apf-eyebrow{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--apf-gold);margin-bottom:8px;}
//         .${scope} h1{font-family:'Fraunces',serif;font-weight:500;font-size:34px;margin:0;letter-spacing:-0.01em;}
//         .${scope} .apf-ref{text-align:right;font-size:12px;color:var(--apf-ivory-dim);line-height:1.6;}
//         .${scope} .apf-ref b{color:var(--apf-gold-bright);font-weight:500;}
//         .${scope} .apf-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:26px;}
//         @media (max-width:820px){.${scope} .apf-grid{grid-template-columns:1fr;}}
//         .${scope} .apf-card{
//           background:linear-gradient(180deg, rgba(246,239,228,0.05), rgba(246,239,228,0.02));
//           border:1px solid var(--apf-line);border-radius:4px;padding:26px;
//         }
//         .${scope} .apf-section-label{
//           font-family:'Fraunces',serif;font-size:13px;letter-spacing:.14em;text-transform:uppercase;
//           color:var(--apf-gold-bright);margin:0 0 16px;display:flex;align-items:center;gap:10px;
//         }
//         .${scope} .apf-section-label::after{content:"";flex:1;height:1px;background:var(--apf-line);}
//         .${scope} label{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--apf-ivory-dim);margin-bottom:6px;}
//         .${scope} .apf-field{margin-bottom:18px;}
//         .${scope} input[type=text], .${scope} input[type=number], .${scope} input[type=url]{
//           width:100%;background:rgba(0,0,0,0.18);border:1px solid var(--apf-line);color:var(--apf-ivory);
//           padding:10px 12px;font-family:'Jost',sans-serif;font-size:14px;border-radius:3px;outline:none;transition:border-color .15s;
//         }
//         .${scope} input:focus{border-color:var(--apf-gold);}
//         .${scope} .apf-row2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}

//         .${scope} .apf-strand-options{display:flex;flex-direction:column;gap:8px;}
//         .${scope} .apf-strand{
//           display:flex;align-items:center;gap:14px;padding:10px 12px;border:1px solid var(--apf-line);
//           border-radius:3px;cursor:pointer;background:rgba(0,0,0,0.12);transition:.15s;
//         }
//         .${scope} .apf-strand:hover{border-color:rgba(201,160,99,0.5);}
//         .${scope} .apf-strand.active{border-color:var(--apf-gold);background:rgba(201,160,99,0.09);}
//         .${scope} .apf-strand .apf-name{font-size:14px;color:var(--apf-ivory);}
//         .${scope} .apf-strand .apf-desc{font-size:11.5px;color:var(--apf-ivory-dim);}
//         .${scope} .apf-check{
//           margin-left:auto;width:14px;height:14px;border-radius:50%;border:1px solid var(--apf-line);
//           display:flex;align-items:center;justify-content:center;flex-shrink:0;
//         }
//         .${scope} .apf-strand.active .apf-check{border-color:var(--apf-gold);}
//         .${scope} .apf-strand.active .apf-check::after{content:"";width:6px;height:6px;border-radius:50%;background:var(--apf-gold);}

//         .${scope} .apf-shade-options{display:flex;flex-wrap:wrap;gap:12px;}
//         .${scope} .apf-shade{width:52px;text-align:center;cursor:pointer;position:relative;}
//         .${scope} .apf-shade .apf-dot{
//           width:38px;height:38px;border-radius:50%;margin:0 auto 6px;border:2px solid transparent;
//           box-shadow: inset 0 -6px 10px rgba(0,0,0,.35), inset 0 4px 6px rgba(255,255,255,.08);
//         }
//         .${scope} .apf-shade.active .apf-dot{border-color:var(--apf-gold);}
//         .${scope} .apf-shade span{font-size:9.5px;color:var(--apf-ivory-dim);letter-spacing:.02em;line-height:1.2;display:block;}
//         .${scope} .apf-shade.active span{color:var(--apf-gold-bright);}
//         .${scope} .apf-tick{
//           position:absolute;top:-2px;right:6px;width:14px;height:14px;border-radius:50%;background:var(--apf-gold);
//           color:var(--apf-walnut);display:flex;align-items:center;justify-content:center;
//         }
//         .${scope} .apf-subhint{font-size:11px;color:var(--apf-ivory-dim);opacity:.7;margin:-8px 0 12px;}

//         .${scope} .apf-length-chips{display:flex;flex-wrap:wrap;gap:8px;}
//         .${scope} .apf-chip{
//           padding:7px 13px;border:1px solid var(--apf-line);border-radius:3px;cursor:pointer;
//           font-size:13px;color:var(--apf-ivory-dim);background:rgba(0,0,0,0.12);transition:.15s;user-select:none;
//         }
//         .${scope} .apf-chip:hover{border-color:rgba(201,160,99,0.5);}
//         .${scope} .apf-chip.active{border-color:var(--apf-gold);background:rgba(201,160,99,0.12);color:var(--apf-gold-bright);}

//         .${scope} .apf-ledger{position:sticky;top:24px;}
//         .${scope} .apf-ledger-title{
//           font-family:'Fraunces',serif;font-size:15px;letter-spacing:.06em;color:var(--apf-gold-bright);
//           margin-bottom:16px;display:flex;justify-content:space-between;
//         }
//         .${scope} .apf-ledger-title .apf-no{color:var(--apf-ivory-dim);font-family:'Jost';font-size:11px;letter-spacing:.1em;}
//         .${scope} .apf-line-item{
//           display:flex;justify-content:space-between;font-size:13px;padding:9px 0;
//           border-bottom:1px dashed var(--apf-line);color:var(--apf-ivory-dim);
//         }
//         .${scope} .apf-line-item b{color:var(--apf-ivory);font-weight:500;}

//         .${scope} .apf-stepper{display:flex;align-items:center;border:1px solid var(--apf-line);border-radius:3px;}
//         .${scope} .apf-stepper button{
//           background:none;border:none;color:var(--apf-gold-bright);width:26px;height:28px;
//           display:flex;align-items:center;justify-content:center;cursor:pointer;
//         }
//         .${scope} .apf-stepper button:hover{background:rgba(201,160,99,0.1);}
//         .${scope} .apf-stepper input{
//           width:38px;text-align:center;border:none;border-left:1px solid var(--apf-line);border-right:1px solid var(--apf-line);
//           background:none;color:var(--apf-ivory);height:28px;font-size:13px;padding:0;
//         }
//         .${scope} .apf-price-input{display:flex;align-items:center;gap:5px;}
//         .${scope} .apf-price-input span{color:var(--apf-ivory-dim);font-size:12px;}
//         .${scope} .apf-price-input input{padding:6px 8px;width:60px;font-size:13px;}

//         .${scope} .apf-variant-list{max-height:340px;overflow-y:auto;margin:14px 0;padding-right:4px;}
//         .${scope} .apf-variant-row{
//           display:grid;grid-template-columns:1fr auto auto auto;gap:10px;align-items:center;
//           padding:10px 0;border-bottom:1px solid var(--apf-line);
//         }
//         .${scope} .apf-vname{font-size:13px;color:var(--apf-ivory);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
//         .${scope} .apf-vmeta{font-size:10.5px;color:var(--apf-ivory-dim);letter-spacing:.02em;}
//         .${scope} .apf-vsub{font-family:'Fraunces',serif;font-size:14px;color:var(--apf-gold-bright);text-align:right;min-width:58px;}
//         .${scope} .apf-empty-note{font-size:12.5px;color:var(--apf-ivory-dim);opacity:.75;padding:14px 0;text-align:center;}

//         .${scope} .apf-total-box{
//           margin-top:16px;padding-top:16px;border-top:1px solid var(--apf-line);
//           display:flex;justify-content:space-between;align-items:baseline;
//         }
//         .${scope} .apf-total-box .apf-lbl{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--apf-ivory-dim);}
//         .${scope} .apf-total-box .apf-val{font-family:'Fraunces',serif;font-size:32px;color:var(--apf-gold-bright);}

//         .${scope} .apf-add-btn{
//           width:100%;margin-top:20px;padding:13px;background:var(--apf-gold);border:none;color:var(--apf-walnut);
//           font-family:'Jost',sans-serif;font-weight:600;font-size:13px;letter-spacing:.1em;text-transform:uppercase;
//           border-radius:3px;cursor:pointer;transition:.15s;
//         }
//         .${scope} .apf-add-btn:hover{background:var(--apf-gold-bright);}
//         .${scope} .apf-add-btn:active{transform:scale(0.99);}
//         .${scope} .apf-hint{font-size:11px;color:var(--apf-ivory-dim);margin-top:9px;text-align:center;opacity:.7;}

//         .${scope} .apf-toast{
//           position:sticky;bottom:16px;margin:16px auto 0;width:fit-content;
//           background:var(--apf-gold);color:var(--apf-walnut);padding:10px 20px;border-radius:3px;
//           font-size:12.5px;font-weight:500;opacity:0;transform:translateY(8px);transition:.25s;pointer-events:none;
//         }
//         .${scope} .apf-toast.show{opacity:1;transform:translateY(0);}
//       `}</style>

//                     <link
//                         rel="stylesheet"
//                         href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Jost:wght@400;500;600&display=swap"
//                     />

//                     <div className="apf-wrap">
//                         <div className="apf-masthead">
//                             <div>
//                                 <div className="apf-eyebrow">{eyebrow}</div>
//                                 <h1>{title}</h1>
//                             </div>
//                             <div className="apf-ref">
//                                 Entry No. <b>{String(entryNo).padStart(4, "0")}</b>
//                                 <br />
//                                 {sourceLabel}
//                             </div>
//                         </div>

//                         <div className="apf-grid">
//                             {/* LEFT: product details */}
//                             <div>
//                                 <div className="apf-card" style={{ marginBottom: 22 }}>
//                                     <div className="apf-section-label">Product</div>
//                                     <div className="apf-field">
//                                         <label>Product name</label>
//                                         <input
//                                             type="text"
//                                             value={name}
//                                             onChange={(e) => {
//                                                 setNameEdited(true);
//                                                 setName(e.target.value);
//                                             }}
//                                             placeholder="e.g. Double Drawn — Natural Black"
//                                         />
//                                     </div>
//                                     <div className="apf-row2">
//                                         <div className="apf-field">
//                                             <label>SKU code</label>
//                                             <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="DDB-16-NBK" />
//                                         </div>
//                                         <div className="apf-field">
//                                             <label>Image URL <span style={{ opacity: 0.6 }}>(optional)</span></label>
//                                             <input type="url" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://..." />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="apf-card" style={{ marginBottom: 22 }}>
//                                     <div className="apf-section-label">Texture</div>
//                                     <div className="apf-strand-options">
//                                         {textures.map((t) => (
//                                             <div
//                                                 key={t.id}
//                                                 className={`apf-strand${t.id === textureId ? " active" : ""}`}
//                                                 onClick={() => selectTexture(t)}
//                                             >
//                                                 {t.icon}
//                                                 <div>
//                                                     <div className="apf-name">{t.name}</div>
//                                                     <div className="apf-desc">{t.desc}</div>
//                                                 </div>
//                                                 <div className="apf-check" />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div className="apf-card">
//                                     <div className="apf-section-label">Shade</div>
//                                     <div className="apf-subhint">Tap to select one or more shades for this product</div>
//                                     <div className="apf-shade-options">
//                                         {shades.map((s) => {
//                                             const active = selectedShades.has(s.name);
//                                             return (
//                                                 <div key={s.name} className={`apf-shade${active ? " active" : ""}`} onClick={() => toggleShade(s.name)}>
//                                                     {active && (
//                                                         <div className="apf-tick">
//                                                             <Check size={9} strokeWidth={3} />
//                                                         </div>
//                                                     )}
//                                                     <div className="apf-dot" style={{ background: s.hex }} />
//                                                     <span>{s.name}</span>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>

//                                     <div className="apf-field" style={{ marginTop: 24 }}>
//                                         <label>Length — select one or more</label>
//                                         <div className="apf-length-chips">
//                                             {lengths.map((len) => {
//                                                 const key = String(len);
//                                                 const active = selectedLengths.has(key);
//                                                 return (
//                                                     <div key={key} className={`apf-chip${active ? " active" : ""}`} onClick={() => toggleLength(key)}>
//                                                         {len}"
//                                                     </div>
//                                                 );
//                                             })}
//                                         </div>
//                                     </div>

//                                     <div className="apf-field" style={{ marginTop: 20, marginBottom: 0 }}>
//                                         <label>
//                                             Weight per bundle (g) <span style={{ opacity: 0.6 }}>— applies to all variants</span>
//                                         </label>
//                                         <input type="number" min={1} value={weight} onChange={(e) => setWeight(e.target.value)} />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* RIGHT: ledger */}
//                             <div>
//                                 <div className="apf-card apf-ledger">
//                                     <div className="apf-ledger-title">
//                                         Variants <span className="apf-no">{lines.length} {lines.length === 1 ? "line" : "lines"}</span>
//                                     </div>

//                                     <div className="apf-line-item">
//                                         <span>Product</span>
//                                         <b>{name || texture.name}</b>
//                                     </div>
//                                     <div className="apf-line-item">
//                                         <span>Weight</span>
//                                         <b>{weight} g / bundle</b>
//                                     </div>

//                                     <div className="apf-variant-list">
//                                         {lines.length === 0 && (
//                                             <div className="apf-empty-note">Select at least one shade and one length to build line items.</div>
//                                         )}
//                                         {lines.map((l) => (
//                                             <div className="apf-variant-row" key={l.key}>
//                                                 <div>
//                                                     <div className="apf-vname">{l.shade}</div>
//                                                     <div className="apf-vmeta">{l.length}" · {weight}g</div>
//                                                 </div>
//                                                 <div className="apf-stepper">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => setVariant(l.key, { qty: Math.max(1, (parseInt(l.qty) || 1) - 1) })}
//                                                     >
//                                                         <Minus size={12} />
//                                                     </button>
//                                                     <input
//                                                         type="number"
//                                                         min={1}
//                                                         value={l.qty}
//                                                         onChange={(e) => setVariant(l.key, { qty: e.target.value })}
//                                                     />
//                                                     <button type="button" onClick={() => setVariant(l.key, { qty: (parseInt(l.qty) || 0) + 1 })}>
//                                                         <Plus size={12} />
//                                                     </button>
//                                                 </div>
//                                                 <div className="apf-price-input">
//                                                     <span>$</span>
//                                                     <input
//                                                         type="number"
//                                                         min={0}
//                                                         value={l.price}
//                                                         onChange={(e) => setVariant(l.key, { price: e.target.value })}
//                                                     />
//                                                 </div>
//                                                 <div className="apf-vsub">{fmt(l.subtotal)}</div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     <div className="apf-total-box">
//                                         <div className="apf-lbl">Total due</div>
//                                         <div className="apf-val">{fmt(total)}</div>
//                                     </div>

//                                     <button className="apf-add-btn" onClick={handleAdd} disabled={lines.length === 0}>
//                                         Add all to invoice
//                                     </button>
//                                     <div className="apf-hint">Each shade × length is its own line — qty × price, summed</div>

//                                     <div className={`apf-toast${toast.show ? " show" : ""}`}>{toast.msg}</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// }

// export default function Demo() {
//     const [invoiceLog, setInvoiceLog] = useState([]);

//     const handleAdd = (label) => (lines, total) => {
//         setInvoiceLog((prev) => [{ label, count: lines.length, total, id: Date.now() }, ...prev].slice(0, 5));
//     };

//     return (
//         <div style={{ display: "flex", flexDirection: "column", gap: 24, background: "#0e0a08", padding: 24, borderRadius: 8 }}>
//             <AddProductForm
//                 eyebrow="DC Shairs International — Ledger"
//                 title="Add Product"
//                 startingEntryNo={148}
//                 onAddToInvoice={handleAdd("Catalogue entry")}
//             />

//             <AddProductForm
//                 eyebrow="Reorder Desk — Quick Add"
//                 title="Reorder Product"
//                 sourceLabel="Warehouse — Bengaluru, IN"
//                 startingEntryNo={412}
//                 defaultWeight={50}
//                 onAddToInvoice={handleAdd("Reorder desk")}
//             />

//             {invoiceLog.length > 0 && (
//                 <div
//                     style={{
//                         maxWidth: 980,
//                         margin: "0 auto",
//                         width: "100%",
//                         color: "#e4d8c4",
//                         fontFamily: "Jost, sans-serif",
//                         fontSize: 13,
//                         background: "rgba(246,239,228,0.04)",
//                         border: "1px solid rgba(246,239,228,0.14)",
//                         borderRadius: 6,
//                         padding: 16,
//                     }}
//                 >
//                     <div style={{ color: "#e2bd82", marginBottom: 8, letterSpacing: "0.08em", fontSize: 11, textTransform: "uppercase" }}>
//                         Combined activity (both instances feed this log independently)
//                     </div>
//                     {invoiceLog.map((entry) => (
//                         <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
//                             <span>{entry.label} — {entry.count} line{entry.count === 1 ? "" : "s"}</span>
//                             <b style={{ color: "#f6efe4" }}>{fmt(entry.total)}</b>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Calendar,
    Settings,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    Plus,
    Minus,
    Scissors,
    Palette,
    Ruler,
    Package,
    Receipt,
    Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "./CustomSelect";


/* =========================================================================
   InputBox — provided component, unchanged. Every text/number field in
   the product form below is built on top of this.
========================================================================= */
function DateFormatModal({ onClose, onApply, currentFormat }) {
    const SEPARATORS = ["/", "-", ".", " ", ""];

    const defaultParts = (() => {
        for (const sep of ["/", "-", ".", " "]) {
            const p = currentFormat?.split(sep);
            if (p?.length === 3) return { p0: p[0], p1: p[1], p2: p[2], sep };
        }
        return { p0: "DD", p1: "MM", p2: "YYYY", sep: "/" };
    })();

    const [order, setOrder] = useState([defaultParts.p0, defaultParts.p1, defaultParts.p2]);
    const [sep, setSep] = useState(defaultParts.sep);

    const ALL_TOKENS = ["DD", "D", "MM", "M", "MMM", "MMMM", "YYYY", "YY"];
    const TOKEN_LABELS = {
        DD: "Day (01)", D: "Day (1)", MM: "Month (01)", M: "Month (1)",
        MMM: "Mon", MMMM: "Month", YYYY: "Year (2026)", YY: "Year (26)",
    };

    const sample = (() => {
        const d = new Date();
        const map = {
            DD: String(d.getDate()).padStart(2, "0"), D: String(d.getDate()),
            MM: String(d.getMonth() + 1).padStart(2, "0"), M: String(d.getMonth() + 1),
            MMM: d.toLocaleString("default", { month: "short" }),
            MMMM: d.toLocaleString("default", { month: "long" }),
            YYYY: String(d.getFullYear()), YY: String(d.getFullYear()).slice(2),
        };
        return order.map(t => map[t] || t).join(sep);
    })();

    return (
        <div
            className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl w-[360px] shadow-2xl overflow-visible">
                <div className="flex items-center gap-2 px-4 py-3 text-xs bg-[#003366] font-bold rounded-3xl m-2 text-white">
                    <Settings size={14} />
                    <span>Date Format Configuration</span>
                    <button onClick={onClose} className="ml-auto opacity-80 hover:opacity-100 cursor-pointer">
                        <X size={14} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase">Display Order</div>
                    <div className="flex gap-2">
                        {order.map((token, i) => (
                            <div key={i} className="flex-1">
                                <div className="mb-1 text-[10px] text-gray-400">Position {i + 1}</div>
                                <select
                                    value={token}
                                    onChange={e => {
                                        const next = [...order];
                                        next[i] = e.target.value;
                                        setOrder(next);
                                    }}
                                    className="w-full px-2 py-1 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                                >
                                    {ALL_TOKENS.map(t => (
                                        <option key={t} value={t}>{TOKEN_LABELS[t]}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 mb-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase">Separator</div>
                    <div className="flex flex-wrap gap-2">
                        {SEPARATORS.map(s => (
                            <button
                                key={s || "none"}
                                onClick={() => setSep(s)}
                                className={`px-3 py-1 text-xs font-mono rounded-md border transition
                  ${sep === s ? "bg-indigo-50 text-indigo-600 border-indigo-600 font-bold" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                            >
                                {s === "" ? "None" : `"${s}"`}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-gray-100 rounded-lg flex flex-col gap-1">
                        <span className="text-[10px] tracking-widest text-gray-400 uppercase">Sample Display:</span>
                        <span className="text-lg font-bold text-gray-900">{sample}</span>
                        <span className="text-xs text-gray-600 font-mono">({order.join(sep)})</span>
                    </div>
                </div>

                <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onApply(order.join(sep))}
                        className="flex items-center gap-1.5 text-[10px] bg-[#003366] font-bold text-white hover:bg-[#004080] px-2.5 py-1 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                        <Check size={13} />
                        Apply Format
                    </button>
                </div>
            </div>
        </div>
    );
}

function CalendarPicker({ value, onChange, onClose, anchorRef }) {
    const today = new Date();
    const initDate = value ? new Date(value + "T00:00:00") : today;
    const [view, setView] = useState({ year: initDate.getFullYear(), month: initDate.getMonth() });
    const [selected, setSelected] = useState(value ? new Date(value + "T00:00:00") : null);
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target) && anchorRef.current && !anchorRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const firstDay = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const prevMonth = () => setView(v => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }));
    const nextMonth = () => setView(v => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }));

    const pick = (day) => {
        const d = new Date(view.year, view.month, day);
        setSelected(d);
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        onChange(iso);
        onClose();
    };

    const isSel = (day) => selected && selected.getFullYear() === view.year && selected.getMonth() === view.month && selected.getDate() === day;
    const isToday = (day) => today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === day;

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div ref={ref} className="absolute top-[calc(100%+5px)] right-0 z-[999999] w-[220px] p-2.5 bg-white border border-gray-200 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-2">
                <button onClick={prevMonth} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-700 hover:bg-gray-200">
                    <ChevronLeft size={13} />
                </button>
                <span className="text-xs font-bold text-gray-900">{MONTHS[view.month]} {view.year}</span>
                <button onClick={nextMonth} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-700 hover:bg-gray-200">
                    <ChevronRight size={13} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-[2px]">
                {DAYS.map(d => (
                    <div key={d} className="text-[9px] font-semibold text-gray-400 text-center py-[2px]">{d}</div>
                ))}
                {cells.map((day, i) => {
                    const selectedDay = day && isSel(day);
                    const todayDay = day && isToday(day);
                    return (
                        <div
                            key={i}
                            onClick={() => day && pick(day)}
                            className={`text-[11px] text-center py-[4px] rounded cursor-pointer
                ${!day ? "cursor-default" : ""}
                ${selectedDay ? "bg-[#003366] text-white font-bold" : ""}
                ${!selectedDay && todayDay ? "bg-green-50 text-green-600 font-bold" : ""}
                ${!selectedDay && !todayDay ? "text-gray-700" : ""}`}
                        >
                            {day || ""}
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 flex justify-center">
                <button
                    onClick={() => { pick(today.getDate()); setView({ year: today.getFullYear(), month: today.getMonth() }); }}
                    className="text-xs font-semibold text-[#003366] hover:underline"
                >
                    Today
                </button>
            </div>
        </div>
    );
}

function InputBox({
    title,
    value,
    handleChangeFunction,
    note,
    measure,
    inputFor,
    type = "text",
    isSufixOrPrefix = "noSufixNorPrefix",
    isDecimalAllowed = false,
    isInputBoxDisabled = false,
    placeholder,
    isMandatory = false,
    sizeBig = false,
    cursor = "",
    icon,
    isLoading = false,
    autoComplete = "off",
}) {
    const [focused, setFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState(value !== undefined && value !== null ? String(value) : "");
    const isTypingRef = useRef(false);

    const isDate = type === "date";
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
    const [showFormat, setShowFormat] = useState(false);
    const [showCal, setShowCal] = useState(false);
    const calBtnRef = useRef();

    useEffect(() => {
        if (!isTypingRef.current) {
            const incoming = value !== undefined && value !== null ? String(value) : "";
            const numericMatch = type === "number" && parseFloat(incoming) === parseFloat(displayValue) && displayValue.endsWith(".");
            if (!numericMatch) setDisplayValue(incoming);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleKeyDown = (e) => {
        if (type === "number") {
            const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
            const isCtrlCmd = e.ctrlKey || e.metaKey;
            const isNumberKey = /^[0-9]$/.test(e.key);
            const isDecimal = e.key === ".";
            const currentValue = String(displayValue ?? "");

            if (isCtrlCmd && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) return;
            if (allowedKeys.includes(e.key)) return;
            if (isNumberKey) return;
            if (isDecimal) {
                if (!isDecimalAllowed || currentValue.includes(".")) e.preventDefault();
                return;
            }
            e.preventDefault();
        }
    };

    const handleChange = (e) => {
        const raw = e.target.value;
        if (type === "number") {
            const isValid = isDecimalAllowed ? /^[0-9]*\.?[0-9]*$/.test(raw) : /^[0-9]*$/.test(raw);
            if (!isValid && raw !== "") return;
            isTypingRef.current = true;
            setDisplayValue(raw);
            handleChangeFunction({ ...e, target: { ...e.target, value: raw, name: inputFor, id: inputFor } });
            clearTimeout(handleChange._timer);
            handleChange._timer = setTimeout(() => { isTypingRef.current = false; }, 300);
        } else {
            setDisplayValue(raw);
            handleChangeFunction(e);
        }
    };

    const handlePaste = (e) => {
        if (type === "number") {
            const pasted = e.clipboardData.getData("text");
            const pattern = isDecimalAllowed ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
            if (!pattern.test(pasted)) e.preventDefault();
        }
    };

    const handleBlur = () => {
        setFocused(false);
        isTypingRef.current = false;
        if (type === "number" && displayValue.endsWith(".")) {
            const cleaned = displayValue.slice(0, -1);
            setDisplayValue(cleaned);
            handleChangeFunction({ target: { value: cleaned, name: inputFor, id: inputFor } });
        }
    };

    const formatDisplay = (isoVal) => {
        if (!isoVal) return "";
        const d = new Date(isoVal + "T00:00:00");
        if (isNaN(d)) return isoVal;
        const map = {
            DD: String(d.getDate()).padStart(2, "0"), D: String(d.getDate()),
            MM: String(d.getMonth() + 1).padStart(2, "0"), M: String(d.getMonth() + 1),
            MMM: d.toLocaleString("default", { month: "short" }),
            MMMM: d.toLocaleString("default", { month: "long" }),
            YYYY: String(d.getFullYear()), YY: String(d.getFullYear()).slice(2),
        };
        const sep = dateFormat.match(/[\/\-\. ]/) ? dateFormat.match(/[\/\-\. ]/)[0] : "/";
        return dateFormat.split(sep).map(t => map[t] || t).join(sep);
    };

    const handleCalChange = (isoVal) => {
        handleChangeFunction?.({ target: { name: inputFor, id: inputFor, value: isoVal } });
    };

    const inputProps = {
        type: "text",
        inputMode: type === "number" ? "decimal" : undefined,
        name: inputFor,
        id: inputFor,
        placeholder,
        value: displayValue,
        disabled: isInputBoxDisabled,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        onPaste: handlePaste,
        onFocus: () => setFocused(true),
        onBlur: handleBlur,
        autoComplete,
    };

    return (
        <div className="w-full">
            {title && (
                <label
                    htmlFor={inputFor}
                    className={`flex items-center min-w-0 ${sizeBig ? "text-[13px] lg:text-[14px]" : "text-[11px] lg:text-[12px]"} font-semibold mb-1.5 text-slate-700`}
                >
                    <span className="truncate">{title}</span>
                    {isMandatory && <span className="text-red-500 ml-1 flex-shrink-0">*</span>}
                </label>
            )}

            <div
                className={`flex items-center gap-1.5 px-2.5 rounded-xl transition-all duration-200 relative ${isInputBoxDisabled ? "bg-gray-100 cursor-not-allowed opacity-80" : "bg-white"}`}
                style={{
                    border: `1.5px solid ${isInputBoxDisabled ? "#e5e7eb" : focused ? "var(--defaultBgColor)" : "#e5e7eb"}`,
                    boxShadow: focused && !isInputBoxDisabled ? "0 0 0 2px color-mix(in srgb, var(--defaultBgColor) 10%, transparent)" : "none",
                }}
            >
                <style>{`
          #${inputFor}:-webkit-autofill,
          #${inputFor}:-webkit-autofill:hover,
          #${inputFor}:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color: #1f2937 !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}</style>

                {icon && (
                    <span className="flex-shrink-0" style={{ color: focused ? "var(--defaultBgColor)" : "#9ca3af", fontSize: 16, display: "flex", alignItems: "center", transition: "color 0.15s" }}>
                        {icon}
                    </span>
                )}

                {isLoading && <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-[1px] animate-pulse z-10 pointer-events-none" />}

                {isSufixOrPrefix === "prefix" && (
                    <span className="text-[11px] font-bold text-gray-400 border-r border-gray-100 pr-2 whitespace-nowrap flex-shrink-0">{measure}</span>
                )}

                {isDate ? (
                    <>
                        <div style={{ flex: 1, minWidth: 0, fontSize: sizeBig ? "0.95rem" : "0.875rem", color: value ? "#1f2937" : "#9ca3af", padding: sizeBig ? "0.75rem 0" : "0.55rem 0" }}>
                            {value ? formatDisplay(value) : placeholder || `DD/MM/YYYY`}
                        </div>
                        <input type="hidden" name={inputFor} id={inputFor} value={value || ""} />
                        <div style={{ display: "flex", alignItems: "center", gap: 4, paddingRight: 2, flexShrink: 0 }}>
                            <button type="button" title="Configure date format" onClick={() => { setShowFormat(true); setShowCal(false); }}
                                style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 6px", border: "1px solid #e5e7eb", borderRadius: 5, background: "#f9fafb", fontSize: 10, fontWeight: 600, color: "#374151", cursor: "pointer", whiteSpace: "nowrap" }}>
                                <Settings size={10} />
                                {dateFormat}
                            </button>
                            <button ref={calBtnRef} type="button" title="Pick a date" onClick={() => { setShowCal(v => !v); setShowFormat(false); }}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, border: "1px solid #e5e7eb", borderRadius: 5, background: "#f9fafb", cursor: "pointer", color: "var(--defaultBgColor, #003366)", flexShrink: 0 }}>
                                <Calendar size={13} />
                            </button>
                        </div>
                        {showCal && !isInputBoxDisabled && (
                            <CalendarPicker value={value} onChange={handleCalChange} onClose={() => setShowCal(false)} anchorRef={calBtnRef} />
                        )}
                    </>
                ) : (
                    <input
                        {...inputProps}
                        style={{
                            flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
                            fontSize: sizeBig ? "0.95rem" : "0.875rem",
                            color: isInputBoxDisabled ? "#6b7280" : "#1f2937",
                            padding: sizeBig ? "0.75rem 0" : "0.55rem 0",
                            boxShadow: "none",
                        }}
                        className={`placeholder-gray-400 focus:outline-none focus:ring-0 ${cursor} w-full disabled:cursor-not-allowed`}
                    />
                )}

                {isSufixOrPrefix === "sufix" && (
                    <span className="text-[11px] font-bold text-gray-400 border-l border-gray-100 pl-2 whitespace-nowrap flex-shrink-0">{measure}</span>
                )}
            </div>

            {note && (
                <span className="text-[10px] text-gray-400 mt-1 block leading-tight truncate px-1" title={note}>Note: {note}</span>
            )}

            {showFormat && !isInputBoxDisabled && (
                <DateFormatModal currentFormat={dateFormat} onClose={() => setShowFormat(false)} onApply={(f) => { setDateFormat(f); setShowFormat(false); }} />
            )}
        </div>
    );
}

/* =========================================================================
   Add Product — single form, Tailwind-only, built on InputBox.
   All state lives in one `productForm` object plus the selection sets
   for texture/shade/length. On submit, everything currently in the form
   (fields + every shade×length line) is packaged into one payload and
   handed to handleAdd, which forwards it to onAddToInvoice.
========================================================================= */
const DEFAULT_TEXTURES = [
    { id: "double-drawn", name: "Double Drawn", desc: "Uniform length, full thickness end to end", price: 120 },
    { id: "single-drawn", name: "Single Drawn", desc: "Natural taper, mixed lengths in the weft", price: 85 },
    { id: "remy", name: "Remy", desc: "Cuticle intact, aligned root-to-tip", price: 150 },
];

const DEFAULT_SHADES = [
    { name: "Natural Black", hex: "#12100e" },
    { name: "Dark Brown", hex: "#3a2618" },
    { name: "Chestnut", hex: "#6b4226" },
    { name: "Honey Blonde", hex: "#c99a4a" },
    { name: "Platinum", hex: "#e6d9c2" },
    { name: "Burgundy", hex: "#5c1f2e" },
    { name: "Grey", hex: "#9b978f" },
];

const DEFAULT_LENGTHS = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

const fmt = (n) => "$" + (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const emptyForm = {
    product: [],
    productId: "",
    name: "",
    sku: "",
    imgUrl: "",
    weight: 100,
    weightUnit: "",
};

let instanceCounter = 0;

export function AddProductForm({
    eyebrow = "DC Shairs International — Ledger",
    title = "Add Product",
    sourceLabel = "Sourced — Chennai, IN",
    startingEntryNo = 148,
    textures = DEFAULT_TEXTURES,
    shades = DEFAULT_SHADES,
    lengths = DEFAULT_LENGTHS,
    defaultWeight = 100,
    onAddToInvoice, // (payload) => void — receives the whole form + all variant lines
    onClose,
    options,
}) {
    const instanceId = useRef(++instanceCounter).current;

    const [productForm, setProductForm] = useState({ ...emptyForm, weight: defaultWeight });
    const [textureId, setTextureId] = useState(textures[0].id);
    const [selectedShades, setSelectedShades] = useState(new Set([shades[0].name]));
    const [selectedLengths, setSelectedLengths] = useState(new Set([String(lengths[1] ?? lengths[0])]));
    const [variantData, setVariantData] = useState({});
    const [nameEdited, setNameEdited] = useState(false);
    const [entryNo, setEntryNo] = useState(startingEntryNo);
    const [toast, setToast] = useState({ show: false, msg: "" });

    const texture = useMemo(() => textures.find((t) => t.id === textureId) ?? textures[0], [textureId, textures]);

    // Single generic handler — every InputBox in the product-detail card writes here.
    const handleField = (e) => {
        const { name, value } = e.target;
        if (name === "name") setNameEdited(true);
        setProductForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleShade = (shadeName) => {
        setSelectedShades((prev) => {
            const next = new Set(prev);
            if (next.has(shadeName)) { if (next.size > 1) next.delete(shadeName); }
            else next.add(shadeName);
            return next;
        });
    };

    const toggleLength = (len) => {
        setSelectedLengths((prev) => {
            const next = new Set(prev);
            if (next.has(len)) { if (next.size > 1) next.delete(len); }
            else next.add(len);
            return next;
        });
    };

    const selectTexture = (t) => {
        setTextureId(t.id);
        if (!nameEdited) setProductForm((prev) => ({ ...prev, name: t.name }));
    };

    const variantFor = (key, fallbackPrice) => variantData[key] ?? { qty: 5, price: fallbackPrice };
    const setVariant = (key, patch) => {
        setVariantData((prev) => ({ ...prev, [key]: { ...variantFor(key, texture.price), ...patch } }));
    };

    const lines = useMemo(() => {
        const shadeList = Array.from(selectedShades);
        const lengthList = Array.from(selectedLengths).sort((a, b) => Number(a) - Number(b));
        const rows = [];
        shadeList.forEach((shade) => {
            lengthList.forEach((len) => {
                const key = `${shade}|${len}`;
                const v = variantFor(key, texture.price);
                rows.push({ key, shade, length: len, qty: v.qty, price: v.price, subtotal: (parseFloat(v.qty) || 0) * (parseFloat(v.price) || 0) });
            });
        });
        return rows;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedShades, selectedLengths, variantData, texture]);

    const total = lines.reduce((sum, l) => sum + l.subtotal, 0);

    // Packages every field currently in the form + every variant line into
    // one payload, then sends the whole thing on to onAddToInvoice.
    const handleAdd = () => {
        const payload = {
            entryNo,
            product: {
                name: productForm.name || texture.name,
                sku: productForm.sku,
                imgUrl: productForm.imgUrl,
                weight: productForm.weight,
                texture: { id: texture.id, name: texture.name },
            },
            variants: lines,
            total,
        };

        onAddToInvoice?.(payload);

        setToast({ show: true, msg: `${lines.length} line${lines.length === 1 ? "" : "s"} added to invoice — ${fmt(total)}` });
        setEntryNo((n) => n + 1);
        window.setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);

        return payload;
    };

    const sectionLabel = (Icon, text) => (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b ">
            <Icon size={14} className="text-bg-bg-[#003366]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-bg-[#003366]">{text}</span>
        </div>
    );

    const handleProductSelect = (productId) => {
        const product = options.products.find(p => p.id === productId);
        if (!product) return;
        setProductForm(prev => {

            if (prev.product.some(item => item.productId === productId)) {
                return prev;
            }

            return {
                ...prev,
                product: [
                    ...prev.product,
                    {
                        productId: product.id,
                        name: product.name,
                        skuCode: product.skuCode,
                        weight: 0,
                        pricePerKg: 0,
                        color: "",
                        size: "",
                    },
                ],
            };
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
        >
            <motion.div
                initial={{ scale: 0.95, y: 16 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 16 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col "
            >
                <div className="  rounded-xl p-2 md:p-3 " >
                    <div className="max-w-f mx-auto">
                        {/* Masthead */}
                        <div className="flex items-start justify-between pb-1 mb-2">
                            <div>
                                <div className="text-xs font-semibold tracking-widest uppercase  mb-2">{eyebrow}</div>
                                <h1 className="text-3xl font-semibold ">{title}</h1>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 overflow-y-auto max-h-[calc(90vh-120px)]">

                            <div className="space-y-2">
                                <div className="border border-[#004080] rounded-lg p-2">
                                    {sectionLabel(Package, "Product")}

                                    <div className="grid grid-cols-3 gap-4">
                                        <CustomSelect
                                            label="Add Product"
                                            options={options.products}
                                            value=""
                                            onChange={handleProductSelect}
                                            placeholder="Search and add product..."
                                        // toggleAll={{
                                        //     label: options.products.length > 0 && options.products.every(p => formData.items.some(i => i.productId === p.id))
                                        //         ? 'Unselect All Products' : 'Select All Products',
                                        //     onClick: handleToggleAllProducts
                                        // }}
                                        />
                                        <InputBox title="SKU code" inputFor="sku" value={productForm.sku} handleChangeFunction={handleField} placeholder="-" />
                                        <InputBox title="Image URL" inputFor="imgUrl" value={productForm.imgUrl} handleChangeFunction={handleField} placeholder="https://..." />
                                    </div>

                                </div>

                                <div className=" border border-[#004080] rounded-lg p-2">
                                    {sectionLabel(Scissors, "Texture")}
                                    <div className="grid grid-cols-3 gap-4">
                                        {textures.map((t) => {
                                            const active = t.id === textureId;
                                            return (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() => selectTexture(t)}
                                                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-left transition
                        ${active ? "border-[#004080]" : "border-[#003366]  hover:border-[#003366]"}`}
                                                >
                                                    <div>
                                                        <div className="text-sm">{t.name}</div>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${active ? " bg-[#003366]" : "border-[#004080]"}`}>
                                                        {active && <Check size={12} />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className=" border border-[#003366] rounded-lg p-2 grid grid-cols-3">
                                    <div className="col-span-full">  {sectionLabel(Palette, "Shade & Length")}</div>


                                    <div className=" grid grid-cols-3">
                                        <div className="text-xs mb-3 col-span-full">Tap to select one or more shades</div>
                                        {shades.map((s) => {
                                            const active = selectedShades.has(s.name);
                                            return (
                                                <button
                                                    key={s.name}
                                                    type="button"
                                                    onClick={() => toggleShade(s.name)}
                                                    className="w-15 p-2 text-center relative group"
                                                >
                                                    <span
                                                        className={`block w-9 h-9 mx-auto rounded-full border-2 mb-1 ${active ? "border-[#003366]" : "border-transparent"}`}
                                                        style={{ background: s.hex }}
                                                    />
                                                    {active && (
                                                        <span className="absolute -top-0 right-1  rounded-full bg-[#004080] flex items-center justify-center">
                                                            <Check size={8} strokeWidth={3} className="text-white" />
                                                        </span>
                                                    )}
                                                    <span className={`block truncate text-[10px] ${active ? "text-[#004080]" : "text-[#003366]"}`}>{s.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className=" gap-2 mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Ruler size={13} />
                                            <span className="text-xs ">Select one or more lengths</span>
                                        </div>
                                        {lengths.map((len) => {
                                            const key = String(len);
                                            const active = selectedLengths.has(key);
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => toggleLength(key)}
                                                    className={`px-3 py-1.5 rounded-md border text-sm transition
                        ${active ? "border-[#004080] bg-[#003366] text-white" : "text-[#003366] hover:border-white"}`}
                                                >
                                                    {len}"
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div>
                                        <InputBox
                                            title="Weight per bundle "
                                            inputFor="weight"
                                            type="number"
                                            value={productForm.weight}
                                            handleChangeFunction={handleField}
                                        />
                                        <CustomSelect
                                            label="Weight unit"
                                            placeholder="-"
                                            options={[
                                                { id: "g", name: "g" },
                                                { id: "kg", name: "kg" },
                                            ]}
                                            value={productForm.name}
                                            // onChange={setField("paymentterm")}
                                            onChange={handleField}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: ledger */}
                            <div>
                                <div className=" border border-[#004080] rounded-lg p-2">
                                    <div className="flex items-center justify-between mb-2 pb-1">
                                        <div className="flex items-center gap-2">
                                            <Receipt size={14} />
                                            <span className="text-xs font-semibold tracking-widest uppercase text-[#004080]">Variants</span>
                                        </div>
                                        <span className="text-xs ">{lines.length} {lines.length === 1 ? "line" : "lines"}</span>
                                    </div>

                                    <div className="flex justify-between text-sm py-2 border-b border-dashed border-[#004080] ">
                                        <span>Product</span>
                                        <span className=" font-medium">{productForm.name || texture.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2 border-b border-dashed border-[#004080]  mb-2">
                                        <span>Weight</span>
                                        <span className=" font-medium">{productForm.weight} / bundle</span>
                                    </div>

                                    <div className="max-h-62 overflow-y-auto space-y-3 py-3">
                                        {lines.length === 0 && (
                                            <div className="text-center text-sm  py-6">Select at least one shade and one length to build line items.</div>
                                        )}
                                        {lines.map((l) => {
                                            const safeId = l.key.replace(/[^a-zA-Z0-9]/g, "-");
                                            return (
                                                <div key={l.key} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 items-center pb-3 border-b border-[#003366]">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm  truncate">{l.shade}</div>
                                                        <div className="text-xs">{l.length}" · {productForm.weight}</div>
                                                    </div>

                                                    <InputBox
                                                        inputFor={`qty-${safeId}`}
                                                        type="number"
                                                        value={l.qty}
                                                        handleChangeFunction={(e) => setVariant(l.key, { qty: e.target.value })}
                                                    />

                                                    <InputBox
                                                        inputFor={`price-${safeId}`}
                                                        type="number"
                                                        isDecimalAllowed
                                                        isSufixOrPrefix="prefix"
                                                        measure="$"
                                                        value={l.price}
                                                        handleChangeFunction={(e) => setVariant(l.key, { price: e.target.value })}
                                                    />

                                                    <div className="w-16 text-right text-sm font-semibold text-[#003366] flex-shrink-0">{fmt(l.subtotal)}</div>

                                                    <button
                                                        className="flex items-center justify-center p-2 rounded-md text-red-500 hover:bg-red-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-[#003366]">
                                        <span className="text-xs uppercase tracking-widest ">Total due</span>
                                        <span className="text-3xl font-semibold">{fmt(total)}</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAdd}
                                        disabled={lines.length === 0}
                                        className="w-full mt-2 py-3 text-white rounded-md bg-[#003366] hover:bg-[#004080] disabled:opacity-40 disabled:cursor-not-allowed text-amber-950 font-semibold text-sm tracking-wide uppercase transition"
                                    >
                                        Add all to invoice
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}


export default function Demo() {
    const [invoiceLog, setInvoiceLog] = useState([]);

    const handleAdd = (label) => (payload) => {

        console.log("wevfevergv", label, payload);

        setInvoiceLog((prev) => [{ label, payload, id: Date.now() }, ...prev].slice(0, 5));
    };

    return (
        <div className="flex flex-col gap-6 bg-black p-6 rounded-2xl">
            <AddProductForm eyebrow="DC Shairs International — Ledger" title="Add Product" startingEntryNo={148} onAddToInvoice={handleAdd("Catalogue entry")} />
            <AddProductForm eyebrow="Reorder Desk — Quick Add" title="Reorder Product" sourceLabel="Warehouse — Bengaluru, IN" startingEntryNo={412} defaultWeight={50} onAddToInvoice={handleAdd("Reorder desk")} />

            {invoiceLog.length > 0 && (
                <div className="max-w-5xl mx-auto w-full text-amber-200 text-sm bg-amber-950 border border-amber-800 rounded-lg p-4">
                    <div className="text-yellow-500 mb-2 tracking-widest text-xs uppercase">handleAdd payloads received</div>
                    {invoiceLog.map((entry) => (
                        <div key={entry.id} className="py-1 border-b border-amber-900 last:border-0">
                            <div className="flex justify-between">
                                <span>{entry.label} — {entry.payload.product.name} ({entry.payload.variants.length} lines)</span>
                                <span className="text-amber-50 font-semibold">{fmt(entry.payload.total)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}