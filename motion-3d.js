const DAYS_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const ATTENDANCE_LOG_KEY = "sgmsc_xi_period_attendance_v2";
let selectedDayOverride = null;
let lastRenderedSignature = "";
let activeView = "routine";
let facultyProfilesCache = [];
let attendanceDateOffset = 0;

function initSmoothScroll() {
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

function initHeroTilt() {
  const heroCard = document.getElementById("live-hero-card");
  if (heroCard && typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(heroCard, {
      max: 5,
      speed: 500,
      glare: true,
      "max-glare": 0.18,
      scale: 1.01
    });
  }
}

function animateCardsInSelector(selector) {
  const cards = document.querySelectorAll(selector);
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(cards, {
      max: 4,
      speed: 450,
      glare: true,
      "max-glare": 0.08,
      perspective: 1000
    });
  }

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 35,
          scale: 0.97
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          delay: index * 0.03,
          ease: "power2.out"
        }
      );
    });
  }
}

function switchAppView(viewName) {
  activeView = viewName;
  const sections = ["routine", "faculty", "radar", "attendance", "notes"];
  sections.forEach(sec => {
    const el = document.getElementById(`view-${sec}`);
    const btn = document.getElementById(`dock-btn-${sec}`);
    if (el) {
      if (sec === viewName) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
    if (btn) {
      if (sec === viewName) {
        btn.classList.add("dock-active");
        btn.classList.remove("dock-idle");
      } else {
        btn.classList.remove("dock-active");
        btn.classList.add("dock-idle");
      }
    }
  });

  if (viewName === "faculty") {
    renderFacultyGrid(document.getElementById("faculty-search")?.value || "");
  } else if (viewName === "radar") {
    renderRadarGrid();
  } else if (viewName === "attendance") {
    renderAttendanceView();
  } else if (viewName === "notes") {
    renderNotesGrid();
  } else {
    lastRenderedSignature = "";
    updateDashboard();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderDayTabs(activeDay) {
  const container = document.getElementById("day-switcher");
  if (!container) return;
  container.innerHTML = DAYS_ORDER.map(day => {
    const isSelected = (selectedDayOverride || activeDay) === day;
    return `
      <button onclick="selectDay('${day}')" 
        class="mono text-xs px-3.5 py-2 rounded-lg transition-all ${
          isSelected 
            ? 'tab-btn-active font-bold shadow-sm' 
            : 'glass-panel tab-btn-idle'
        }">
        ${day.slice(0, 3).toUpperCase()}
      </button>
    `;
  }).join("");
}

function selectDay(day) {
  selectedDayOverride = day;
  lastRenderedSignature = "";
  updateDashboard();
}

function renderFacultyGrid(query = "") {
  if (facultyProfilesCache.length === 0) {
    facultyProfilesCache = buildFacultyProfiles();
  }
  const normalized = query.trim().toLowerCase();
  const filtered = facultyProfilesCache.filter(f => 
    f.code.toLowerCase().includes(normalized) ||
    f.name.toLowerCase().includes(normalized) ||
    f.dept.toLowerCase().includes(normalized) ||
    f.modules.some(m => m.toLowerCase().includes(normalized))
  );

  const grid = document.getElementById("faculty-grid");
  if (!grid) return;

  grid.innerHTML = filtered.map(f => {
    const moduleTags = f.modules.map(m => 
      `<span class="mono text-[10px] px-2 py-0.5 rounded badge-lab">${m}</span>`
    ).join("");

    const sessionList = f.sessions.map(s => `
      <div class="flex items-center justify-between text-xs mono py-1.5 divider-row">
        <span class="text-parchment font-semibold">${s.day} (${s.period})</span>
        <span class="text-ochre">${s.code} • ${s.time}</span>
      </div>
    `).join("");

    return `
      <div class="faculty-card glass-panel rounded-2xl p-6 flex flex-col justify-between gap-5 slot-card">
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="mono text-[10px] uppercase tracking-widest text-ochre">${f.dept}</span>
              <h4 class="text-2xl font-bold text-parchment mt-0.5">Code: ${f.code}</h4>
              <p class="text-xs sub-desc">${f.name} • ${f.role}</p>
            </div>
            <div class="mono text-xs font-bold px-3 py-1.5 rounded-lg tab-btn-active shrink-0">
              ${f.weeklyCount} Classes / Week
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5 pt-1">
            ${moduleTags}
          </div>
        </div>

        <div class="space-y-1 pt-3 divider-top-always">
          <p class="mono text-[10px] uppercase tracking-wider instructor-label mb-2">CLASS DAYS & TIME</p>
          ${sessionList}
        </div>
      </div>
    `;
  }).join("");

  animateCardsInSelector(".faculty-card");
}

function renderRadarGrid() {
  const container = document.getElementById("radar-grid");
  if (!container) return;

  container.innerHTML = RADAR_EVENTS.map(item => {
    const countdownBadge = getDaysRemaining(item.targetDate);
    const isUrgent = item.priority === "CRITICAL" || item.priority === "HIGH";

    return `
      <div class="radar-card glass-panel rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 ${isUrgent ? 'slot-active' : ''}">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="mono text-[10px] font-bold px-2.5 py-0.5 rounded ${isUrgent ? 'live-pill' : 'badge-theory'}">${item.category}</span>
            <span class="mono text-xs text-ochre">${item.subject}</span>
          </div>
          <h4 class="text-xl font-bold text-parchment">${item.title}</h4>
          <p class="text-xs sub-desc mono">${item.meta}</p>
        </div>

        <div class="sm:text-right shrink-0 flex sm:flex-col justify-between items-center sm:items-end pt-3 sm:pt-0 divider-top">
          <span class="mono text-xs font-bold px-3 py-1 rounded-full badge-lab">${countdownBadge}</span>
          <span class="mono text-xs text-ochre mt-1.5">Date: ${item.targetDate}</span>
        </div>
      </div>
    `;
  }).join("");

  animateCardsInSelector(".radar-card");
}

function mapCodeToSubjectId(code) {
  const c = code.toUpperCase();
  if (c.startsWith("PHY")) return "PHY";
  if (c.startsWith("CHE")) return "CHE";
  if (c.startsWith("H.M")) return "MATH";
  if (c.startsWith("BIO")) return "BIO";
  if (c.startsWith("E-")) return "ENG";
  if (c.startsWith("B-")) return "BAN";
  if (c.startsWith("ICT")) return "ICT";
  return "OTHER";
}

function loadAttendanceLogs() {
  try {
    const raw = localStorage.getItem(ATTENDANCE_LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveAttendanceLogs(logs) {
  try {
    localStorage.setItem(ATTENDANCE_LOG_KEY, JSON.stringify(logs));
  } catch (e) {}
}

function getSelectedAttendanceDate() {
  const d = new Date();
  d.setDate(d.getDate() + attendanceDateOffset);
  while (d.getDay() === 5 || d.getDay() === 6) {
    d.setDate(d.getDate() - 1);
    attendanceDateOffset -= 1;
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return {
    dateKey: `${yyyy}-${mm}-${dd}`,
    dayName: days[d.getDay()],
    formatted: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  };
}

function changeAttendanceDate(step) {
  attendanceDateOffset += step;
  const d = new Date();
  d.setDate(d.getDate() + attendanceDateOffset);
  if (step < 0) {
    while (d.getDay() === 5 || d.getDay() === 6) {
      d.setDate(d.getDate() - 1);
      attendanceDateOffset -= 1;
    }
  } else if (step > 0) {
    while (d.getDay() === 5 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1);
      attendanceDateOffset += 1;
    }
  }
  if (attendanceDateOffset > 0) {
    attendanceDateOffset = 0;
  }
  renderAttendanceView();
}

function jumpToTodayAttendance() {
  attendanceDateOffset = 0;
  renderAttendanceView();
}

function togglePeriodStatus(dateKey, slotIndex, statusValue) {
  const logs = loadAttendanceLogs();
  const recordKey = `${dateKey}__${slotIndex}`;
  const dateObj = getSelectedAttendanceDate();
  const daySlots = (ROUTINE_DATA[dateObj.dayName] || []).filter(s => s.type !== "break");
  const slot = daySlots[slotIndex];
  if (!slot) return;

  if (logs[recordKey] && logs[recordKey].status === statusValue) {
    delete logs[recordKey];
  } else {
    logs[recordKey] = {
      dateKey: dateKey,
      dayName: dateObj.dayName,
      formattedDate: dateObj.formatted,
      slotIndex: slotIndex,
      period: slot.period,
      time: `${formatClockTime(slot.start)} - ${formatClockTime(slot.end)}`,
      code: slot.code,
      title: slot.title,
      teacher: slot.teacher,
      subjectId: mapCodeToSubjectId(slot.code),
      status: statusValue
    };
  }

  saveAttendanceLogs(logs);
  renderAttendanceView();
}

function markAllDayPresent() {
  const logs = loadAttendanceLogs();
  const dateObj = getSelectedAttendanceDate();
  const daySlots = (ROUTINE_DATA[dateObj.dayName] || []).filter(s => s.type !== "break");

  daySlots.forEach((slot, idx) => {
    const recordKey = `${dateObj.dateKey}__${idx}`;
    logs[recordKey] = {
      dateKey: dateObj.dateKey,
      dayName: dateObj.dayName,
      formattedDate: dateObj.formatted,
      slotIndex: idx,
      period: slot.period,
      time: `${formatClockTime(slot.start)} - ${formatClockTime(slot.end)}`,
      code: slot.code,
      title: slot.title,
      teacher: slot.teacher,
      subjectId: mapCodeToSubjectId(slot.code),
      status: "present"
    };
  });

  saveAttendanceLogs(logs);
  renderAttendanceView();
}

function getAttendanceAdvice(present, total) {
  if (total === 0) {
    return { statusText: "No classes marked yet", isSafe: true };
  }
  const pct = (present / total) * 100;
  if (pct >= 75) {
    const canMiss = Math.floor((present - 0.75 * total) / 0.75);
    if (canMiss >= 1) {
      return { statusText: `Safe! Can miss next ${canMiss} class${canMiss > 1 ? 'es' : ''}`, isSafe: true };
    }
    return { statusText: "On 75% Borderline — Attend next class", isSafe: true };
  } else {
    const needToAttend = Math.ceil((0.75 * total - present) / 0.25);
    return { statusText: `Shortage! Attend next ${needToAttend} class${needToAttend > 1 ? 'es' : ''}`, isSafe: false };
  }
}

function resetAllAttendance() {
  if (confirm("Clear all your saved attendance history?")) {
    localStorage.removeItem(ATTENDANCE_LOG_KEY);
    renderAttendanceView();
  }
}

function renderAttendanceView() {
  const logs = loadAttendanceLogs();
  const dateObj = getSelectedAttendanceDate();
  const daySlots = (ROUTINE_DATA[dateObj.dayName] || []).filter(s => s.type !== "break");

  let overallPresent = 0;
  let overallTotal = 0;
  const subjectStats = {};
  ATTENDANCE_SUBJECTS.forEach(s => {
    subjectStats[s.id] = { present: 0, total: 0, recentLogs: [] };
  });

  Object.values(logs).forEach(entry => {
    overallTotal += 1;
    if (entry.status === "present") overallPresent += 1;
    if (subjectStats[entry.subjectId]) {
      subjectStats[entry.subjectId].total += 1;
      if (entry.status === "present") {
        subjectStats[entry.subjectId].present += 1;
      }
      subjectStats[entry.subjectId].recentLogs.push(entry);
    }
  });

  const overallPct = overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 100;
  const overallAdvice = getAttendanceAdvice(overallPresent, overallTotal);

  const summaryEl = document.getElementById("attendance-summary");
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 slot-active">
        <div>
          <p class="mono text-[11px] uppercase tracking-wider text-ochre">OVERALL ATTENDANCE (75% TARGET)</p>
          <h3 class="text-2xl sm:text-3xl font-bold text-parchment mt-1">${overallTotal > 0 ? overallPct + '% Present' : '0 Classes Marked'}</h3>
          <p class="text-xs sub-desc mono mt-1">Present: ${overallPresent} of ${overallTotal} Classes • ${overallAdvice.statusText}</p>
        </div>
        <button onclick="resetAllAttendance()" class="mono text-xs px-3.5 py-2 rounded-xl glass-panel text-ochre hover:text-parchment self-start sm:self-center">
          Reset All
        </button>
      </div>
    `;
  }

  const dailyBoxEl = document.getElementById("attendance-daily-box");
  if (dailyBoxEl) {
    const periodRows = daySlots.map((slot, idx) => {
      const recordKey = `${dateObj.dateKey}__${idx}`;
      const saved = logs[recordKey];
      const isPresent = saved && saved.status === "present";
      const isAbsent = saved && saved.status === "absent";

      return `
        <div class="glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isPresent ? 'slot-active' : isAbsent ? 'slot-absent' : ''}">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="mono text-xs font-bold px-2.5 py-0.5 rounded badge-lab">${slot.period} Period</span>
              <span class="mono text-xs text-ochre">${formatClockTime(slot.start)} - ${formatClockTime(slot.end)}</span>
              ${isPresent ? `<span class="mono text-[10px] font-bold px-2 py-0.5 rounded live-pill">MARKED PRESENT</span>` : ''}
              ${isAbsent ? `<span class="mono text-[10px] font-bold px-2 py-0.5 rounded badge-break">MARKED ABSENT</span>` : ''}
            </div>
            <p class="text-base font-bold text-parchment pt-0.5">${slot.code} — ${slot.title}</p>
            <p class="mono text-xs sub-desc">Teacher: ${slot.teacher} • Day: ${dateObj.dayName}</p>
          </div>

          <div class="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 divider-top">
            <button onclick="togglePeriodStatus('${dateObj.dateKey}', ${idx}, 'present')" 
              class="flex-1 sm:flex-none mono text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${isPresent ? 'tab-btn-active shadow-md' : 'glass-panel tab-btn-idle'}">
              ${isPresent ? '✓ Present' : 'Present'}
            </button>
            <button onclick="togglePeriodStatus('${dateObj.dateKey}', ${idx}, 'absent')" 
              class="flex-1 sm:flex-none mono text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${isAbsent ? 'btn-absent-active' : 'glass-panel tab-btn-idle'}">
              ${isAbsent ? '✕ Absent' : 'Absent'}
            </button>
          </div>
        </div>
      `;
    }).join("");

    dailyBoxEl.innerHTML = `
      <div class="glass-panel rounded-2xl p-4 sm:p-6 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 divider-row">
          <div>
            <span class="mono text-[10px] uppercase tracking-widest text-ochre">SELECT CLASS DATE</span>
            <h4 class="text-xl font-bold text-parchment mt-0.5">${dateObj.formatted} (${dateObj.dayName})</h4>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="changeAttendanceDate(-1)" class="mono text-xs px-3 py-2 rounded-xl glass-panel text-parchment active:scale-95">
              ◀ Prev Day
            </button>
            <button onclick="jumpToTodayAttendance()" class="mono text-xs px-3 py-2 rounded-xl ${attendanceDateOffset === 0 ? 'tab-btn-active font-bold' : 'glass-panel text-ochre'}">
              Today
            </button>
            <button onclick="changeAttendanceDate(1)" class="mono text-xs px-3 py-2 rounded-xl glass-panel text-parchment ${attendanceDateOffset >= 0 ? 'opacity-40 pointer-events-none' : 'active:scale-95'}">
              Next Day ▶
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <p class="mono text-xs text-ochre">Tap Present or Absent for each period below:</p>
          <button onclick="markAllDayPresent()" class="mono text-xs font-bold px-3 py-1.5 rounded-lg badge-lab active:scale-95">
            + Mark All Present
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3">
          ${periodRows}
        </div>
      </div>

      <div class="pt-4">
        <p class="mono text-xs uppercase tracking-[0.15em] text-ochre">SUBJECT-WISE 75% BREAKDOWN</p>
        <h3 class="text-xl font-bold text-parchment mt-1">Your Subject Totals</h3>
      </div>
    `;
  }

  const gridEl = document.getElementById("attendance-grid");
  if (gridEl) {
    gridEl.innerHTML = ATTENDANCE_SUBJECTS.map(sub => {
      const st = subjectStats[sub.id] || { present: 0, total: 0, recentLogs: [] };
      const pct = st.total > 0 ? Math.round((st.present / st.total) * 100) : 100;
      const advice = getAttendanceAdvice(st.present, st.total);

      const lastTwo = st.recentLogs.slice(-2).reverse().map(l => 
        `<span class="mono text-[10px] px-2 py-0.5 rounded ${l.status === 'present' ? 'badge-lab' : 'badge-break'}">${l.formattedDate.split(',')[0]} (${l.period}): ${l.status === 'present' ? 'P' : 'A'}</span>`
      ).join("");

      return `
        <div class="att-card glass-panel rounded-2xl p-5 flex flex-col justify-between gap-3 ${!advice.isSafe ? 'slot-active' : ''}">
          <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="mono text-[10px] uppercase tracking-wider text-ochre">${sub.codes} • Teacher: ${sub.teacher}</span>
                <h4 class="text-base font-bold text-parchment mt-0.5">${sub.name}</h4>
              </div>
              <span class="mono text-xl font-bold instructor-code">${st.total > 0 ? pct + '%' : '—'}</span>
            </div>

            <div class="w-full h-2 rounded-full overflow-hidden divider-row bg-black/30">
              <div class="h-full transition-all duration-500" style="width: ${st.total > 0 ? pct : 0}%; background-color: var(--gold);"></div>
            </div>

            <div class="flex items-center justify-between mono text-xs pt-1">
              <span class="sub-desc">Present: <strong class="text-parchment">${st.present}</strong> / ${st.total}</span>
              <span class="text-[11px] font-semibold ${advice.isSafe ? 'text-ochre' : 'live-pill px-2 py-0.5 rounded'}">${advice.statusText}</span>
            </div>
          </div>

          ${lastTwo ? `<div class="flex flex-wrap gap-1.5 pt-2 divider-top-always">${lastTwo}</div>` : ''}
        </div>
      `;
    }).join("");
  }
}

function renderNotesGrid() {
  const container = document.getElementById("notes-grid");
  if (!container) return;

  container.innerHTML = STUDY_NOTES.map(item => `
    <div class="notes-card glass-panel rounded-2xl p-6 flex flex-col justify-between gap-4 slot-card">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="mono text-[10px] font-bold px-2.5 py-0.5 rounded badge-lab">${item.category}</span>
          <span class="mono text-xs text-ochre">${item.subject}</span>
        </div>
        <h4 class="text-xl font-bold text-parchment">${item.title}</h4>
          <p class="text-xs sub-desc mono">${item.meta}</p>
        </div>

        <div class="sm:text-right shrink-0 flex sm:flex-col justify-between items-center sm:items-end pt-3 sm:pt-0 divider-top">
          <span class="mono text-xs font-bold px-3 py-1 rounded-full badge-lab">${countdownBadge}</span>
          <span class="mono text-xs text-ochre mt-1.5">Date: ${item.targetDate}</span>
        </div>
      </div>
    `;
  }).join("");

  animateCardsInSelector(".radar-card");
}

function mapCodeToSubjectId(code) {
  const c = code.toUpperCase();
  if (c.startsWith("PHY")) return "PHY";
  if (c.startsWith("CHE")) return "CHE";
  if (c.startsWith("H.M")) return "MATH";
  if (c.startsWith("BIO")) return "BIO";
  if (c.startsWith("E-")) return "ENG";
  if (c.startsWith("B-")) return "BAN";
  if (c.startsWith("ICT")) return "ICT";
  return "OTHER";
}

function loadAttendanceLogs() {
  try {
    const raw = localStorage.getItem(ATTENDANCE_LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveAttendanceLogs(logs) {
  try {
    localStorage.setItem(ATTENDANCE_LOG_KEY, JSON.stringify(logs));
  } catch (e) {}
}

function getSelectedAttendanceDate() {
  const d = new Date();
  d.setDate(d.getDate() + attendanceDateOffset);
  while (d.getDay() === 5 || d.getDay() === 6) {
    d.setDate(d.getDate() - 1);
    attendanceDateOffset -= 1;
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return {
    dateKey: `${yyyy}-${mm}-${dd}`,
    dayName: days[d.getDay()],
    formatted: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  };
}

function changeAttendanceDate(step) {
  attendanceDateOffset += step;
  const d = new Date();
  d.setDate(d.getDate() + attendanceDateOffset);
  if (step < 0) {
    while (d.getDay() === 5 || d.getDay() === 6) {
      d.setDate(d.getDate() - 1);
      attendanceDateOffset -= 1;
    }
  } else if (step > 0) {
    while (d.getDay() === 5 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1);
      attendanceDateOffset += 1;
    }
  }
  if (attendanceDateOffset > 0) {
    attendanceDateOffset = 0;
  }
  renderAttendanceView();
}

function jumpToTodayAttendance() {
  attendanceDateOffset = 0;
  renderAttendanceView();
}

function togglePeriodStatus(dateKey, slotIndex, statusValue) {
  const logs = loadAttendanceLogs();
  const recordKey = `${dateKey}__${slotIndex}`;
  const dateObj = getSelectedAttendanceDate();
  const daySlots = (ROUTINE_DATA[dateObj.dayName] || []).filter(s => s.type !== "break");
  const slot = daySlots[slotIndex];
  if (!slot) return;

  if (logs[recordKey] && logs[recordKey].status === statusValue) {
    delete logs[recordKey];
  } else {
    logs[recordKey] = {
      dateKey: dateKey,
      dayName: dateObj.dayName,
      formattedDate: dateObj.formatted,
      slotIndex: slotIndex,
      period: slot.period,
      time: `${formatClockTime(slot.start)} - ${formatClockTime(slot.end)}`,
      code: slot.code,
      title: slot.title,
      teacher: slot.teacher,
      subjectId: mapCodeToSubjectId(slot.code),
      status: statusValue
    };
  }

  saveAttendanceLogs(logs);
  renderAttendanceView();
}

function markAllDayPresent() {
  const logs = loadAttendanceLogs();
  const dateObj = getSelectedAttendanceDate();
  const daySlots = (ROUTINE_DATA[dateObj.dayName] || []).filter(s => s.type !== "break");

  daySlots.forEach((slot, idx) => {
    const recordKey = `${dateObj.dateKey}__${idx}`;
    logs[recordKey] = {
      dateKey: dateObj.dateKey,
      dayName: dateObj.dayName,
      formattedDate: dateObj.formatted,
      slotIndex: idx,
      period: slot.period,
      time: `${formatClockTime(slot.start)} - ${formatClockTime(slot.end)}`,
      code: slot.code,
      title: slot.title,
      teacher: slot.teacher,
      subjectId: mapCodeToSubjectId(slot.code),
      status: "present"
    };
  });

  saveAttendanceLogs(logs);
  renderAttendanceView();
}

function getAttendanceAdvice(present, total) {
  if (total === 0) {
    return { statusText: "No classes marked yet", isSafe: true };
  }
  const pct = (present / total) * 100;
  if (pct >= 75) {
    const canMiss = Math.floor((present - 0.75 * total) / 0.75);
    if (canMiss >= 1) {
      return { statusText: `Safe! Can miss next ${canMiss} class${canMiss > 1 ? 'es' : ''}`, isSafe: true };
    }
    return { statusText: "On 75% Borderline — Attend next class", isSafe: true };
  } else {
    const needToAttend = Math.ceil((0.75 * total - present) / 0.25);
    return { statusText: `Shortage! Attend next ${needToAttend} class${needToAttend > 1 ? 'es' : ''}`, isSafe: false };
  }
}

function resetAllAttendance() {
  if (confirm("Clear all your saved attendance history?")) {
    localStorage.removeItem(ATTENDANCE_LOG_KEY);
    renderAttendanceView();
  }
}

function renderAttendanceView() {
  const logs = loadAttendanceLogs();
  const dateObj = getSelectedAttendanceDate();
  const daySlots = (ROUTINE_DATA[dateObj.dayName] || []).filter(s => s.type !== "break");

  let overallPresent = 0;
  let overallTotal = 0;
  const subjectStats = {};
  ATTENDANCE_SUBJECTS.forEach(s => {
    subjectStats[s.id] = { present: 0, total: 0, recentLogs: [] };
  });

  Object.values(logs).forEach(entry => {
    overallTotal += 1;
    if (entry.status === "present") overallPresent += 1;
    if (subjectStats[entry.subjectId]) {
      subjectStats[entry.subjectId].total += 1;
      if (entry.status === "present") {
        subjectStats[entry.subjectId].present += 1;
      }
      subjectStats[entry.subjectId].recentLogs.push(entry);
    }
  });

  const overallPct = overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 100;
  const overallAdvice = getAttendanceAdvice(overallPresent, overallTotal);

  const summaryEl = document.getElementById("attendance-summary");
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 slot-active">
        <div>
          <p class="mono text-[11px] uppercase tracking-wider text-ochre">OVERALL ATTENDANCE (75% TARGET)</p>
          <h3 class="text-2xl sm:text-3xl font-bold text-parchment mt-1">${overallTotal > 0 ? overallPct + '% Present' : '0 Classes Marked'}</h3>
          <p class="text-xs sub-desc mono mt-1">Present: ${overallPresent} of ${overallTotal} Classes • ${overallAdvice.statusText}</p>
        </div>
        <button onclick="resetAllAttendance()" class="mono text-xs px-3.5 py-2 rounded-xl glass-panel text-ochre hover:text-parchment self-start sm:self-center">
          Reset All
        </button>
      </div>
    `;
  }

  const dailyBoxEl = document.getElementById("attendance-daily-box");
  if (dailyBoxEl) {
    const periodRows = daySlots.map((slot, idx) => {
      const recordKey = `${dateObj.dateKey}__${idx}`;
      const saved = logs[recordKey];
      const isPresent = saved && saved.status === "present";
      const isAbsent = saved && saved.status === "absent";

      return `
        <div class="glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isPresent ? 'slot-active' : isAbsent ? 'slot-absent' : ''}">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="mono text-xs font-bold px-2.5 py-0.5 rounded badge-lab">${slot.period} Period</span>
              <span class="mono text-xs text-ochre">${formatClockTime(slot.start)} - ${formatClockTime(slot.end)}</span>
              ${isPresent ? `<span class="mono text-[10px] font-bold px-2 py-0.5 rounded live-pill">MARKED PRESENT</span>` : ''}
              ${isAbsent ? `<span class="mono text-[10px] font-bold px-2 py-0.5 rounded badge-break">MARKED ABSENT</span>` : ''}
            </div>
            <p class="text-base font-bold text-parchment pt-0.5">${slot.code} — ${slot.title}</p>
            <p class="mono text-xs sub-desc">Teacher: ${slot.teacher} • Day: ${dateObj.dayName}</p>
          </div>

          <div class="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 divider-top">
            <button onclick="togglePeriodStatus('${dateObj.dateKey}', ${idx}, 'present')" 
              class="flex-1 sm:flex-none mono text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${isPresent ? 'tab-btn-active shadow-md' : 'glass-panel tab-btn-idle'}">
              ${isPresent ? '✓ Present' : 'Present'}
            </button>
            <button onclick="togglePeriodStatus('${dateObj.dateKey}', ${idx}, 'absent')" 
              class="flex-1 sm:flex-none mono text-xs font-semibold px-4 py-2.5 rounded-xl transition-all ${isAbsent ? 'btn-absent-active' : 'glass-panel tab-btn-idle'}">
              ${isAbsent ? '✕ Absent' : 'Absent'}
            </button>
          </div>
        </div>
      `;
    }).join("");

    dailyBoxEl.innerHTML = `
      <div class="glass-panel rounded-2xl p-4 sm:p-6 space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 divider-row">
          <div>
            <span class="mono text-[10px] uppercase tracking-widest text-ochre">SELECT CLASS DATE</span>
            <h4 class="text-xl font-bold text-parchment mt-0.5">${dateObj.formatted} (${dateObj.dayName})</h4>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="changeAttendanceDate(-1)" class="mono text-xs px-3 py-2 rounded-xl glass-panel text-parchment active:scale-95">
              ◀ Prev Day
            </button>
            <button onclick="jumpToTodayAttendance()" class="mono text-xs px-3 py-2 rounded-xl ${attendanceDateOffset === 0 ? 'tab-btn-active font-bold' : 'glass-panel text-ochre'}">
              Today
            </button>
            <button onclick="changeAttendanceDate(1)" class="mono text-xs px-3 py-2 rounded-xl glass-panel text-parchment ${attendanceDateOffset >= 0 ? 'opacity-40 pointer-events-none' : 'active:scale-95'}">
              Next Day ▶
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <p class="mono text-xs text-ochre">Tap Present or Absent for each period below:</p>
          <button onclick="markAllDayPresent()" class="mono text-xs font-bold px-3 py-1.5 rounded-lg badge-lab active:scale-95">
            + Mark All Present
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3">
          ${periodRows}
        </div>
      </div>

      <div class="pt-4">
        <p class="mono text-xs uppercase tracking-[0.15em] text-ochre">SUBJECT-WISE 75% BREAKDOWN</p>
        <h3 class="text-xl font-bold text-parchment mt-1">Your Subject Totals</h3>
      </div>
    `;
  }

  const gridEl = document.getElementById("attendance-grid");
  if (gridEl) {
    gridEl.innerHTML = ATTENDANCE_SUBJECTS.map(sub => {
      const st = subjectStats[sub.id] || { present: 0, total: 0, recentLogs: [] };
      const pct = st.total > 0 ? Math.round((st.present / st.total) * 100) : 100;
      const advice = getAttendanceAdvice(st.present, st.total);

      const lastTwo = st.recentLogs.slice(-2).reverse().map(l => 
        `<span class="mono text-[10px] px-2 py-0.5 rounded ${l.status === 'present' ? 'badge-lab' : 'badge-break'}">${l.formattedDate.split(',')[0]} (${l.period}): ${l.status === 'present' ? 'P' : 'A'}</span>`
      ).join("");

      return `
        <div class="att-card glass-panel rounded-2xl p-5 flex flex-col justify-between gap-3 ${!advice.isSafe ? 'slot-active' : ''}">
          <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="mono text-[10px] uppercase tracking-wider text-ochre">${sub.codes} • Teacher: ${sub.teacher}</span>
                <h4 class="text-base font-bold text-parchment mt-0.5">${sub.name}</h4>
              </div>
              <span class="mono text-xl font-bold instructor-code">${st.total > 0 ? pct + '%' : '—'}</span>
            </div>

            <div class="w-full h-2 rounded-full overflow-hidden divider-row bg-black/30">
              <div class="h-full transition-all duration-500" style="width: ${st.total > 0 ? pct : 0}%; background-color: var(--gold);"></div>
            </div>

            <div class="flex items-center justify-between mono text-xs pt-1">
              <span class="sub-desc">Present: <strong class="text-parchment">${st.present}</strong> / ${st.total}</span>
              <span class="text-[11px] font-semibold ${advice.isSafe ? 'text-ochre' : 'live-pill px-2 py-0.5 rounded'}">${advice.statusText}</span>
            </div>
          </div>

          ${lastTwo ? `<div class="flex flex-wrap gap-1.5 pt-2 divider-top-always">${lastTwo}</div>` : ''}
        </div>
      `;
    }).join("");
  }
}

function renderNotesGrid() {
  const container = document.getElementById("notes-grid");
  if (!container) return;

  container.innerHTML = STUDY_NOTES.map(item => `
    <div class="notes-card glass-panel rounded-2xl p-6 flex flex-col justify-between gap-4 slot-card">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="mono text-[10px] font-bold px-2.5 py-0.5 rounded badge-lab">${item.category}</span>
          <span class="mono text-xs text-ochre">${item.subject}</span>
        </div>
        <h4 class="text-lg font-bold text-parchment">${item.title}</h4>
        <p class="text-xs sub-desc mono">${item.info}</p>
      </div>
      <div class="pt-3 divider-top-always flex justify-end">
        <a href="${item.link}" target="_blank" class="mono text-xs font-bold px-4 py-2 rounded-lg tab-btn-active">
          Open / Download PDF →
        </a>
      </div>
    </div>
  `).join("");

  animateCardsInSelector(".notes-card");
}

function updateDashboard() {
  const now = new Date();
  const dateEl = document.getElementById("live-date");
  const clockEl = document.getElementById("live-clock");
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric"
    });
  }
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString("en-US", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  }

  const state = getLiveRoutineState(now);
  const displayDay = selectedDayOverride || state.previewDay || state.day;

  const badge = document.getElementById("hero-status-badge");
  const periodTag = document.getElementById("hero-period-tag");
  const subLabel = document.getElementById("hero-sub-label");
  const codeEl = document.getElementById("hero-subject-code");
  const titleEl = document.getElementById("hero-subject-title");
  const timerLabel = document.getElementById("hero-timer-label");
  const countdownEl = document.getElementById("hero-countdown");
  const teacherEl = document.getElementById("hero-teacher");
  const windowEl = document.getElementById("hero-time-window");
  const progWrap = document.getElementById("hero-progress-wrapper");
  const progBar = document.getElementById("hero-progress-bar");
  const progText = document.getElementById("hero-progress-text");
  const nextUpEl = document.getElementById("hero-next-up");

  if (state.status === "LIVE_SESSION") {
    const s = state.activeSlot;
    badge.textContent = s.type === "break" ? "TIFFIN BREAK NOW" : "CLASS RUNNING NOW";
    periodTag.textContent = `${s.period.toUpperCase()} PERIOD`;
    subLabel.textContent = s.type === "practical" ? "PRACTICAL LAB (70 MINS)" : "CURRENT SUBJECT";
    codeEl.textContent = s.code;
    titleEl.textContent = s.title;
    timerLabel.textContent = "CLASS ENDS IN";
    countdownEl.textContent = state.countdown;
    teacherEl.textContent = `TEACHER: ${s.teacher}`;
    windowEl.textContent = `${formatClockTime(s.start)} – ${formatClockTime(s.end)}`;
    progWrap.style.display = "block";
    progBar.style.width = `${state.progress}%`;
    progText.textContent = `${state.progress}% COMPLETED`;
    nextUpEl.textContent = state.nextSlot ? `NEXT CLASS: ${state.nextSlot.code} (${state.nextSlot.teacher})` : "LAST CLASS OF TODAY";
  } else if (state.status === "PRE_COLLEGE") {
    const first = state.nextSlot;
    badge.textContent = "MORNING COUNTDOWN";
    periodTag.textContent = state.day.toUpperCase();
    subLabel.textContent = state.headline;
    codeEl.textContent = first.code;
    titleEl.textContent = `1st Class: ${first.title}`;
    timerLabel.textContent = "CLASS STARTS IN";
    countdownEl.textContent = state.countdown;
    teacherEl.textContent = `TEACHER: ${first.teacher}`;
    windowEl.textContent = `${formatClockTime(first.start)} – ${formatClockTime(first.end)}`;
    progWrap.style.display = "none";
  } else {
    badge.textContent = state.status === "WEEKEND" ? "WEEKEND HOLIDAY" : "COLLEGE OVER FOR TODAY";
    periodTag.textContent = `NEXT: ${state.previewDay.toUpperCase()}`;
    subLabel.textContent = state.headline;
    codeEl.textContent = "10:00 AM";
    titleEl.textContent = state.subtext;
    timerLabel.textContent = "1ST CLASS NEXT DAY";
    countdownEl.textContent = state.schedule[0].code;
    teacherEl.textContent = `TEACHER: ${state.schedule[0].teacher}`;
    windowEl.textContent = "10:00 AM – 03:00 PM";
    progWrap.style.display = "none";
  }

  const currentSignature = `${displayDay}-${state.status}-${state.activeIndex || -1}`;
  if (currentSignature !== lastRenderedSignature && activeView === "routine") {
    lastRenderedSignature = currentSignature;
    renderDayTabs(displayDay);

    const scheduleToRender = ROUTINE_DATA[displayDay] || ROUTINE_DATA.Sunday;
    document.getElementById("schedule-heading").textContent = `${displayDay}'s Full Routine`;

    const stackEl = document.getElementById("routine-stack");
    stackEl.innerHTML = scheduleToRender.map((item, idx) => {
      const isCurrent = state.status === "LIVE_SESSION" && state.day === displayDay && state.activeIndex === idx;
      const typeBadge = item.type === "practical" 
        ? `<span class="mono text-[10px] px-2.5 py-0.5 rounded badge-lab">PRACTICAL • 70 MINS</span>`
        : item.type === "break"
        ? `<span class="mono text-[10px] px-2.5 py-0.5 rounded badge-break">BREAK • 30 MINS</span>`
        : `<span class="mono text-[10px] px-2.5 py-0.5 rounded badge-theory">CLASS</span>`;

      return `
        <div class="routine-slot-card slot-card glass-panel rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isCurrent ? 'slot-active' : ''}">
          <div class="flex items-start sm:items-center gap-4">
            <div class="mono text-xs w-28 shrink-0 period-col">
              <p class="font-bold period-title">${item.period} Period</p>
              <p class="opacity-75">${formatClockTime(item.start)} - ${formatClockTime(item.end)}</p>
            </div>
            <div class="space-y-1 pl-4 divider-left">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="text-xl font-bold tracking-tight code-title">${item.code}</span>
                ${typeBadge}
                ${isCurrent ? `<span class="mono text-[10px] font-bold px-2 py-0.5 rounded live-pill">RUNNING NOW</span>` : ''}
              </div>
              <p class="text-sm sub-desc">${item.title}</p>
            </div>
          </div>
          <div onclick="jumpToFaculty('${item.teacher}')" class="cursor-pointer sm:text-right flex sm:flex-col justify-between items-center sm:items-end pt-3 sm:pt-0 divider-top group">
            <span class="mono text-[11px] uppercase tracking-wider instructor-label">TEACHER</span>
            <span class="mono text-sm font-bold instructor-code group-hover:underline">${item.teacher} →</span>
          </div>
        </div>
      `;
    }).join("");

    animateCardsInSelector(".routine-slot-card");
  }
}

function jumpToFaculty(teacherCode) {
  if (!teacherCode || teacherCode === "—") return;
  const searchInput = document.getElementById("faculty-search");
  if (searchInput) {
    searchInput.value = teacherCode;
  }
  switchAppView("faculty");
}

window.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initHeroTilt();
  updateDashboard();
  setInterval(updateDashboard, 1000);

  const searchInput = document.getElementById("faculty-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderFacultyGrid(e.target.value);
    });
  }
});
