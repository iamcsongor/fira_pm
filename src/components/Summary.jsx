/* Fira PM — summary view: projects grouped by team (matches wireframe) */
import React from "react";
import * as PM from "../data.js";
import { Ic, RoiBar } from "./bits.jsx";

export function SummaryView({ data, onOpen, onAdd, onAddSample, onClear }) {
  const projects = data.projects || [];
  const maxRoi = Math.max(1, ...projects.map((p) => Number(p.roi) || 0));

  if (!projects.length) {
    return (
      <div className="scroll">
        <div className="summary-wrap">
          <div className="empty-state">
            <h2>No projects yet</h2>
            <p>This is your blank board. Add projects across your six ops teams, then open any one to get a slide-ready summary card.</p>
            <div className="row">
              <button className="btn primary" onClick={() => onAdd()}><Ic.plus />Add project</button>
              <button className="btn" onClick={onAddSample}>Load sample projects</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll">
      <div className="summary-wrap">
        <div className="summary-head">
          <h1>Portfolio summary</h1>
          <span className="meta">{projects.length} project{projects.length !== 1 ? "s" : ""} · {PM.TEAMS.filter(t => projects.some(p => p.team === t.key)).length} teams active</span>
          <span className="spacer" />
          <button className="btn ghost sm" onClick={onClear}>Clear all</button>
          <button className="btn primary" onClick={() => onAdd()}><Ic.plus />Add project</button>
        </div>

        <div className="tbl">
          <div className="tcols thead">
            <div className="th-team" />
            <div>Project</div>
            <div>Objective</div>
            <div>ROI (£)</div>
            <div>Status</div>
          </div>

          {PM.TEAMS.map((team) => {
            const rows = projects.filter((p) => p.team === team.key);
            const span = Math.max(1, rows.length);
            return (
              <div className="tcols team-block" key={team.key}>
                <div className="team-rail" style={{ background: team.color, gridRow: `1 / ${span + 1}` }}>
                  <span>{team.short}</span>
                </div>

                {rows.length === 0 ? (
                  <div className="team-empty">
                    No projects in {team.name}.
                    <button className="btn ghost sm" onClick={() => onAdd(team.key)}><Ic.plus />Add</button>
                  </div>
                ) : rows.map((p) => (
                  <div className="trow" key={p.id} onClick={() => onOpen(p.id)}>
                    <div className="cell-proj">
                      <div className="pname">{p.name || "Untitled project"}</div>
                      {p.subtitle && <div className="psub">{p.subtitle}</div>}
                    </div>
                    <div className="cell-obj"><div className="clamp">{p.objective || p.purpose || <span style={{ color: "var(--muted-2)" }}>—</span>}</div></div>
                    <div className="roi-cell"><RoiBar value={Number(p.roi) || 0} max={maxRoi} /></div>
                    <div className="cell-status"><StatusPill status={p.status} /></div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* condensed summary as a 1280x720 slide for present / export */
export function SummarySlide({ data }) {
  const projects = data.projects || [];
  const maxRoi = Math.max(1, ...projects.map((p) => Number(p.roi) || 0));
  const active = PM.TEAMS.filter((t) => projects.some((p) => p.team === t.key));
  return (
    <div className="dcard sslide" style={{ padding: "38px 46px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 20 }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.025em" }}>Portfolio summary</div>
        <div style={{ color: "var(--muted)", fontSize: 15 }}>{projects.length} projects across {active.length} teams</div>
      </div>
      <div className="tbl" style={{ flex: 1, minHeight: 0 }}>
        <div className="tcols thead">
          <div className="th-team" /><div>Project</div><div>Objective</div><div>ROI (£)</div><div>Status</div>
        </div>
        {active.map((team) => {
          const rows = projects.filter((p) => p.team === team.key);
          return (
            <div className="tcols team-block" key={team.key}>
              <div className="team-rail" style={{ background: team.color, gridRow: `1 / ${rows.length + 1}` }}><span>{team.short}</span></div>
              {rows.map((p) => (
                <div className="trow" key={p.id} style={{ cursor: "default" }}>
                  <div className="cell-proj"><div className="pname">{p.name || "Untitled"}</div>{p.subtitle && <div className="psub">{p.subtitle}</div>}</div>
                  <div className="cell-obj"><div className="clamp">{p.objective || p.purpose || "—"}</div></div>
                  <div className="roi-cell"><RoiBar value={Number(p.roi) || 0} max={maxRoi} /></div>
                  <div className="cell-status"><StatusPill status={p.status} /></div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StatusPill({ status }) {
  const s = PM.STATUS[status] || PM.STATUS.ontrack;
  return (
    <span className="status-pill" style={{ color: s.color }}>
      <span className="dot" style={{ background: s.color, color: s.color }} />
      <span style={{ color: "var(--ink)" }}>{s.label}</span>
    </span>
  );
}
