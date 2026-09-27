const DAYS_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
let selectedDayOverride = null;
let lastRenderedSignature = "";

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

function animateRoutineStack() {
  const cards = document.querySelectorAll(".slot-card");
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(cards, {
      max: 7,
      speed: 450,
      glare: true,
      "max-glare": 0.12,
      perspective: 1000
    });
  }

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach(t => t.kill());

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 65,
          z: -140,
          rotateX: 22,
          scale: 0.92,
          transformPerspective: 1100
        },
        {
          opacity: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.75,
          delay: index * 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            end: "bottom 12%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }
}

function renderDayTabs(activeDay) {
  const container = document.getElementById("day-switcher");
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

function updateDashboard() {
  const now = new Date();
  document.getElementById("live-date").textContent = now.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric"
  });
  document.getElementById("live-clock").textContent = now.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });

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
    badge.textContent = s.type === "break" ? "REFRESHMENT WINDOW" : "SESSION IN PROGRESS";
    periodTag.textContent = `${s.period.toUpperCase()} PERIOD`;
    subLabel.textContent = s.type === "practical" ? "70-MINUTE PRACTICAL LAB" : "ACTIVE LECTURE";
    codeEl.textContent = s.code;
    titleEl.textContent = s.title;
    timerLabel.textContent = "TIME REMAINING";
    countdownEl.textContent = state.countdown;
    teacherEl.textContent = `FACULTY: ${s.teacher}`;
    windowEl.textContent = `${formatClockTime(s.start)} – ${formatClockTime(s.end)}`;
    progWrap.style.display = "block";
    progBar.style.width = `${state.progress}%`;
    progText.textContent = `${state.progress}% ELAPSED`;
    nextUpEl.textContent = state.nextSlot ? `NEXT: ${state.nextSlot.code} (${state.nextSlot.teacher})` : "FINAL PERIOD OF DAY";
  } else if (state.status === "PRE_COLLEGE") {
    const first = state.nextSlot;
    badge.textContent = "STANDBY MODE";
    periodTag.textContent = state.day.toUpperCase();
    subLabel.textContent = state.headline;
    codeEl.textContent = first.code;
    titleEl.textContent = `Opening Lecture: ${first.title}`;
    timerLabel.textContent = "DOORS OPEN IN";
    countdownEl.textContent = state.countdown;
    teacherEl.textContent = `FACULTY: ${first.teacher}`;
    windowEl.textContent = `${formatClockTime(first.start)} – ${formatClockTime(first.end)}`;
    progWrap.style.display = "none";
  } else {
    badge.textContent = state.status === "WEEKEND" ? "OFF-GRID / WEEKEND" : "DAY CONCLUDED";
    periodTag.textContent = `NEXT: ${state.previewDay.toUpperCase()}`;
    subLabel.textContent = state.headline;
    codeEl.textContent = "10:00 AM";
    titleEl.textContent = state.subtext;
    timerLabel.textContent = "FIRST SLOT";
    countdownEl.textContent = state.schedule[0].code;
    teacherEl.textContent = `FACULTY: ${state.schedule[0].teacher}`;
    windowEl.textContent = "10:00 AM – 03:00 PM";
    progWrap.style.display = "none";
  }

  const currentSignature = `${displayDay}-${state.status}-${state.activeIndex || -1}`;
  if (currentSignature !== lastRenderedSignature) {
    lastRenderedSignature = currentSignature;
    renderDayTabs(displayDay);

    const scheduleToRender = ROUTINE_DATA[displayDay] || ROUTINE_DATA.Sunday;
    document.getElementById("schedule-heading").textContent = `${displayDay} Sequence`;

    const stackEl = document.getElementById("routine-stack");
    stackEl.innerHTML = scheduleToRender.map((item, idx) => {
      const isCurrent = state.status === "LIVE_SESSION" && state.day === displayDay && state.activeIndex === idx;
      const typeBadge = item.type === "practical" 
        ? `<span class="mono text-[10px] px-2.5 py-0.5 rounded badge-lab">LAB • 70M</span>`
        : item.type === "break"
        ? `<span class="mono text-[10px] px-2.5 py-0.5 rounded badge-break">BREAK • 30M</span>`
        : `<span class="mono text-[10px] px-2.5 py-0.5 rounded badge-theory">THEORY</span>`;

      return `
        <div class="slot-card glass-panel rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isCurrent ? 'slot-active' : ''}">
          <div class="flex items-start sm:items-center gap-4">
            <div class="mono text-xs w-24 shrink-0 period-col">
              <p class="font-bold period-title">${item.period}</p>
              <p class="opacity-70">${item.start} - ${item.end}</p>
            </div>
            <div class="space-y-1 pl-4 divider-left">
              <div class="flex flex-wrap items-center gap-2.5">
                <span class="text-xl font-bold tracking-tight code-title">${item.code}</span>
                ${typeBadge}
                ${isCurrent ? `<span class="mono text-[10px] font-bold px-2 py-0.5 rounded live-pill">LIVE NOW</span>` : ''}
              </div>
              <p class="text-sm sub-desc">${item.title}</p>
            </div>
          </div>
          <div class="sm:text-right flex sm:flex-col justify-between items-center sm:items-end pt-3 sm:pt-0 divider-top">
            <span class="mono text-[11px] uppercase tracking-wider instructor-label">INSTRUCTOR</span>
            <span class="mono text-sm font-bold instructor-code">${item.teacher}</span>
          </div>
        </div>
      `;
    }).join("");

    animateRoutineStack();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initHeroTilt();
  updateDashboard();
  setInterval(updateDashboard, 1000);
});
                                          
