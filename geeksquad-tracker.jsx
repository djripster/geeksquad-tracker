import { useState } from "react";

const MANAGER_PASSWORD = "geeksquad2024";
const ROLES = ["Consultation Agent", "Repair Agent"];

function getToday() {
  return new Date().toISOString().split("T")[0];
}
function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function getWeekRange() {
  const now = new Date();
  const start = new Date(now); start.setDate(now.getDate() - now.getDay());
  const end = new Date(start); end.setDate(start.getDate() + 6);
  return { start: start.toISOString().split("T")[0], end: end.toISOString().split("T")[0] };
}
function getMonthRange() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0],
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0],
  };
}

const initialAgents = [
  { id: 1, name: "Alex", role: "Consultation Agent", active: true },
  { id: 2, name: "Jordan", role: "Repair Agent", active: true },
  { id: 3, name: "Morgan", role: "Consultation Agent", active: true },
  { id: 4, name: "Riley", role: "Repair Agent", active: true },
  { id: 5, name: "Casey", role: "Consultation Agent", active: true },
  { id: 6, name: "Drew", role: "Repair Agent", active: true },
];

const initialEntries = [
  { id: 1, date: getToday(), agent: "Alex", role: "Consultation Agent", memberships: 3, ticketsCreated: 5, ticketsClosed: 0, appleRepairs: 0 },
  { id: 2, date: getToday(), agent: "Jordan", role: "Repair Agent", memberships: 0, ticketsCreated: 0, ticketsClosed: 7, appleRepairs: 2 },
  { id: 3, date: getToday(), agent: "Morgan", role: "Consultation Agent", memberships: 2, ticketsCreated: 4, ticketsClosed: 0, appleRepairs: 0 },
  { id: 4, date: getToday(), agent: "Riley", role: "Repair Agent", memberships: 0, ticketsCreated: 0, ticketsClosed: 5, appleRepairs: 3 },
];

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --orange: #FF6B00; --black: #0a0a0a; --dark: #111111;
    --card: #181818; --border: #2a2a2a; --text: #ffffff; --muted: #888888;
  }
  input, select { outline: none; }
  input:focus, select:focus { border-color: var(--orange) !important; }
  .tab-btn { background: transparent; border: none; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; padding: 8px 20px; border-radius: 4px; transition: all 0.2s; }
  .tab-btn.active { background: var(--orange); color: #000; }
  .tab-btn.inactive { color: var(--muted); }
  .tab-btn.inactive:hover { color: #fff; }
  .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 20px 24px; transition: border-color 0.2s; }
  .stat-card:hover { border-color: var(--orange); }
  .pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .pill-consult { background: rgba(255,107,0,0.15); color: var(--orange); border: 1px solid rgba(255,107,0,0.3); }
  .pill-repair { background: rgba(100,180,255,0.12); color: #64b4ff; border: 1px solid rgba(100,180,255,0.25); }
  .pill-inactive { background: rgba(136,136,136,0.1); color: var(--muted); border: 1px solid rgba(136,136,136,0.2); }
  .btn-primary { background: var(--orange); color: #000; border: none; font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 1.5px; text-transform: uppercase; padding: 14px 32px; border-radius: 6px; cursor: pointer; transition: background 0.2s, transform 0.1s; }
  .btn-primary:hover { background: #ff8533; }
  .btn-primary:active { transform: scale(0.98); }
  .btn-sm { background: transparent; border: 1px solid var(--border); color: var(--muted); font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; padding: 5px 12px; border-radius: 4px; cursor: pointer; transition: all 0.15s; }
  .btn-sm:hover { color: #fff; border-color: #555; }
  .btn-sm.danger:hover { color: #ff4444; border-color: #ff4444; }
  .btn-sm.success { color: #00c864; border-color: #00c864; }
  .btn-sm.success:hover { color: #00ff80; border-color: #00ff80; }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; padding: 8px 20px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
  .btn-ghost:hover { color: #fff; border-color: #555; }
  .form-input { width: 100%; background: #111; border: 1px solid var(--border); color: #fff; font-family: 'Barlow', sans-serif; font-size: 15px; padding: 12px 14px; border-radius: 6px; transition: border-color 0.2s; }
  .form-input-sm { background: #111; border: 1px solid var(--border); color: #fff; font-family: 'Barlow', sans-serif; font-size: 13px; padding: 8px 10px; border-radius: 5px; transition: border-color 0.2s; width: 100%; }
  .form-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; display: block; }
  .nav-link { background: none; border: none; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; padding: 6px 14px; border-radius: 4px; transition: all 0.2s; }
  .success-banner { background: rgba(0,200,100,0.1); border: 1px solid rgba(0,200,100,0.3); color: #00c864; border-radius: 8px; padding: 14px 20px; font-weight: 700; font-size: 14px; letter-spacing: 1px; text-align: center; animation: fadeIn 0.3s ease; }
  .dash-tab { background: none; border: none; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; padding: 10px 20px; border-bottom: 2px solid transparent; color: var(--muted); transition: all 0.2s; }
  .dash-tab.active { color: var(--orange); border-bottom-color: var(--orange); }
  .dash-tab:hover:not(.active) { color: #fff; }
  .metric-bar-bg { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .metric-bar-fill { height: 100%; background: var(--orange); border-radius: 3px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
  .agent-row { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; transition: border-color 0.2s; }
  .agent-row:hover { border-color: #3a3a3a; }
  .agent-row.editing { border-color: var(--orange); }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function App() {
  const [view, setView] = useState("submit");
  const [dashTab, setDashTab] = useState("performance");
  const [agents, setAgents] = useState(initialAgents);
  const [nextAgentId, setNextAgentId] = useState(7);
  const [entries, setEntries] = useState(initialEntries);
  const [nextId, setNextId] = useState(5);
  const [loginError, setLoginError] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dashPeriod, setDashPeriod] = useState("daily");
  const [editingAgentId, setEditingAgentId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("Consultation Agent");
  const [agentSaved, setAgentSaved] = useState(false);

  const [form, setForm] = useState({
    agent: "", role: "", date: getToday(),
    memberships: "", ticketsCreated: "", ticketsClosed: "", appleRepairs: "",
  });

  const activeAgents = agents.filter(a => a.active);

  function handleFormChange(e) {
    const { name, value } = e.target;
    if (name === "agent") {
      const found = agents.find(a => a.name === value);
      setForm(f => ({ ...f, agent: value, role: found ? found.role : f.role }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit() {
    if (!form.agent || !form.role || !form.date) return;
    const entry = {
      id: nextId, date: form.date, agent: form.agent, role: form.role,
      memberships: parseInt(form.memberships) || 0,
      ticketsCreated: parseInt(form.ticketsCreated) || 0,
      ticketsClosed: parseInt(form.ticketsClosed) || 0,
      appleRepairs: parseInt(form.appleRepairs) || 0,
    };
    setEntries(e => [...e, entry]);
    setNextId(n => n + 1);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ agent: "", role: "", date: getToday(), memberships: "", ticketsCreated: "", ticketsClosed: "", appleRepairs: "" });
    }, 2500);
  }

  function handleLogin() {
    if (passwordInput === MANAGER_PASSWORD) {
      setIsManager(true); setView("dashboard"); setLoginError("");
    } else {
      setLoginError("Incorrect password. Try again.");
    }
  }

  function startEdit(agent) {
    setEditingAgentId(agent.id);
    setEditName(agent.name);
    setEditRole(agent.role);
  }

  function saveEdit(agentId) {
    if (!editName.trim()) return;
    const oldName = agents.find(a => a.id === agentId)?.name;
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, name: editName.trim(), role: editRole } : a));
    if (oldName && oldName !== editName.trim()) {
      setEntries(prev => prev.map(e => e.agent === oldName ? { ...e, agent: editName.trim(), role: editRole } : e));
    }
    setEditingAgentId(null);
    flashSaved();
  }

  function toggleActive(agentId) {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, active: !a.active } : a));
    flashSaved();
  }

  function addAgent() {
    if (!newAgentName.trim()) return;
    setAgents(prev => [...prev, { id: nextAgentId, name: newAgentName.trim(), role: newAgentRole, active: true }]);
    setNextAgentId(n => n + 1);
    setNewAgentName("");
    setNewAgentRole("Consultation Agent");
    flashSaved();
  }

  function flashSaved() {
    setAgentSaved(true);
    setTimeout(() => setAgentSaved(false), 2000);
  }

  function getFilteredEntries() {
    const today = getToday();
    if (dashPeriod === "daily") return entries.filter(e => e.date === today);
    if (dashPeriod === "weekly") { const { start, end } = getWeekRange(); return entries.filter(e => e.date >= start && e.date <= end); }
    if (dashPeriod === "monthly") { const { start, end } = getMonthRange(); return entries.filter(e => e.date >= start && e.date <= end); }
    return entries;
  }

  function getAgentStats(filtered) {
    const stats = {};
    filtered.forEach(e => {
      if (!stats[e.agent]) stats[e.agent] = { agent: e.agent, jobs: 0, memberships: 0, ticketsCreated: 0, ticketsClosed: 0, appleRepairs: 0, role: "" };
      stats[e.agent].role = e.role;
      stats[e.agent].memberships += e.memberships;
      stats[e.agent].ticketsCreated += e.ticketsCreated;
      stats[e.agent].ticketsClosed += e.ticketsClosed;
      stats[e.agent].appleRepairs += e.appleRepairs;
      stats[e.agent].jobs += e.role === "Consultation Agent" ? e.memberships + e.ticketsCreated : e.ticketsClosed + e.appleRepairs;
    });
    return Object.values(stats);
  }

  const filtered = getFilteredEntries();
  const agentStats = getAgentStats(filtered);
  const totalJobs = agentStats.reduce((s, a) => s + a.jobs, 0);

  if (view === "print") {
    return <PrintReport entries={entries} agentStats={agentStats} dashPeriod={dashPeriod} onBack={() => setView("dashboard")} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'Barlow Condensed', sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{CSS}</style>

      {/* Header */}
      <header style={{ background: "#111", borderBottom: "2px solid var(--orange)", padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: "var(--orange)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚡</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 2, textTransform: "uppercase", lineHeight: 1 }}>Geek Squad</div>
              <div style={{ fontWeight: 500, fontSize: 11, letterSpacing: 2, color: "var(--orange)", textTransform: "uppercase" }}>Efficiency Tracker</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            <button className="nav-link" onClick={() => setView("submit")} style={{ color: view === "submit" ? "var(--orange)" : "var(--muted)" }}>Log Work</button>
            <button className="nav-link" onClick={() => isManager ? setView("dashboard") : setView("login")} style={{ color: (view === "dashboard" || view === "login") ? "var(--orange)" : "var(--muted)" }}>
              {isManager ? "Dashboard" : "Manager Login"}
            </button>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>

        {/* ── SUBMIT VIEW ── */}
        {view === "submit" && (
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontWeight: 900, fontSize: 38, letterSpacing: 1, textTransform: "uppercase", lineHeight: 1 }}>Log Your <span style={{ color: "var(--orange)" }}>Work</span></h1>
              <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 8, fontFamily: "'Barlow', sans-serif" }}>Submit your daily activity — takes 30 seconds.</p>
            </div>
            {submitted && <div className="success-banner" style={{ marginBottom: 24 }}>✓ Entry submitted successfully!</div>}
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="form-label">Your Name</label>
                  <select name="agent" value={form.agent} onChange={handleFormChange} className="form-input">
                    <option value="">Select agent...</option>
                    {activeAgents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleFormChange} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Role {form.agent && <span style={{ color: "var(--orange)", fontSize: 10 }}>(auto-filled)</span>}</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {ROLES.map(r => (
                    <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))} style={{
                      flex: 1, padding: "12px 10px", border: `2px solid ${form.role === r ? "var(--orange)" : "var(--border)"}`,
                      background: form.role === r ? "rgba(255,107,0,0.1)" : "transparent",
                      color: form.role === r ? "var(--orange)" : "var(--muted)", borderRadius: 6, cursor: "pointer",
                      fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 1, transition: "all 0.2s"
                    }}>{r === "Consultation Agent" ? "🗣 Consultation" : "🔧 Repair"}</button>
                  ))}
                </div>
              </div>
              {form.role === "Consultation Agent" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "fadeIn 0.3s ease" }}>
                  <div>
                    <label className="form-label">Memberships Sold</label>
                    <input type="number" name="memberships" value={form.memberships} onChange={handleFormChange} placeholder="0" min="0" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Tickets Created</label>
                    <input type="number" name="ticketsCreated" value={form.ticketsCreated} onChange={handleFormChange} placeholder="0" min="0" className="form-input" />
                  </div>
                </div>
              )}
              {form.role === "Repair Agent" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "fadeIn 0.3s ease" }}>
                  <div>
                    <label className="form-label">Tickets Closed</label>
                    <input type="number" name="ticketsClosed" value={form.ticketsClosed} onChange={handleFormChange} placeholder="0" min="0" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Apple Repairs Completed</label>
                    <input type="number" name="appleRepairs" value={form.appleRepairs} onChange={handleFormChange} placeholder="0" min="0" className="form-input" />
                  </div>
                </div>
              )}
              <button className="btn-primary" onClick={handleSubmit} disabled={!form.agent || !form.role} style={{ marginTop: 4, opacity: (!form.agent || !form.role) ? 0.4 : 1 }}>
                Submit Entry
              </button>
            </div>
          </div>
        )}

        {/* ── LOGIN VIEW ── */}
        {view === "login" && (
          <div style={{ maxWidth: 420, margin: "60px auto 0" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 40 }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ width: 56, height: 56, background: "rgba(255,107,0,0.1)", border: "2px solid var(--orange)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>🔐</div>
                <h2 style={{ fontWeight: 900, fontSize: 28, textTransform: "uppercase", letterSpacing: 1 }}>Manager Access</h2>
                <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6, fontFamily: "'Barlow', sans-serif" }}>Enter your password to view the dashboard</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className="form-label">Password</label>
                  <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Enter manager password" className="form-input" />
                  {loginError && <p style={{ color: "#ff4444", fontSize: 12, marginTop: 6, fontFamily: "'Barlow', sans-serif" }}>{loginError}</p>}
                </div>
                <button className="btn-primary" onClick={handleLogin}>Unlock Dashboard</button>
                <button className="btn-ghost" onClick={() => setView("submit")}>← Back to Log Work</button>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 11, textAlign: "center", marginTop: 20, fontFamily: "'Barlow', sans-serif" }}>Demo password: geeksquad2024</p>
            </div>
          </div>
        )}

        {/* ── DASHBOARD VIEW ── */}
        {view === "dashboard" && isManager && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontWeight: 900, fontSize: 38, letterSpacing: 1, textTransform: "uppercase", lineHeight: 1 }}>Manager <span style={{ color: "var(--orange)" }}>Dashboard</span></h1>
                <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 6, fontFamily: "'Barlow', sans-serif" }}>Performance & team management</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {dashTab === "performance" && (
                  <>
                    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px", display: "flex", gap: 2 }}>
                      {["daily", "weekly", "monthly"].map(p => (
                        <button key={p} className={`tab-btn ${dashPeriod === p ? "active" : "inactive"}`} onClick={() => setDashPeriod(p)}>{p}</button>
                      ))}
                    </div>
                    <button className="btn-ghost" onClick={() => setView("print")}>🖨 Print</button>
                  </>
                )}
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div style={{ borderBottom: "1px solid var(--border)", marginBottom: 32, display: "flex" }}>
              <button className={`dash-tab ${dashTab === "performance" ? "active" : ""}`} onClick={() => setDashTab("performance")}>📊 Performance</button>
              <button className={`dash-tab ${dashTab === "agents" ? "active" : ""}`} onClick={() => setDashTab("agents")}>
                👥 Manage Agents
                <span style={{ marginLeft: 8, background: "rgba(255,107,0,0.15)", color: "var(--orange)", border: "1px solid rgba(255,107,0,0.3)", borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700 }}>{activeAgents.length}</span>
              </button>
            </div>

            {/* ── PERFORMANCE TAB ── */}
            {dashTab === "performance" && (
              <div style={{ animation: "slideIn 0.25s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                  {[
                    { label: "Total Jobs", value: totalJobs, icon: "⚡" },
                    { label: "Active Agents", value: activeAgents.length, icon: "👥" },
                    { label: "Memberships Sold", value: agentStats.reduce((s, a) => s + a.memberships, 0), icon: "🏆" },
                    { label: "Apple Repairs", value: agentStats.reduce((s, a) => s + a.appleRepairs, 0), icon: "🍎" },
                  ].map(c => (
                    <div key={c.label} className="stat-card">
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                      <div style={{ fontWeight: 900, fontSize: 40, color: "var(--orange)", lineHeight: 1 }}>{c.value}</div>
                      <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginTop: 4 }}>{c.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1, textTransform: "uppercase" }}>Agent Performance</span>
                    <span style={{ color: "var(--muted)", fontSize: 12, fontFamily: "'Barlow', sans-serif" }}>
                      {dashPeriod === "daily" ? formatDate(getToday()) : dashPeriod === "weekly" ? "This Week" : "This Month"}
                    </span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          {["Agent", "Role", "Jobs", "Memberships", "Tickets Created", "Tickets Closed", "Apple Repairs", "Efficiency"].map(h => (
                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {agentStats.sort((a, b) => b.jobs - a.jobs).map((s, i) => {
                          const pct = totalJobs > 0 ? Math.round((s.jobs / totalJobs) * 100) : 0;
                          return (
                            <tr key={s.agent} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                              <td style={{ padding: "16px 20px", fontWeight: 700, fontSize: 15 }}>{s.agent}</td>
                              <td style={{ padding: "16px 20px" }}>
                                <span className={`pill ${s.role === "Consultation Agent" ? "pill-consult" : "pill-repair"}`}>
                                  {s.role === "Consultation Agent" ? "Consult" : "Repair"}
                                </span>
                              </td>
                              <td style={{ padding: "16px 20px", fontWeight: 900, fontSize: 22, color: "var(--orange)" }}>{s.jobs}</td>
                              <td style={{ padding: "16px 20px", fontWeight: 600, color: s.memberships > 0 ? "#fff" : "var(--muted)" }}>{s.memberships || "—"}</td>
                              <td style={{ padding: "16px 20px", fontWeight: 600, color: s.ticketsCreated > 0 ? "#fff" : "var(--muted)" }}>{s.ticketsCreated || "—"}</td>
                              <td style={{ padding: "16px 20px", fontWeight: 600, color: s.ticketsClosed > 0 ? "#fff" : "var(--muted)" }}>{s.ticketsClosed || "—"}</td>
                              <td style={{ padding: "16px 20px", fontWeight: 600, color: s.appleRepairs > 0 ? "#fff" : "var(--muted)" }}>{s.appleRepairs || "—"}</td>
                              <td style={{ padding: "16px 20px", minWidth: 140 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div className="metric-bar-bg" style={{ flex: 1 }}>
                                    <div className="metric-bar-fill" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--orange)", minWidth: 32 }}>{pct}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {agentStats.length === 0 && (
                          <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "'Barlow', sans-serif" }}>No entries for this period.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Recent Submissions</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[...entries].reverse().slice(0, 8).map(e => (
                      <div key={e.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <span style={{ fontWeight: 800, fontSize: 15 }}>{e.agent}</span>
                          <span className={`pill ${e.role === "Consultation Agent" ? "pill-consult" : "pill-repair"}`}>{e.role === "Consultation Agent" ? "Consult" : "Repair"}</span>
                          <span style={{ color: "var(--muted)", fontSize: 12, fontFamily: "'Barlow', sans-serif" }}>{formatDate(e.date)}</span>
                        </div>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                          {e.memberships > 0 && <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Barlow', sans-serif" }}>🏆 {e.memberships} memberships</span>}
                          {e.ticketsCreated > 0 && <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Barlow', sans-serif" }}>🎫 {e.ticketsCreated} created</span>}
                          {e.ticketsClosed > 0 && <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Barlow', sans-serif" }}>✅ {e.ticketsClosed} closed</span>}
                          {e.appleRepairs > 0 && <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "'Barlow', sans-serif" }}>🍎 {e.appleRepairs} apple</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── MANAGE AGENTS TAB ── */}
            {dashTab === "agents" && (
              <div style={{ animation: "slideIn 0.25s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>

                  {/* Left: Roster */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1, textTransform: "uppercase" }}>Team Roster</h3>
                      {agentSaved && <span style={{ color: "#00c864", fontSize: 12, fontWeight: 700, letterSpacing: 1, animation: "fadeIn 0.2s ease" }}>✓ Saved</span>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {agents.map(agent => (
                        <div key={agent.id} className={`agent-row ${editingAgentId === agent.id ? "editing" : ""}`} style={{ opacity: agent.active ? 1 : 0.5 }}>
                          {editingAgentId === agent.id ? (
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div>
                                  <label className="form-label" style={{ fontSize: 9 }}>Name</label>
                                  <input className="form-input-sm" value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEdit(agent.id)} placeholder="Agent name" />
                                </div>
                                <div>
                                  <label className="form-label" style={{ fontSize: 9 }}>Role</label>
                                  <select className="form-input-sm" value={editRole} onChange={e => setEditRole(e.target.value)}>
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button className="btn-sm success" onClick={() => saveEdit(agent.id)}>✓ Save Changes</button>
                                <button className="btn-sm" onClick={() => setEditingAgentId(null)}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5 }}>{agent.name}</div>
                                <span className={`pill ${!agent.active ? "pill-inactive" : agent.role === "Consultation Agent" ? "pill-consult" : "pill-repair"}`}>
                                  {!agent.active ? "Inactive" : agent.role === "Consultation Agent" ? "🗣 Consult" : "🔧 Repair"}
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button className="btn-sm" onClick={() => startEdit(agent)} disabled={!agent.active} style={{ opacity: agent.active ? 1 : 0.4 }}>✏ Edit</button>
                                <button className={`btn-sm ${agent.active ? "danger" : ""}`} onClick={() => toggleActive(agent.id)}>
                                  {agent.active ? "Deactivate" : "Reactivate"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Add Agent + Stats */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Add New Agent</h3>
                      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
                        <div>
                          <label className="form-label">Full Name</label>
                          <input className="form-input" value={newAgentName} onChange={e => setNewAgentName(e.target.value)} onKeyDown={e => e.key === "Enter" && addAgent()} placeholder="e.g. Sam Torres" />
                        </div>
                        <div>
                          <label className="form-label">Role</label>
                          <div style={{ display: "flex", gap: 10 }}>
                            {ROLES.map(r => (
                              <button key={r} onClick={() => setNewAgentRole(r)} style={{
                                flex: 1, padding: "11px 8px", border: `2px solid ${newAgentRole === r ? "var(--orange)" : "var(--border)"}`,
                                background: newAgentRole === r ? "rgba(255,107,0,0.1)" : "transparent",
                                color: newAgentRole === r ? "var(--orange)" : "var(--muted)", borderRadius: 6, cursor: "pointer",
                                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, transition: "all 0.2s"
                              }}>{r === "Consultation Agent" ? "🗣 Consult" : "🔧 Repair"}</button>
                            ))}
                          </div>
                        </div>
                        <button className="btn-primary" onClick={addAgent} disabled={!newAgentName.trim()} style={{ opacity: !newAgentName.trim() ? 0.4 : 1 }}>
                          + Add to Roster
                        </button>
                      </div>
                    </div>

                    {/* Roster Summary */}
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Roster Summary</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[
                          { label: "Consult", value: agents.filter(a => a.active && a.role === "Consultation Agent").length, color: "var(--orange)", bg: "rgba(255,107,0,0.06)", border: "rgba(255,107,0,0.15)" },
                          { label: "Repair", value: agents.filter(a => a.active && a.role === "Repair Agent").length, color: "#64b4ff", bg: "rgba(100,180,255,0.06)", border: "rgba(100,180,255,0.15)" },
                          { label: "Inactive", value: agents.filter(a => !a.active).length, color: "var(--muted)", bg: "rgba(136,136,136,0.06)", border: "rgba(136,136,136,0.15)" },
                        ].map(s => (
                          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: "16px", textAlign: "center" }}>
                            <div style={{ fontWeight: 900, fontSize: 32, color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function PrintReport({ entries, agentStats, dashPeriod, onBack }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const totalJobs = agentStats.reduce((s, a) => s + a.jobs, 0);
  return (
    <div style={{ background: "#fff", minHeight: "100vh", fontFamily: "'Barlow Condensed', sans-serif", color: "#000", padding: "40px 60px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <div className="no-print" style={{ marginBottom: 24, display: "flex", gap: 12 }}>
        <button onClick={onBack} style={{ background: "#333", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>← Back</button>
        <button onClick={() => window.print()} style={{ background: "#FF6B00", color: "#000", border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>🖨 Print</button>
      </div>
      <div style={{ borderBottom: "4px solid #FF6B00", paddingBottom: 20, marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 2, textTransform: "uppercase" }}>⚡ Geek Squad</div>
          <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: 2, color: "#FF6B00", textTransform: "uppercase" }}>Employee Efficiency Report — {dashPeriod.charAt(0).toUpperCase() + dashPeriod.slice(1)}</div>
        </div>
        <div style={{ textAlign: "right", fontFamily: "'Barlow', sans-serif", fontSize: 13, color: "#666" }}>
          <div>Generated: {today}</div>
          <div>Total Team Jobs: <strong style={{ color: "#FF6B00" }}>{totalJobs}</strong></div>
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 40 }}>
        <thead>
          <tr style={{ background: "#111", color: "#fff" }}>
            {["Agent", "Role", "Total Jobs", "Memberships Sold", "Tickets Created", "Tickets Closed", "Apple Repairs", "Share of Work"].map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {agentStats.sort((a, b) => b.jobs - a.jobs).map((s, i) => {
            const pct = totalJobs > 0 ? Math.round((s.jobs / totalJobs) * 100) : 0;
            return (
              <tr key={s.agent} style={{ background: i % 2 === 0 ? "#f9f9f9" : "#fff", borderBottom: "1px solid #e0e0e0" }}>
                <td style={{ padding: "10px 14px", fontWeight: 700 }}>{s.agent}</td>
                <td style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700, color: s.role === "Consultation Agent" ? "#FF6B00" : "#2060cc" }}>{s.role}</td>
                <td style={{ padding: "10px 14px", fontWeight: 900, fontSize: 20, color: "#FF6B00" }}>{s.jobs}</td>
                <td style={{ padding: "10px 14px" }}>{s.memberships || "—"}</td>
                <td style={{ padding: "10px 14px" }}>{s.ticketsCreated || "—"}</td>
                <td style={{ padding: "10px 14px" }}>{s.ticketsClosed || "—"}</td>
                <td style={{ padding: "10px 14px" }}>{s.appleRepairs || "—"}</td>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#FF6B00" }}>{pct}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ borderTop: "2px solid #eee", paddingTop: 20, fontFamily: "'Barlow', sans-serif", fontSize: 11, color: "#999", display: "flex", justifyContent: "space-between" }}>
        <span>Geek Squad Efficiency Tracker — Confidential</span>
        <span>Total entries recorded: {entries.length}</span>
      </div>
    </div>
  );
}