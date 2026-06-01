/* Fira PM — data layer (teams, statuses, storage, sample data) */

export const STORAGE_KEY = "fira_pm_v1";

export const TEAMS = [
  { key: "customer", name: "Customer Operations", short: "Customer Ops", color: "oklch(0.58 0.13 25)" },
  { key: "sales", name: "Sales Ops", short: "Sales Ops", color: "oklch(0.6 0.13 70)" },
  { key: "marketing", name: "Marketing Ops", short: "Marketing Ops", color: "oklch(0.56 0.14 330)" },
  { key: "ai", name: "AI Ops", short: "AI Ops", color: "oklch(0.55 0.14 285)" },
  { key: "business", name: "Business Ops", short: "Business Ops", color: "oklch(0.56 0.13 235)" },
  { key: "finance", name: "Finance Ops", short: "Finance Ops", color: "oklch(0.56 0.12 160)" },
];

export const STATUS = {
  done:    { key: "done",    label: "Done",     color: "var(--done)",    tint: "var(--done-tint)" },
  ontrack: { key: "ontrack", label: "On track", color: "var(--ontrack)", tint: "var(--ontrack-tint)" },
  risk:    { key: "risk",    label: "At risk",  color: "var(--risk)",    tint: "var(--risk-tint)" },
  blocked: { key: "blocked", label: "Blocked",  color: "var(--blocked)", tint: "var(--blocked-tint)" },
};
export const STATUS_ORDER = ["ontrack", "risk", "blocked", "done"];

export function teamOf(key) { return TEAMS.find((t) => t.key === key) || TEAMS[0]; }
export function uid() { return "p" + Math.random().toString(36).slice(2, 9); }

export function blankProject(team) {
  return {
    id: uid(),
    team: team || "customer",
    name: "",
    subtitle: "",
    objective: "",
    purpose: "",
    roadmap: [],            // [{label, date, done}]
    dependencies: "",
    eta: "",                // ISO date
    status: "ontrack",
    weekly: { week: "", text: "" },
    owner: "",
    slackChannel: "",
    slackUrl: "",
    roi: 0,                 // number, GBP
    finalProduct: "",
    updated: Date.now(),
  };
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { projects: [] };
}
export function saveData(d) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) {}
}

/* ---- formatting helpers ---- */
export function fmtGBP(n) {
  n = Number(n) || 0;
  if (n >= 1e6) return "£" + (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + "m";
  if (n >= 1e3) return "£" + Math.round(n / 1e3) + "k";
  return "£" + n.toLocaleString("en-GB");
}
export function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
export function fmtDateShort(iso) {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
export function etaRelative(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return "";
  const days = Math.round((d - new Date()) / 86400000);
  if (days < 0) return Math.abs(days) + "d overdue";
  if (days === 0) return "due today";
  if (days < 14) return "in " + days + "d";
  if (days < 70) return "in " + Math.round(days / 7) + "w";
  return "in " + Math.round(days / 30) + "mo";
}

/* ---- sample data ---- */
const SAMPLE = [
  {
    team: "customer", name: "Unified Support Inbox", subtitle: "One queue for email, chat & social",
    objective: "Cut first-response time by merging all support channels into a single triaged queue.",
    purpose: "Agents currently juggle four tools, causing missed SLAs and duplicate replies. A unified inbox with smart routing lets the team respond once, faster, and report consistently.",
    roadmap: [
      { label: "Channel audit & data model", date: "2026-03-15", done: true },
      { label: "Email + chat integration", date: "2026-04-30", done: true },
      { label: "Smart routing rules", date: "2026-06-10", done: false },
      { label: "Social channels + rollout", date: "2026-07-20", done: false },
    ],
    dependencies: "Awaiting API access from the legacy chat vendor (raised with Procurement). Routing rules depend on the new team taxonomy from People Ops.",
    eta: "2026-07-20", status: "ontrack",
    weekly: { week: "Week of 26 May 2026", text: "Email + chat merge is live for 40% of agents. Early data shows first-response time down 31%. Pushing routing rules to staging Thursday." },
    owner: "Priya Nair", slackChannel: "#proj-unified-inbox", slackUrl: "https://slack.com/app",
    roi: 220000, finalProduct: "A single triaged support queue with smart routing and unified SLA reporting.",
  },
  {
    team: "customer", name: "Self-Serve Returns Portal", subtitle: "Let customers resolve returns without an agent",
    objective: "Deflect 50% of returns tickets with a guided self-serve flow.",
    purpose: "Returns are the #1 ticket driver. A guided portal handles the routine cases so agents focus on complex issues.",
    roadmap: [
      { label: "Policy mapping", date: "2026-05-01", done: true },
      { label: "Flow build", date: "2026-06-30", done: false },
      { label: "Pilot", date: "2026-08-15", done: false },
    ],
    dependencies: "Needs label-printing API from Logistics. Blocked on legal sign-off for the new EU returns policy.",
    eta: "2026-08-15", status: "blocked",
    weekly: { week: "Week of 26 May 2026", text: "Still blocked on legal sign-off for EU policy — escalated to the GC. Build is ready to go the moment we're unblocked." },
    owner: "Tom Becker", slackChannel: "#proj-returns", slackUrl: "https://slack.com/app",
    roi: 95000, finalProduct: "A branded self-serve returns portal embedded in the help centre.",
  },
  {
    team: "sales", name: "Pipeline Health Dashboard", subtitle: "Live deal-stage hygiene for every AE",
    objective: "Give reps and managers a single live view of pipeline risk and stale deals.",
    purpose: "Forecasts slip because stale deals sit unnoticed. A live dashboard surfaces risk early so managers can coach before quarter-end.",
    roadmap: [
      { label: "CRM data contract", date: "2026-04-10", done: true },
      { label: "Risk scoring model", date: "2026-05-25", done: true },
      { label: "Manager rollout", date: "2026-06-20", done: false },
    ],
    dependencies: "Depends on the cleaned CRM stage definitions owned by RevOps.",
    eta: "2026-06-20", status: "risk",
    weekly: { week: "Week of 26 May 2026", text: "Risk model is validated but adoption is lagging — only 3 of 9 managers using it weekly. Running an enablement session next week to course-correct." },
    owner: "Dana Whitfield", slackChannel: "#proj-pipeline-health", slackUrl: "https://slack.com/app",
    roi: 340000, finalProduct: "A live pipeline-risk dashboard with weekly manager digests.",
  },
  {
    team: "marketing", name: "Campaign Attribution v2", subtitle: "Multi-touch attribution across paid & organic",
    objective: "Replace last-click reporting with a multi-touch model to reallocate spend.",
    purpose: "Last-click hides the value of upper-funnel work. Multi-touch attribution lets us defend and redirect budget with evidence.",
    roadmap: [
      { label: "Tracking audit", date: "2026-04-20", done: true },
      { label: "Model build", date: "2026-06-15", done: false },
      { label: "Spend reallocation", date: "2026-07-30", done: false },
    ],
    dependencies: "Requires consent-mode data from the Web team and the new warehouse tables from AI Ops.",
    eta: "2026-07-30", status: "ontrack",
    weekly: { week: "Week of 26 May 2026", text: "Tracking audit done; warehouse tables landed early. Model build started — first attribution cut expected in 10 days." },
    owner: "Marcus Lee", slackChannel: "#proj-attribution", slackUrl: "https://slack.com/app",
    roi: 180000, finalProduct: "A multi-touch attribution report feeding the quarterly budget review.",
  },
  {
    team: "ai", name: "Internal Knowledge Assistant", subtitle: "Grounded answers from company docs",
    objective: "Cut time spent searching internal docs with a grounded Q&A assistant.",
    purpose: "Staff lose hours hunting through wikis and decks. A grounded assistant answers from approved sources with citations, reducing repeat questions to specialists.",
    roadmap: [
      { label: "Source inventory & permissions", date: "2026-03-30", done: true },
      { label: "Retrieval pipeline", date: "2026-05-10", done: true },
      { label: "Eval harness & guardrails", date: "2026-06-25", done: false },
      { label: "Company-wide launch", date: "2026-08-01", done: false },
    ],
    dependencies: "Permissions model depends on the SSO group cleanup from Business Ops.",
    eta: "2026-08-01", status: "ontrack",
    weekly: { week: "Week of 26 May 2026", text: "Retrieval quality at 88% on the eval set. Guardrails for sensitive HR content in review with Legal. On track for the August launch." },
    owner: "Aisha Rahman", slackChannel: "#proj-knowledge-ai", slackUrl: "https://slack.com/app",
    roi: 410000, finalProduct: "A grounded internal assistant with cited answers, in Slack and the intranet.",
  },
  {
    team: "business", name: "SSO & Access Cleanup", subtitle: "One identity, least-privilege everywhere",
    objective: "Consolidate logins under SSO and remove stale access.",
    purpose: "Fragmented logins are a security and onboarding drag. SSO with least-privilege groups speeds onboarding and shrinks the attack surface.",
    roadmap: [
      { label: "App inventory", date: "2026-04-05", done: true },
      { label: "Group taxonomy", date: "2026-05-20", done: false },
      { label: "Migration", date: "2026-07-10", done: false },
    ],
    dependencies: "—",
    eta: "2026-07-10", status: "risk",
    weekly: { week: "Week of 26 May 2026", text: "Group taxonomy is taking longer than scoped — three teams have non-standard roles. Adding a week and bringing in Security to adjudicate." },
    owner: "Greg Holloway", slackChannel: "#proj-sso", slackUrl: "https://slack.com/app",
    roi: 60000, finalProduct: "Company-wide SSO with documented least-privilege access groups.",
  },
  {
    team: "finance", name: "Automated Month-End Close", subtitle: "From 8 days to 3",
    objective: "Halve month-end close time through reconciliation automation.",
    purpose: "Manual reconciliations make close slow and error-prone. Automating the routine matches frees the team for analysis and shortens reporting cycles.",
    roadmap: [
      { label: "Process mapping", date: "2026-03-20", done: true },
      { label: "Auto-reconciliation rules", date: "2026-05-15", done: true },
      { label: "Parallel run", date: "2026-06-30", done: false },
      { label: "Cutover", date: "2026-07-31", done: false },
    ],
    dependencies: "Parallel run needs the finalised ledger feed from the ERP upgrade (Business Ops).",
    eta: "2026-07-31", status: "ontrack",
    weekly: { week: "Week of 26 May 2026", text: "Auto-reconciliation live in sandbox matching 92% of lines. Parallel run scheduled for June close. Team morale high — this is giving days back." },
    owner: "Sofia Marchetti", slackChannel: "#proj-month-end", slackUrl: "https://slack.com/app",
    roi: 150000, finalProduct: "An automated reconciliation workflow cutting month-end close to 3 days.",
  },
  {
    team: "finance", name: "Spend Visibility Cube", subtitle: "Real-time view of committed spend",
    objective: "Replace monthly spend reports with a live, drillable view.",
    purpose: "Budget owners only see spend a month late. A live cube lets them catch overruns while they can still act.",
    roadmap: [
      { label: "Data sources", date: "2026-06-10", done: false },
      { label: "Cube build", date: "2026-08-01", done: false },
    ],
    dependencies: "Depends on the warehouse from AI Ops and PO data from Procurement.",
    eta: "2026-09-15", status: "ontrack",
    weekly: { week: "Week of 26 May 2026", text: "Kicked off this week. Mapping the PO and invoice sources — first data pull expected next sprint." },
    owner: "Sofia Marchetti", slackChannel: "#proj-spend-cube", slackUrl: "https://slack.com/app",
    roi: 75000, finalProduct: "A drillable spend cube with alerts for budget owners.",
  },
];

export function sampleData() {
  return { projects: SAMPLE.map((p) => Object.assign(blankProject(p.team), p, { id: uid(), updated: Date.now() })) };
}
