/* Fira PM — app root: routing, toolbar, detail host, present mode */
import React, { useState, useEffect } from "react";
import * as PM from "./data.js";
import { Ic, SlideStage } from "./components/bits.jsx";
import { SummaryView, SummarySlide } from "./components/Summary.jsx";
import { DetailCard } from "./components/Detail.jsx";
import { Editor } from "./components/Editor.jsx";

const LAYOUTS = [
  { key: "A", label: "Brief" },
  { key: "B", label: "Report" },
  { key: "C", label: "Board" },
];

export default function App() {
  const [data, setData] = useState(() => PM.loadData());
  const [route, setRoute] = useState({ view: "summary", id: null }); // view: summary | detail
  const [layout, setLayout] = useState(() => localStorage.getItem("fira_layout") || "A");
  const [editing, setEditing] = useState(null); // project object being edited, or null
  const [present, setPresent] = useState(null); // {index} or null
  const [toast, setToast] = useState("");

  useEffect(() => { PM.saveData(data); }, [data]);
  useEffect(() => { localStorage.setItem("fira_layout", layout); }, [layout]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 1900); return () => clearTimeout(t); }, [toast]);

  const projects = data.projects || [];
  const maxRoi = Math.max(1, ...projects.map((p) => Number(p.roi) || 0));
  const current = projects.find((p) => p.id === route.id) || null;
  const curIndex = current ? projects.indexOf(current) : -1;

  /* ---- mutations ---- */
  const upsert = (proj) => {
    setData((d) => {
      const exists = d.projects.some((p) => p.id === proj.id);
      return { ...d, projects: exists ? d.projects.map((p) => (p.id === proj.id ? { ...proj, updated: Date.now() } : p)) : [...d.projects, { ...proj, updated: Date.now() }] };
    });
    setEditing(null);
    setToast(projects.some((p) => p.id === proj.id) ? "Project updated" : "Project added");
    if (!projects.some((p) => p.id === proj.id)) setRoute({ view: "detail", id: proj.id });
  };
  const remove = (id) => {
    setData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));
    setEditing(null);
    setRoute({ view: "summary", id: null });
    setToast("Project deleted");
  };
  const openNew = (team) => setEditing(PM.blankProject(team));
  const openEdit = (proj) => setEditing(proj);

  /* ---- present nav ---- */
  const slideCount = projects.length + 1; // summary + each project
  useEffect(() => {
    if (!present) return;
    const onKey = (e) => {
      if (e.key === "Escape") setPresent(null);
      else if (e.key === "ArrowRight" || e.key === " ") setPresent((p) => ({ index: Math.min(slideCount - 1, p.index + 1) }));
      else if (e.key === "ArrowLeft") setPresent((p) => ({ index: Math.max(0, p.index - 1) }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [present, slideCount]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="mark">F</span>
          Fira PM <span className="sub">ops portfolio</span>
        </div>

        {route.view === "detail" && current && (
          <div className="crumb">
            <button className="btn ghost sm" onClick={() => setRoute({ view: "summary", id: null })}><Ic.back />Summary</button>
            <span style={{ color: "var(--line-strong)" }}>/</span>
            <b>{current.name || "Untitled project"}</b>
          </div>
        )}

        <span className="spacer" />

        {route.view === "summary" && projects.length > 0 && (
          <React.Fragment>
            <button className="btn" onClick={() => setPresent({ index: 0 })}><Ic.present />Present</button>
            <button className="btn primary" onClick={() => openNew()}><Ic.plus />Add project</button>
          </React.Fragment>
        )}
      </header>

      {route.view === "summary" ? (
        <SummaryView
          data={data}
          onOpen={(id) => setRoute({ view: "detail", id })}
          onAdd={openNew}
          onAddSample={() => { setData(PM.sampleData()); setToast("Sample projects loaded"); }}
          onClear={() => { if (confirm("Remove all projects? This can't be undone.")) { setData({ projects: [] }); setToast("Board cleared"); } }}
        />
      ) : current ? (
        <DetailHost
          project={current}
          layout={layout} setLayout={setLayout}
          maxRoi={maxRoi}
          index={curIndex} total={projects.length}
          onNav={(dir) => { const ni = curIndex + dir; if (ni >= 0 && ni < projects.length) setRoute({ view: "detail", id: projects[ni].id }); }}
          onEdit={() => openEdit(current)}
          onPresent={() => setPresent({ index: curIndex + 1 })}
        />
      ) : (
        <div className="scroll"><div className="empty-state"><h2>Project not found</h2></div></div>
      )}

      {editing && (
        <Editor
          initial={editing}
          onSave={upsert}
          onCancel={() => setEditing(null)}
          onDelete={() => { if (confirm("Delete this project?")) remove(editing.id); }}
        />
      )}

      {present && (
        <PresentMode
          data={data} projects={projects} maxRoi={maxRoi} layout={layout}
          index={present.index} setIndex={(i) => setPresent({ index: i })}
          onClose={() => setPresent(null)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ---------------- detail host ---------------- */
function DetailHost({ project, layout, setLayout, maxRoi, index, total, onNav, onEdit, onPresent }) {
  return (
    <div className="app" style={{ flex: 1, minHeight: 0 }}>
      <div className="detail-bar">
        <div className="seg">
          {LAYOUTS.map((l) => (
            <button key={l.key} className={layout === l.key ? "on" : ""} onClick={() => setLayout(l.key)}>{l.label}</button>
          ))}
        </div>
        <span style={{ color: "var(--muted-2)", fontSize: 12 }}>Detail layout</span>
        <span className="spacer" />
        <span style={{ color: "var(--muted)", fontSize: 12.5, fontFamily: "var(--mono)" }}>{index + 1} / {total}</span>
        <button className="iconbtn" onClick={() => onNav(-1)} disabled={index <= 0} aria-label="Previous"><Ic.back /></button>
        <button className="iconbtn" onClick={() => onNav(1)} disabled={index >= total - 1} aria-label="Next"><Ic.fwd /></button>
        <button className="btn sm" onClick={onPresent}><Ic.present />Present</button>
        <button className="btn primary sm" onClick={onEdit}><Ic.edit />Edit</button>
      </div>
      <div className="detail-host">
        <SlideStage key={layout + project.id}>
          <DetailCard project={project} variant={layout} max={maxRoi} />
        </SlideStage>
      </div>
    </div>
  );
}

/* ---------------- present mode ---------------- */
function PresentMode({ data, projects, maxRoi, layout, index, setIndex, onClose }) {
  const total = projects.length + 1;
  const isSummary = index === 0;
  const proj = isSummary ? null : projects[index - 1];
  return (
    <div className="present">
      <button className="btn pbtn closex" onClick={onClose} aria-label="Close"><Ic.x /></button>
      <div className="pstage">
        <SlideStage key={index + layout} pad={70} framed={false}>
          {isSummary ? <SummarySlide data={data} /> : <DetailCard project={proj} variant={layout} max={maxRoi} />}
        </SlideStage>
      </div>
      <div className="present-bar">
        <div className="nav">
          <button className="pbtn" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index <= 0}><Ic.back /></button>
          <span className="counter">{index + 1} / {total}</span>
          <button className="pbtn" onClick={() => setIndex(Math.min(total - 1, index + 1))} disabled={index >= total - 1}><Ic.fwd /></button>
        </div>
        <span style={{ opacity: .7 }}>{isSummary ? "Portfolio summary" : (proj.name || "Untitled")}</span>
      </div>
    </div>
  );
}
