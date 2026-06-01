/* Fira PM — add / edit project modal */
import React, { useState } from "react";
import * as PM from "../data.js";
import { Ic } from "./bits.jsx";

export function Editor({ initial, onSave, onCancel, onDelete }) {
  const [p, setP] = useState(() => JSON.parse(JSON.stringify(initial)));
  const set = (k, v) => setP((prev) => ({ ...prev, [k]: v }));
  const setWeekly = (k, v) => setP((prev) => ({ ...prev, weekly: { ...(prev.weekly || {}), [k]: v } }));

  const roadmap = p.roadmap || [];
  const setMs = (i, k, v) => set("roadmap", roadmap.map((m, j) => (j === i ? { ...m, [k]: v } : m)));
  const addMs = () => set("roadmap", [...roadmap, { label: "", date: "", done: false }]);
  const delMs = (i) => set("roadmap", roadmap.filter((_, j) => j !== i));

  const isNew = !initial.name;

  return (
    <div className="scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>{isNew ? "New project" : "Edit project"}</h2>
          <span className="spacer" />
          <button className="iconbtn" onClick={onCancel} aria-label="Close"><Ic.x /></button>
        </div>

        <div className="modal-body">
          <div className="fgrid">
            <div className="field">
              <label>Team</label>
              <select className="select" value={p.team} onChange={(e) => set("team", e.target.value)}>
                {PM.TEAMS.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <div className="status-choose">
                {PM.STATUS_ORDER.map((k) => {
                  const s = PM.STATUS[k];
                  return (
                    <button key={k} className={p.status === k ? "on" : ""} style={{ color: p.status === k ? s.color : undefined }} onClick={() => set("status", k)}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />{s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="field">
              <label>Project name</label>
              <input className="input" value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Unified Support Inbox" />
            </div>
            <div className="field">
              <label>Subtitle</label>
              <input className="input" value={p.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="One-line description" />
            </div>

            <div className="field full">
              <label>Objective <span className="hint">shown in the summary table</span></label>
              <textarea className="textarea" style={{ minHeight: 52 }} value={p.objective} onChange={(e) => set("objective", e.target.value)} placeholder="The headline outcome this project drives." />
            </div>

            <div className="field full">
              <label>Business purpose <span className="hint">why it matters</span></label>
              <textarea className="textarea" value={p.purpose} onChange={(e) => set("purpose", e.target.value)} placeholder="The business case in 2–4 sentences." />
            </div>

            <div className="field">
              <label>ETA</label>
              <input className="input mono" type="date" value={p.eta} onChange={(e) => set("eta", e.target.value)} />
            </div>
            <div className="field">
              <label>Expected ROI (£)</label>
              <input className="input mono" type="number" min="0" step="1000" value={p.roi} onChange={(e) => set("roi", Number(e.target.value))} placeholder="0" />
            </div>

            <div className="field full">
              <label>Roadmap / milestones</label>
              <div className="ms-list">
                {roadmap.map((m, i) => (
                  <div className="ms-item" key={i}>
                    <button className={"ms-check" + (m.done ? " done" : "")} onClick={() => setMs(i, "done", !m.done)} title="Toggle done">{m.done && <Ic.check />}</button>
                    <input className="input" value={m.label} onChange={(e) => setMs(i, "label", e.target.value)} placeholder="Milestone" />
                    <input className="input date mono" type="date" value={m.date || ""} onChange={(e) => setMs(i, "date", e.target.value)} />
                    <button className="iconbtn" onClick={() => delMs(i)} aria-label="Remove"><Ic.trash /></button>
                  </div>
                ))}
                <button className="btn sm" style={{ alignSelf: "flex-start" }} onClick={addMs}><Ic.plus />Add milestone</button>
              </div>
            </div>

            <div className="field full">
              <label>Dependencies / blockers</label>
              <textarea className="textarea" style={{ minHeight: 52 }} value={p.dependencies} onChange={(e) => set("dependencies", e.target.value)} placeholder="What this project is waiting on." />
            </div>

            <div className="field">
              <label>Weekly update — week <span className="hint">label</span></label>
              <input className="input" value={(p.weekly || {}).week || ""} onChange={(e) => setWeekly("week", e.target.value)} placeholder="e.g. Week of 26 May 2026" />
            </div>
            <div className="field">
              <label>Final product</label>
              <input className="input" value={p.finalProduct} onChange={(e) => set("finalProduct", e.target.value)} placeholder="The deliverable that ships" />
            </div>
            <div className="field full">
              <label>Weekly update — this week</label>
              <textarea className="textarea" value={(p.weekly || {}).text || ""} onChange={(e) => setWeekly("text", e.target.value)} placeholder="The single most important update this week." />
            </div>

            <div className="field">
              <label>Final product owner</label>
              <input className="input" value={p.owner} onChange={(e) => set("owner", e.target.value)} placeholder="Full name" />
            </div>
            <div className="field">
              <label>Slack channel</label>
              <input className="input mono" value={p.slackChannel} onChange={(e) => set("slackChannel", e.target.value)} placeholder="#proj-name" />
            </div>
            <div className="field full">
              <label>Slack channel URL</label>
              <input className="input mono" value={p.slackUrl} onChange={(e) => set("slackUrl", e.target.value)} placeholder="https://app.slack.com/..." />
            </div>
          </div>
        </div>

        <div className="modal-foot">
          {!isNew && onDelete && <button className="btn danger" onClick={onDelete}><Ic.trash />Delete</button>}
          <span className="spacer" />
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn primary" onClick={() => onSave(p)}><Ic.check />Save project</button>
        </div>
      </div>
    </div>
  );
}
