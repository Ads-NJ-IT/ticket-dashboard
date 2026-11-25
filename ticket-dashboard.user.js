// ==UserScript==
// @name         Ticket Dashboard (Freshservice)
// @namespace    https://github.com/Ads-NJ-IT/ticket-dashboard
// @version      1.0.0
// @description  Open and pending tickets per tech, using your logged-in Freshservice session. Open https://adsofnjinc.freshservice.com/a/ticket-dashboard
// @match        https://adsofnjinc.freshservice.com/a/ticket-dashboard*
// @run-at       document-start
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Ads-NJ-IT/ticket-dashboard/main/ticket-dashboard.user.js
// @downloadURL  https://raw.githubusercontent.com/Ads-NJ-IT/ticket-dashboard/main/ticket-dashboard.user.js
// ==/UserScript==
var CSS = "\n\n:root {\n  --bg: #f4f6f8;\n  --card: #ffffff;\n  --ink: #16212b;\n  --muted: #5f6f7e;\n  --line: #dde3e9;\n  --open: #1f7a95;\n  --pend: #c98a1b;\n  --warn: #b83a3a;\n  --warn-bg: #fbeeee;\n  --font: \"Segoe UI\", system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif;\n}\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme=\"light\"]) {\n    --bg: #12181e; --card: #1a232b; --ink: #e8eef3; --muted: #8fa1b1; --line: #2a3640;\n    --open: #4fb8d3; --pend: #e0a540; --warn: #ee7b7b; --warn-bg: #2d1d1f;\n    color-scheme: dark;\n  }\n}\n:root[data-theme=\"dark\"] {\n  --bg: #12181e; --card: #1a232b; --ink: #e8eef3; --muted: #8fa1b1; --line: #2a3640;\n  --open: #4fb8d3; --pend: #e0a540; --warn: #ee7b7b; --warn-bg: #2d1d1f;\n  color-scheme: dark;\n}\n* { box-sizing: border-box; }\nhtml, body { margin: 0; }\nbody { background: var(--bg); color: var(--ink); font-family: var(--font); height: 100vh; overflow: hidden; }\nmain { margin: 0; padding: 10px 12px; display: flex; flex-direction: column; height: 100vh; }\nmain > * { flex-shrink: 0; }\n.top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }\nbody.floating .top { -webkit-app-region: drag; app-region: drag; }\nh1 { font-size: clamp(14px, 2.4vmin, 24px); margin: 0; text-wrap: balance; }\n.status { color: var(--muted); font-size: 12px; margin-top: 2px; min-height: 16px; }\n.status.err { color: var(--warn); }\n.status:empty { display: none; }\n.btns { display: flex; gap: 6px; -webkit-app-region: no-drag; app-region: no-drag; }\nbutton { font: inherit; color: var(--ink); cursor: pointer; }\n.btn { font-size: 12px; background: var(--card); border: 1px solid var(--line); border-radius: 6px; padding: 5px 10px; }\n.btn:hover { border-color: var(--open); }\nbutton:focus-visible, a:focus-visible { outline: 2px solid var(--open); outline-offset: 1px; }\nbutton[hidden] { display: none; }\nbutton:disabled { opacity: .55; cursor: default; }\n.tiles { display: grid; grid-template-columns: repeat(var(--tcols, 4), minmax(0, 1fr)); gap: 8px; margin-bottom: 8px; }\n.tile { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 4px 10px; white-space: nowrap; overflow: hidden; }\n.tile b { display: inline; margin-right: 6px; font-size: clamp(16px, 3vmin, 36px); line-height: 1.1; font-variant-numeric: tabular-nums; }\n.tile span { color: var(--muted); font-size: clamp(11px, 1.5vmin, 16px); }\n.tile.open b { color: var(--open); }\n.tile.pend b { color: var(--pend); }\n.tile.unas { background: var(--warn-bg); border-color: var(--warn); }\n.tile.unas b { color: var(--warn); }\nh2 { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; margin: 7px 0 4px; }\nh2 span { font-weight: 400; text-transform: none; letter-spacing: 0; }\n.grid { display: grid; grid-template-columns: repeat(var(--cols, 5), minmax(0, 1fr)); grid-auto-rows: var(--rowh, 120px); gap: 8px; }\n.card { container-type: size; display: flex; flex-direction: column; min-height: 0; background: var(--card); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }\n.card.sel { border-color: var(--open); box-shadow: 0 0 0 1px var(--open); }\n.main { display: flex; flex-direction: column; justify-content: center; flex: 1; min-height: 0; overflow: hidden; width: 100%; text-align: left; background: none; border: 0; padding: 4cqh 6cqw 2cqh; color: inherit; font: inherit; }\nbutton.main:hover .name { color: var(--open); }\n.name { font-size: min(16cqh, 12cqw); font-weight: 700; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n.big { font-size: min(38cqh, 26cqw); font-weight: 700; line-height: 1.05; color: var(--open); font-variant-numeric: tabular-nums; }\n.big small { font-size: min(11cqh, 8cqw); font-weight: 400; color: var(--muted); margin-left: 4px; }\n.small { font-size: min(11cqh, 8.5cqw); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--muted); font-variant-numeric: tabular-nums; }\n.foot { display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 2cqh 5cqw 3cqh; border-top: 1px solid var(--line); }\n.when { font-size: min(8.5cqh, 6.6cqw); line-height: 1.25; color: var(--muted); white-space: nowrap; }\n.next { display: block; }\n.rbtn { font-size: min(8.5cqh, 6.6cqw); padding: 0.2em 0.7em; flex-shrink: 0; border: 1px solid var(--line); border-radius: 6px; background: var(--bg); }\n.rbtn:hover:not(:disabled) { border-color: var(--open); }\n.card.lvl1 { border-color: var(--pend); background: color-mix(in srgb, var(--pend) 14%, var(--card)); }\n.card.lvl1 .big { color: var(--pend); }\n.card.lvl2 { border-color: var(--warn); background: var(--warn-bg); }\n.card.lvl2 .big { color: var(--warn); }\n.srow { display: grid; grid-template-columns: 1fr 70px 70px; gap: 8px; align-items: center; padding: 5px 0; border-top: 1px solid var(--line); font-size: 13px; }\n.srow.head { border-top: 0; color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }\n.srow input { width: 100%; font: inherit; font-size: 13px; color: var(--ink); background: var(--bg); border: 1px solid var(--line); border-radius: 6px; padding: 3px 6px; }\n.srow.all { font-weight: 600; }\n.card.unas { background: var(--warn-bg); border-color: var(--warn); }\n.card.unas .name, .card.unas .big { color: var(--warn); }\n.card.other { border-style: dashed; }\n.card.other .name, .card.other .big { color: var(--muted); }\n.panel { position: fixed; inset: 0; z-index: 10; overflow: auto; background: var(--card); padding: 12px 14px; }\n.panel[hidden] { display: none; }\n.phead { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px; }\n.phead b { font-size: 14px; }\n.trow { display: grid; grid-template-columns: 56px 1fr auto; gap: 8px; align-items: baseline; padding: 6px 0; border-top: 1px solid var(--line); font-size: 13px; }\n.trow a { color: var(--open); text-decoration: none; }\n.trow a:hover { text-decoration: underline; }\n.trow .subj { color: var(--ink); overflow-wrap: anywhere; }\n.pill { font-size: 11px; border-radius: 10px; padding: 1px 8px; border: 1px solid var(--line); color: var(--muted); white-space: nowrap; }\n.pill.o { color: var(--open); border-color: var(--open); }\n.pill.p { color: var(--pend); border-color: var(--pend); }\n.pmsg { color: var(--muted); font-size: 12px; padding: 6px 0; }\n.pmsg.err { color: var(--warn); }\n.note { color: var(--muted); font-size: 11px; margin-top: 14px; line-height: 1.5; }\n.foot { flex-wrap: nowrap; }\n.when { min-width: 0; }\nh1 { overflow-wrap: anywhere; }\n.srow.four { grid-template-columns: 1fr 100px 60px 60px; }\n.srow select { width: 100%; font: inherit; font-size: 13px; color: var(--ink); background: var(--bg); border: 1px solid var(--line); border-radius: 6px; padding: 3px 4px; }\n.panel .btns { margin-top: 10px; }\n.panel textarea { margin-top: 8px; font: 12px monospace; }\n";
(function () {
  "use strict";
  /* Ticket Dashboard. Runs on https://adsofnjinc.freshservice.com/a/ticket-dashboard using your logged-in Freshservice session. */
  var WS = "2";                       /* My Team workspace */
  var PER = 100;                      /* tickets per call, the most Freshservice allows */
  var BASE = "/a/tickets/";
  /* Techs come from your Freshservice agent list. Which team each one is on is set in Settings and saved in this browser. */
  var AGENTS = [];     /* [name, id, "us" | "ph"], built from agentsAll + teams */
  var agentsAll = [];  /* every active agent: {id, name} */

  /* Take over the page before Freshservice's own app loads. */
  try { window.stop(); } catch (e) {}
  document.documentElement.innerHTML =
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Ticket Dashboard</title><style>' + CSS + '</style></head>' +
    '<body><main id="fit">' +
    '<div class="top"><div><h1>Ticket Dashboard</h1><div class="status" id="status"></div><div class="status" id="count"></div></div>' +
    '<div class="btns"><button class="btn" id="refresh" type="button">Refresh</button><button class="btn" id="gear" type="button">Settings</button></div></div>' +
    '<div class="tiles" id="tiles"></div>' +
    '<div class="grid" id="gridUnas"></div><h2 id="teamHead"></h2><div class="grid" id="gridTeam"></div><h2 id="phHead"></h2><div class="grid" id="gridPh"></div>' +
    '</main><div class="panel" id="settings" hidden></div><div class="panel" id="panel" hidden></div></body>';

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function clock(ms) { return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
  function ago(iso) {
    var h = (Date.now() - new Date(iso).getTime()) / 3600000;
    return h < 24 ? Math.max(1, Math.round(h)) + "h" : Math.round(h / 24) + "d";
  }

  var thr = store("td-thr") || { all: [20, 25], per: {} };
  var autoSec = store("td-autosec"); if (typeof autoSec !== "number") autoSec = 60;
  var tickets = store("td-tickets") || null, pulledAt = store("td-at") || 0;
  var teams = store("td-teams") || {};  /* agent id -> "ph" | "hide"; missing means US team */
  function buildAgents() {
    AGENTS = agentsAll.filter(function (a) { return (teams[a.id] || "us") !== "hide"; })
      .map(function (a) { return [a.name, a.id, teams[a.id] || "us"]; });
  }
  async function loadAgents() {
    var r = await fetch("/api/_/bootstrap/agents_groups", { headers: { accept: "application/json" }, credentials: "same-origin" });
    if (r.status === 401 || r.status === 403) throw new Error("Signed out of Freshservice. Log in, then refresh.");
    if (!r.ok) throw new Error("Freshservice answered " + r.status);
    var j = await r.json();
    agentsAll = (j.agents || []).filter(function (a) { return !a.deleted && a.agent_type === 1; })
      .map(function (a) { return { id: a.id, name: String(a.name || "").replace(/\s+/g, " ").trim() }; })
      .sort(function (a, b) { return a.name.localeCompare(b.name); });
    buildAgents();
  }
  var busy = false, nextAt = Date.now() + 500, err = "";

  function limits(name) { var p = thr.per[name] || []; return [p[0] != null ? p[0] : thr.all[0], p[1] != null ? p[1] : thr.all[1]]; }
  function levelCls(name, o) { var l = limits(name); return o > l[1] ? "lvl2" : o > l[0] ? "lvl1" : ""; }

  /* One pull: every unresolved ticket, 100 per call (about 6 calls). */
  async function pull() {
    if (busy) return;
    busy = true; err = ""; paintStatus();
    try {
      var q = encodeURIComponent(JSON.stringify([
        { condition: "status", operator: "is_in", value: ["2", "3", "6"], type: "default" },
        { condition: "workspace_id", operator: "is", value: WS, type: "default" }
      ]));
      if (!agentsAll.length) await loadAgents();
      var all = [], page = 1, more = true;
      while (more && page <= 30) {
        var r = await fetch("/api/_/tickets?per_page=" + PER + "&page=" + page + "&order_by=created_at&order_type=asc&query_hash=" + q,
          { headers: { accept: "application/json" }, credentials: "same-origin" });
        if (r.status === 401 || r.status === 403) throw new Error("Signed out of Freshservice. Log in, then refresh.");
        if (!r.ok) throw new Error("Freshservice answered " + r.status);
        var j = await r.json();
        (j.tickets || []).forEach(function (t) {
          all.push({ id: t.id, s: t.status, a: t.responder_id || 0, c: t.created_at, sub: t.subject || "" });
        });
        more = !!(j.meta && j.meta.has_next);
        page++;
      }
      tickets = all; pulledAt = Date.now();
      store("td-tickets", tickets); store("td-at", pulledAt);
    } catch (e) {
      err = e && e.message ? e.message : "Could not reach Freshservice.";
    } finally {
      busy = false;
      nextAt = Date.now() + Math.max(15, autoSec) * 1000;
      render();
    }
  }

  function bucket(list) {
    var o = 0, p = 0, old = null;
    list.forEach(function (t) {
      if (t.s === 2) { o++; if (!old || t.c < old) old = t.c; } else p++;
    });
    return { o: o, p: p, old: old, list: list };
  }

  var openKey = null;
  function render() {
    var ts = tickets || [];
    var known = {}; AGENTS.forEach(function (a) { known[a[1]] = 1; });
    var by = {}; ts.forEach(function (t) { (by[t.a] = by[t.a] || []).push(t); });
    var unas = bucket(by[0] || []);
    var other = bucket(ts.filter(function (t) { return t.a && !known[t.a]; }));
    var tot = bucket(ts);

    var tiles = $("tiles"); tiles.textContent = "";
    [["open", tot.o, "Open"], ["pend", tot.p, "Pending"], ["", tot.o + tot.p, "Total"], ["unas", unas.o + unas.p, "Unassigned"]].forEach(function (x) {
      var t = el("div", "tile " + x[0]); t.appendChild(el("b", "", String(x[1]))); t.appendChild(el("span", "", x[2])); tiles.appendChild(t);
    });

    function card(host, cls, name, key, b) {
      var c = el("div", "card " + cls + (openKey === key ? " sel" : ""));
      var m = el("button", "main"); m.type = "button";
      m.addEventListener("click", function () { showList(key, name, b.list); });
      m.appendChild(el("div", "name", name));
      var big = el("div", "big", String(b.o)); big.appendChild(el("small", "", "open")); m.appendChild(big);
      m.appendChild(el("div", "small", b.p + " pending, " + (b.o + b.p) + " total"));
      c.appendChild(m);
      var f = el("div", "foot");
      f.appendChild(el("span", "when", b.old ? "Oldest open " + ago(b.old) : "No open tickets"));
      c.appendChild(f);
      host.appendChild(c);
    }
    var gu = $("gridUnas"); gu.textContent = "";
    card(gu, "unas", "Unassigned", "unas", unas);
    card(gu, "other", "Managers and inactive", "other", other);
    function group(hostId, headId, title, g) {
      var host = $(hostId); host.textContent = "";
      var rows = AGENTS.filter(function (a) { return a[2] === g; }).map(function (a) { var b = bucket(by[a[1]] || []); b.name = a[0]; b.id = a[1]; return b; });
      rows.sort(function (x, y) { return y.o - x.o || (y.o + y.p) - (x.o + x.p); });
      var ho = 0, hp = 0; rows.forEach(function (r) { ho += r.o; hp += r.p; });
      var head = $(headId); head.textContent = title; head.appendChild(el("span", "", ho + " open, " + hp + " pending, " + (ho + hp) + " total"));
      rows.forEach(function (r) { card(host, levelCls(r.name, r.o), r.name, "a" + r.id, r); });
    }
    group("gridTeam", "teamHead", "US team", "us");
    group("gridPh", "phHead", "PH team", "ph");
    $("refresh").disabled = busy;
    paintStatus();
    layout();
  }

  function paintStatus() {
    var st = $("status");
    st.textContent = busy ? "Updating" : err ? err : "";
    st.className = "status" + (err ? " err" : "");
    var left = Math.max(0, Math.ceil((nextAt - Date.now()) / 1000));
    $("count").textContent = (pulledAt ? "Updated " + clock(pulledAt) : "") + (autoSec > 0 && !busy ? (pulledAt ? ", next in " : "Next in ") + Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0") : "");
    $("refresh").disabled = busy;
  }

  /* Ticket list for a card, from the data already pulled (no extra calls). */
  function showList(key, name, list) {
    openKey = key;
    var pn = $("panel"); pn.hidden = false; pn.textContent = "";
    var head = el("div", "phead"); head.appendChild(el("b", "", name + ", " + list.length + " tickets"));
    var close = el("button", "btn", "Close"); close.type = "button";
    close.addEventListener("click", function () { openKey = null; pn.hidden = true; render(); });
    head.appendChild(close); pn.appendChild(head);
    list.slice().sort(function (a, b) { return (a.s === 2 ? 0 : 1) - (b.s === 2 ? 0 : 1) || String(a.c).localeCompare(String(b.c)); }).forEach(function (t) {
      var r = el("div", "trow");
      var a = el("a", "", "#" + t.id); a.href = BASE + Number(t.id); a.target = "_blank"; a.rel = "noopener";
      r.appendChild(a); r.appendChild(el("span", "subj", t.sub + "  (" + ago(t.c) + ")"));
      r.appendChild(el("span", "pill " + (t.s === 2 ? "o" : "p"), t.s === 2 ? "Open" : "Pending"));
      pn.appendChild(r);
    });
    if (!list.length) pn.appendChild(el("div", "pmsg", "No tickets."));
  }

  /* Settings: refresh interval and color limits, saved in this browser. */
  function num(v) { var n = parseInt(v, 10); return isNaN(n) || n < 0 ? null : n; }
  function buildSettings() {
    var sp = $("settings"); sp.textContent = "";
    var head = el("div", "phead"); head.appendChild(el("b", "", "Settings"));
    var close = el("button", "btn", "Close"); close.type = "button";
    close.addEventListener("click", function () { sp.hidden = true; }); head.appendChild(close); sp.appendChild(head);
    function input(val, ph, onSet) {
      var i = document.createElement("input"); i.type = "number"; i.min = "0";
      if (val != null) i.value = val; if (ph != null) i.placeholder = ph;
      i.addEventListener("change", function () { onSet(num(i.value)); store("td-thr", thr); render(); });
      return i;
    }
    var ar = el("div", "srow"); ar.appendChild(el("span", "", "Auto refresh every (seconds, 0 is off, minimum 15)"));
    var ai = document.createElement("input"); ai.type = "number"; ai.min = "0"; ai.value = autoSec;
    ai.addEventListener("change", function () { var n = num(ai.value); autoSec = n == null ? 0 : (n && n < 15 ? 15 : n); store("td-autosec", autoSec); nextAt = Date.now() + autoSec * 1000; paintStatus(); });
    ar.appendChild(ai); sp.appendChild(ar);
    sp.appendChild(el("div", "pmsg", "Card colors: yellow when open is over the first number, red when over the second. Blank boxes use the Everyone value."));
    var hr = el("div", "srow head"); hr.appendChild(el("span")); hr.appendChild(el("span", "", "Yellow")); hr.appendChild(el("span", "", "Red")); sp.appendChild(hr);
    var all = el("div", "srow all"); all.appendChild(el("span", "", "Everyone"));
    all.appendChild(input(thr.all[0], null, function (n) { if (n != null) thr.all[0] = n; }));
    all.appendChild(input(thr.all[1], null, function (n) { if (n != null) thr.all[1] = n; }));
    sp.appendChild(all);
    var hr2 = el("div", "srow head four"); ["Tech", "Team", "Yellow", "Red"].forEach(function (t) { hr2.appendChild(el("span", "", t)); }); sp.appendChild(hr2);
    if (!agentsAll.length) sp.appendChild(el("div", "pmsg", "Techs load with the first refresh."));
    agentsAll.forEach(function (a) {
      var r = el("div", "srow four"); r.appendChild(el("span", "", a.name));
      var sel = document.createElement("select");
      [["us", "US team"], ["ph", "PH team"], ["hide", "Hidden"]].forEach(function (o) { var op = el("option", "", o[1]); op.value = o[0]; sel.appendChild(op); });
      sel.value = teams[a.id] || "us";
      sel.addEventListener("change", function () { if (sel.value === "us") delete teams[a.id]; else teams[a.id] = sel.value; store("td-teams", teams); buildAgents(); render(); });
      r.appendChild(sel);
      var cur = thr.per[a.name] || [null, null];
      [0, 1].forEach(function (k) {
        r.appendChild(input(cur[k], thr.all[k], function (n) {
          var p = thr.per[a.name] || [null, null]; p[k] = n;
          if (p[0] == null && p[1] == null) delete thr.per[a.name]; else thr.per[a.name] = p;
        }));
      });
      sp.appendChild(r);
    });
    sp.appendChild(el("div", "pmsg", "Hidden techs' tickets count in the Managers and inactive card. To give another manager your setup, Copy settings here and Paste settings on their computer."));
    var ex = el("div", "btns");
    var cp = el("button", "btn", "Copy settings"); cp.type = "button";
    cp.addEventListener("click", function () {
      navigator.clipboard.writeText(JSON.stringify({ teams: teams, thr: thr, autoSec: autoSec })).then(function () { cp.textContent = "Copied"; }, function () { cp.textContent = "Copy failed"; });
    });
    var ps = el("button", "btn", "Paste settings"); ps.type = "button";
    var box = document.createElement("textarea"); box.hidden = true; box.rows = 3; box.style.width = "100%"; box.placeholder = "Paste settings here, then press Apply";
    var ap = el("button", "btn", "Apply"); ap.type = "button"; ap.hidden = true;
    ps.addEventListener("click", function () { box.hidden = false; ap.hidden = false; box.focus(); });
    ap.addEventListener("click", function () {
      try {
        var v = JSON.parse(box.value);
        if (v.teams && typeof v.teams === "object") { teams = v.teams; store("td-teams", teams); }
        if (v.thr && v.thr.all && v.thr.per) { thr = v.thr; store("td-thr", thr); }
        if (typeof v.autoSec === "number") { autoSec = v.autoSec; store("td-autosec", autoSec); }
        buildAgents(); buildSettings(); render();
      } catch (e) { ap.textContent = "Not valid settings"; }
    });
    ex.appendChild(cp); ex.appendChild(ps); sp.appendChild(ex); sp.appendChild(box); sp.appendChild(ap);
  }

  /* Fill the window: pick the column count that gives the biggest cards, stretch rows to the full height. */
  var fit = $("fit"), GAP = 8;
  var grids = ["gridUnas", "gridTeam", "gridPh"].map($);
  function layout() {
    var vw = window.innerWidth, vh = window.innerHeight;
    if (!vw || !vh) return;
    var counts = grids.map(function (g) { return g.children.length; });
    fit.style.setProperty("--tcols", vw >= 480 ? 4 : 2);
    fit.style.setProperty("--rowh", "0px");
    fit.style.height = "auto";
    var cardsH = grids.reduce(function (s, g) { return s + g.offsetHeight; }, 0);
    var fixed = fit.offsetHeight - cardsH;
    fit.style.height = "";
    var cs = getComputedStyle(fit);
    var W = fit.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), best = null;
    for (var c = 1; c <= 12; c++) {
      var rows = counts.map(function (n) { return Math.max(1, Math.ceil(n / c)); });
      var total = rows.reduce(function (a, b) { return a + b; }, 0);
      var gaps = rows.reduce(function (a, r) { return a + (r - 1) * GAP; }, 0);
      var rh = (vh - fixed - gaps - 2) / total, cw = (W - (c - 1) * GAP) / c;
      if (rh < 20 || cw < 40) continue;
      var score = Math.min(cw, rh * 1.6);
      if (!best || score > best.score) best = { c: c, rh: rh, score: score };
    }
    if (!best) best = { c: 4, rh: 60 };
    fit.style.setProperty("--cols", best.c);
    fit.style.setProperty("--rowh", Math.floor(best.rh) + "px");
    fit.querySelectorAll(".name").forEach(function (n) {
      n.style.fontSize = "";
      if (n.scrollWidth > n.clientWidth + 1) n.style.fontSize = Math.max(8, parseFloat(getComputedStyle(n).fontSize) * n.clientWidth / n.scrollWidth * 0.98) + "px";
    });
  }

  $("refresh").addEventListener("click", pull);
  $("gear").addEventListener("click", function () { var sp = $("settings"); if (sp.hidden) { buildSettings(); sp.hidden = false; } else sp.hidden = true; });
  window.addEventListener("resize", function () { requestAnimationFrame(layout); });
  setInterval(function () {
    paintStatus();
    if (autoSec > 0 && !busy && Date.now() >= nextAt && !document.hidden) pull();
  }, 1000);
  render();
})();
