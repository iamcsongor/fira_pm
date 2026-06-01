/* Fira PM — shared bits: icons, badges, ROI bar, milestones, slide scaler */
import React, { useState, useRef, useLayoutEffect } from "react";
import * as PM from "../data.js";

/* ---------- icons (simple strokes) ---------- */
export const Ic = {
  plus:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  back:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6"/></svg>,
  fwd:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>,
  edit:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>,
  trash:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>,
  present: (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4M8 21h8"/></svg>,
  check:   (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  x:       (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  cal:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>,
  hash:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 3L7 21M17 3l-2 18M4 8.5h16M3 15.5h16"/></svg>,
  link:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></svg>,
  user:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>,
  flag:    (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></svg>,
  target:  (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...p}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/></svg>,
  box:     (p) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/></svg>,
  more:    (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>,
};

/* ---------- status badge ---------- */
export function StatusBadge({ status, size }) {
  const s = PM.STATUS[status] || PM.STATUS.ontrack;
  const big = size === "lg";
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap: big?9:7,
      fontWeight:600, color:"var(--ink)", fontSize: big?14:12.5, whiteSpace:"nowrap",
      background:s.tint, padding: big?"6px 13px":"4px 10px", borderRadius:99,
    }}>
      <span style={{ width:big?11:9, height:big?11:9, borderRadius:"50%", background:s.color,
        boxShadow:"0 0 0 3px color-mix(in oklch, "+s.color+" 22%, transparent)" }} />
      {s.label}
    </span>
  );
}

/* ---------- ROI bar ---------- */
export function RoiBar({ value, max, showVal=true }) {
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return (
    <React.Fragment>
      {showVal && <div className="roi-val">{PM.fmtGBP(value)}</div>}
      <div className="roi-track"><div className="roi-fill" style={{ width: pct + "%" }} /></div>
    </React.Fragment>
  );
}

/* ---------- avatar ---------- */
export function Avatar({ name, size=26 }) {
  const initials = (name || "?").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase() || "?";
  return (
    <span style={{ width:size, height:size, borderRadius:"50%", flex:"0 0 auto",
      background:"var(--accent-tint)", color:"var(--accent-ink)", fontWeight:700,
      fontSize:size*0.4, display:"grid", placeItems:"center", letterSpacing:".02em" }}>{initials}</span>
  );
}

/* ---------- milestones (roadmap) ---------- */
export function Milestones({ items, compact }) {
  if (!items || !items.length) return <div className="placeholder-line">No milestones yet.</div>;
  return (
    <div className="ms-timeline">
      {items.map((m, i) => (
        <div key={i} className={"ms-row" + (m.done ? " done" : "")}>
          <div className="ms-node">
            <span className="ms-bullet">{m.done && <Ic.check />}</span>
            {i < items.length - 1 && <span className="ms-line" />}
          </div>
          <div className="ms-text">
            <div className="ms-label">{m.label || "Untitled milestone"}</div>
            {m.date && <div className="ms-date">{PM.fmtDateShort(m.date)}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- slide scaler: fits a fixed 1280x720 slide into its parent ---------- */
export function useFit(ref, base = { w: 1280, h: 720 }, pad = 0) {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const s = Math.min((r.width - pad) / base.w, (r.height - pad) / base.h);
      setScale(s > 0 ? s : 0.1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  return scale;
}

/* host for a single scaled slide */
export function SlideStage({ children, pad = 48, framed = true }) {
  const ref = useRef(null);
  const scale = useFit(ref, { w: 1280, h: 720 }, pad);
  return (
    <div ref={ref} className="stage">
      <div className={"slide" + (framed ? " slideframe" : "")} style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
