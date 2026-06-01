/* Fira PM — detail card / slide, 3 switchable layouts (A wireframe, B report, C board) */
import React from "react";
import * as PM from "../data.js";
import { Ic, StatusBadge, RoiBar, Avatar, Milestones } from "./bits.jsx";

export function Panel({ label, icon, tint, children, className, style, clamp }) {
  const Icon = icon ? Ic[icon] : null;
  return (
    <div className={"panel" + (tint ? " tint-" + tint : "") + (className ? " " + className : "")} style={style}>
      {label && <div className="panel-label">{Icon && <Icon />}{label}</div>}
      <div className="panel-body" style={clamp ? { WebkitLineClamp: clamp, display: "-webkit-box", WebkitBoxOrient: "vertical" } : null}>
        {children}
      </div>
    </div>
  );
}

function Txt({ value, placeholder }) {
  if (value && String(value).trim()) return <span>{value}</span>;
  return <span className="placeholder-line">{placeholder}</span>;
}

function WeeklyBlock({ project, big }) {
  const w = project.weekly || {};
  return (
    <React.Fragment>
      <div className="weekly-week"><span className="pip" />{w.week || "Latest update"}</div>
      <div className="weekly-text" style={big ? { fontSize: 18 } : null}>
        <Txt value={w.text} placeholder="No update logged this week." />
      </div>
    </React.Fragment>
  );
}

function EtaChip({ project }) {
  return (
    <div className="eta-chip">
      <div className="ic"><Ic.cal /></div>
      <div>
        <div className="d">{PM.fmtDate(project.eta)}</div>
        {project.eta && <div className="r">{PM.etaRelative(project.eta)}</div>}
      </div>
    </div>
  );
}

function OwnerLinks({ project, variant }) {
  return (
    <div className="metalist">
      <div className="meta-row">
        <span className="mk"><Ic.user />Owner</span>
        <span className="mv"><Avatar name={project.owner} size={24} /><Txt value={project.owner} placeholder="Unassigned" /></span>
      </div>
      <div className="meta-row">
        <span className="mk"><Ic.hash />Slack</span>
        <span className="mv">
          {project.slackUrl
            ? <a className="slacklink" href={project.slackUrl} target="_blank" rel="noreferrer">{project.slackChannel || project.slackUrl}</a>
            : <span className="slacklink" style={{ color: "var(--muted)" }}><Txt value={project.slackChannel} placeholder="No channel" /></span>}
        </span>
      </div>
      {variant !== "compact" && (
        <div className="meta-row">
          <span className="mk"><Ic.link />URL</span>
          <span className="mv"><span className="urlline"><Txt value={project.slackUrl} placeholder="—" /></span></span>
        </div>
      )}
    </div>
  );
}

/* ---------------- Layout A : wireframe-faithful ---------------- */
function LayoutA({ project, team }) {
  return (
    <div className="dcard v-A">
      <div className="grid">
        <div className="a-head">
          <div className="team-tag" style={{ marginBottom: 12 }}><span className="swatch" style={{ background: team.color }} />{team.name}</div>
          <div className="id-name">{project.name || "Untitled project"}</div>
          <div className="id-sub"><Txt value={project.subtitle} placeholder="Add a subtitle" /></div>
        </div>
        <Panel className="a-meta" label="Ownership" icon="user"><OwnerLinks project={project} /></Panel>
        <Panel className="a-purpose" label="Business Purpose" icon="target" clamp={5}>
          <Txt value={project.purpose} placeholder="Why this project matters to the business." />
        </Panel>
        <div className="a-etastat">
          <Panel label="ETA" icon="cal"><EtaChip project={project} /></Panel>
          <Panel label="Status" icon="flag" className="statpanel"><StatusBadge status={project.status} size="lg" /></Panel>
        </div>
        <Panel className="a-roadmap" label="Roadmap / Milestones" icon="target"><Milestones items={project.roadmap} /></Panel>
        <Panel className="a-weekly" label="Weekly Update" icon="flag" tint="weekly"><WeeklyBlock project={project} /></Panel>
        <Panel className="a-deps" label="Dependencies / Blockers" icon="flag" tint="deps" clamp={3}>
          <Txt value={project.dependencies} placeholder="No known blockers." />
        </Panel>
        <Panel className="a-final" label="Final Product" icon="box" tint="final" clamp={3}>
          <Txt value={project.finalProduct} placeholder="The deliverable this project ships." />
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- Layout B : report w/ sidebar ---------------- */
function LayoutB({ project, team, max }) {
  return (
    <div className="dcard v-B">
      <aside className="side">
        <div>
          <div className="team-tag" style={{ marginBottom: 14 }}><span className="swatch" style={{ background: team.color }} />{team.name}</div>
          <div className="id-name">{project.name || "Untitled project"}</div>
          <div className="id-sub"><Txt value={project.subtitle} placeholder="Add a subtitle" /></div>
        </div>
        <div className="side-status">
          <div className="side-block"><div className="panel-label"><Ic.flag />Status</div><StatusBadge status={project.status} size="lg" /></div>
          <div className="side-block"><div className="panel-label"><Ic.cal />ETA</div><EtaChip project={project} /></div>
          <div className="side-block">
            <div className="panel-label"><Ic.target />Expected ROI</div>
            <div className="roi-big">{PM.fmtGBP(project.roi)}</div>
            <div style={{ marginTop: 8 }}><RoiBar value={project.roi} max={max} showVal={false} /></div>
          </div>
        </div>
        <div className="side-block" style={{ marginTop: "auto" }}>
          <div className="panel-label"><Ic.user />Ownership</div>
          <OwnerLinks project={project} />
        </div>
      </aside>
      <div className="main">
        <Panel className="b-purpose" label="Business Purpose" icon="target" clamp={4}>
          <Txt value={project.purpose} placeholder="Why this project matters to the business." />
        </Panel>
        <Panel className="b-roadmap" label="Roadmap / Milestones" icon="target"><Milestones items={project.roadmap} /></Panel>
        <Panel className="b-weekly" label="Weekly Update" icon="flag" tint="weekly"><WeeklyBlock project={project} big /></Panel>
        <Panel className="b-deps" label="Dependencies / Blockers" icon="flag" tint="deps" clamp={2}>
          <Txt value={project.dependencies} placeholder="No known blockers." />
        </Panel>
        <Panel className="b-final" label="Final Product" icon="box" tint="final" clamp={2}>
          <Txt value={project.finalProduct} placeholder="The deliverable this project ships." />
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- Layout C : board card ---------------- */
function LayoutC({ project, team }) {
  const s = PM.STATUS[project.status] || PM.STATUS.ontrack;
  return (
    <div className="dcard v-C" style={{ "--band-color": s.color }}>
      <div className="band" style={{ background: s.tint }}>
        <div className="band-top">
          <div style={{ minWidth: 0 }}>
            <div className="team-tag" style={{ marginBottom: 10 }}><span className="swatch" style={{ background: team.color }} />{team.name}</div>
            <div className="id-name">{project.name || "Untitled project"}</div>
            <div className="id-sub"><Txt value={project.subtitle} placeholder="Add a subtitle" /></div>
          </div>
          <div className="spacer" />
          <StatusBadge status={project.status} size="lg" />
        </div>
        <div className="chiprow">
          <div className="chip-meta"><Ic.cal /><span>ETA&nbsp; <b>{PM.fmtDate(project.eta)}</b> {project.eta && <span style={{ color: "var(--muted)" }}>· {PM.etaRelative(project.eta)}</span>}</span></div>
          <div className="chip-meta"><Ic.target /><span>ROI&nbsp; <b className="roi-inline">{PM.fmtGBP(project.roi)}</b></span></div>
          <div className="chip-meta"><Ic.user /><Avatar name={project.owner} size={22} /><b>{project.owner || "Unassigned"}</b></div>
          <div className="chip-meta"><Ic.hash />
            {project.slackUrl
              ? <a className="slacklink" href={project.slackUrl} target="_blank" rel="noreferrer">{project.slackChannel || "slack"}</a>
              : <span className="slacklink" style={{ color: "var(--muted)" }}>{project.slackChannel || "No channel"}</span>}
          </div>
        </div>
      </div>
      <div className="cbody">
        <Panel className="c-purpose" label="Business Purpose" icon="target" clamp={3}>
          <Txt value={project.purpose} placeholder="Why this project matters to the business." />
        </Panel>
        <Panel className="c-roadmap" label="Roadmap / Milestones" icon="target"><Milestones items={project.roadmap} /></Panel>
        <Panel className="c-weekly" label="Weekly Update" icon="flag" tint="weekly"><WeeklyBlock project={project} big /></Panel>
        <Panel className="c-deps" label="Dependencies / Blockers" icon="flag" tint="deps" clamp={2}>
          <Txt value={project.dependencies} placeholder="No known blockers." />
        </Panel>
        <Panel className="c-final" label="Final Product" icon="box" tint="final" clamp={2}>
          <Txt value={project.finalProduct} placeholder="The deliverable this project ships." />
        </Panel>
      </div>
    </div>
  );
}

export function DetailCard({ project, variant, max }) {
  const team = PM.teamOf(project.team);
  if (variant === "B") return <LayoutB project={project} team={team} max={max} />;
  if (variant === "C") return <LayoutC project={project} team={team} max={max} />;
  return <LayoutA project={project} team={team} max={max} />;
}
