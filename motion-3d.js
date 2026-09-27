const DAYS_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
let selectedDayOverride = null;
let lastRenderedSignature = "";
let activeView = "routine";
let facultyProfilesCache = [];

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
      max: 6,
      speed: 450,
      glare: true,
      "max-glare": 0.12,
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
          y: 55,
          z: -110,
          rotateX: 18,
          scale: 0.94,
          transformPerspective: 1100
        },
        {
          opacity: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.65,
          delay: index * 0.05,
          ease: "power3.out"
        }
      );
    });
  }
}

function switchAppView(viewName) {
  activeView = viewName;
  const sections = ["routine", "faculty", "radar"];
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
    timerLabel.textContent = "1ST CLASS TOMORROW";
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
