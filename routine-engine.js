const COLLEGE_META = {
  institution: "Sylhet Govt. Model School and College, Sylhet",
  batch: "Class XI (Science) - 2026",
  Palette: {
    parchment: "rgb(254, 244, 213)",
    lightGold: "rgb(241, 228, 154)",
    mutedOchre: "rgb(230, 209, 123)",
    darkEspresso: "rgb(44, 24, 16)"
  }
};

const ROUTINE_DATA = {
  Sunday: [
    { period: "1st", code: "ICT", title: "Information & Comm. Technology", teacher: "KA", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "E-2", title: "English 2nd Paper", teacher: "SY", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "H.M-1", title: "Higher Math 1st Paper", teacher: "TK", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "Bio-1", title: "Biology 1st Paper", teacher: "RB", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin & Refreshment Break", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th & 6th", code: "Phy-1 Lab", title: "Physics 1st Paper Practical", teacher: "HU", start: "13:16", end: "14:25", type: "practical" },
    { period: "7th", code: "B-1", title: "Bangla 1st Paper", teacher: "AT", start: "14:26", end: "15:00", type: "theory" }
  ],
  Monday: [
    { period: "1st", code: "Che-1", title: "Chemistry 1st Paper", teacher: "MZ", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "B-1", title: "Bangla 1st Paper", teacher: "AT", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "H.M-2", title: "Higher Math 2nd Paper", teacher: "NZ", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "E-2", title: "English 2nd Paper", teacher: "SY", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin & Refreshment Break", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th & 6th", code: "H.M-1 Lab", title: "Higher Math 1st Paper Practical", teacher: "DH", start: "13:16", end: "14:25", type: "practical" },
    { period: "7th", code: "Phy-2", title: "Physics 2nd Paper", teacher: "HU", start: "14:26", end: "15:00", type: "theory" }
  ],
  Tuesday: [
    { period: "1st", code: "Che-1", title: "Chemistry 1st Paper", teacher: "MZ", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "Bio-1", title: "Biology 1st Paper", teacher: "RB", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "E-1", title: "English 1st Paper", teacher: "MM", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "Phy-1", title: "Physics 1st Paper", teacher: "HU", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin & Refreshment Break", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th", code: "B-1", title: "Bangla 1st Paper", teacher: "AT", start: "13:16", end: "13:50", type: "theory" },
    { period: "6th", code: "H.M-2", title: "Higher Math 2nd Paper", teacher: "NZ", start: "13:51", end: "14:25", type: "theory" },
    { period: "7th", code: "Bio-2", title: "Biology 2nd Paper", teacher: "RB", start: "14:26", end: "15:00", type: "theory" }
  ],
  Wednesday: [
    { period: "1st", code: "B-2", title: "Bangla 2nd Paper", teacher: "JA", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "E-1", title: "English 1st Paper", teacher: "MM", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "H.M-1", title: "Higher Math 1st Paper", teacher: "TK", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "Phy-1", title: "Physics 1st Paper", teacher: "HU", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin & Refreshment Break", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th & 6th", code: "Che-1 Lab", title: "Chemistry 1st Paper Practical", teacher: "SK", start: "13:16", end: "14:25", type: "practical" },
    { period: "7th", code: "Che-2", title: "Chemistry 2nd Paper", teacher: "MF", start: "14:26", end: "15:00", type: "theory" }
  ],
  Thursday: [
    { period: "1st", code: "Phy-2", title: "Physics 2nd Paper", teacher: "HU", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "Che-2", title: "Chemistry 2nd Paper", teacher: "MF", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "B-2", title: "Bangla 2nd Paper", teacher: "JA", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "Bio-2", title: "Biology 2nd Paper", teacher: "RB", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin & Refreshment Break", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th & 6th", code: "Bio-1 Lab", title: "Biology 1st Paper Practical", teacher: "AAli", start: "13:16", end: "14:25", type: "practical" },
    { period: "7th", code: "E-1", title: "English 1st Paper", teacher: "MM", start: "14:26", end: "15:00", type: "theory" }
  ]
};

const FACULTY_DIRECTORY = {
  HU: { name: "Faculty Member (HU)", dept: "Department of Physics", role: "Theory & Lab Instructor" },
  RB: { name: "Faculty Member (RB)", dept: "Department of Biology", role: "Theory Instructor" },
  MZ: { name: "Faculty Member (MZ)", dept: "Department of Chemistry", role: "Paper-1 Instructor" },
  MF: { name: "Faculty Member (MF)", dept: "Department of Chemistry", role: "Paper-2 Instructor" },
  TK: { name: "Faculty Member (TK)", dept: "Department of Mathematics", role: "Higher Math-1 Instructor" },
  NZ: { name: "Faculty Member (NZ)", dept: "Department of Mathematics", role: "Higher Math-2 Instructor" },
  AT: { name: "Faculty Member (AT)", dept: "Department of Bangla", role: "Paper-1 Instructor" },
  JA: { name: "Faculty Member (JA)", dept: "Department of Bangla", role: "Paper-2 Instructor" },
  MM: { name: "Faculty Member (MM)", dept: "Department of English", role: "Paper-1 Instructor" },
  SY: { name: "Faculty Member (SY)", dept: "Department of English", role: "Paper-2 Instructor" },
  KA: { name: "Faculty Member (KA)", dept: "Department of ICT", role: "ICT Lecturer" },
  DH: { name: "Md. Delwar Hossain (DH)", dept: "Department of Mathematics", role: "H.M-1 Practical & Routine Committee" },
  SK: { name: "Faculty Member (SK)", dept: "Department of Chemistry", role: "Chemistry Lab Instructor" },
  AAli: { name: "Faculty Member (AAli)", dept: "Department of Biology", role: "Biology Lab Instructor" }
};

const RADAR_EVENTS = [
  {
    id: "RAD-01",
    category: "LAB SUBMISSION",
    subject: "Phy-1 & Che-1 Practical",
    title: "Lab Notebook Apparatus & Observation Sign-off",
    targetDate: "2026-10-04",
    priority: "HIGH",
    meta: "Bring covered practical copy during 5th-6th period lab slot"
  },
  {
    id: "RAD-02",
    category: "CLASS TEST",
    subject: "Higher Math 1st Paper (TK)",
    title: "Matrices & Determinants Introductory Quiz",
    targetDate: "2026-10-07",
    priority: "CRITICAL",
    meta: "Duration: 25 Mins • 3rd Period (11:26 AM)"
  },
  {
    id: "RAD-03",
    category: "CLASS TEST",
    subject: "Chemistry 1st Paper (MZ)",
    title: "Safe Use of Laboratory & Qualitative Chemistry",
    targetDate: "2026-10-12",
    priority: "NORMAL",
    meta: "1st Period (10:00 AM Sharp)"
  },
  {
    id: "RAD-04",
    category: "ACADEMIC NOTICE",
    subject: "SGMSC Science Batch '26",
    title: " Lab Group Division & Roll Verification",
    targetDate: "2026-09-30",
    priority: "HIGH",
    meta: "Check respective notice board before Tiffin break"
  }
];

function buildFacultyProfiles() {
  const profiles = {};
  Object.keys(ROUTINE_DATA).forEach(day => {
    ROUTINE_DATA[day].forEach(slot => {
      if (slot.type === "break" || slot.teacher === "—") return;
      const code = slot.teacher;
      if (!profiles[code]) {
        const meta = FACULTY_DIRECTORY[code] || {
          name: `Faculty (${code})`,
          dept: "Science Division",
          role: "Course Instructor"
        };
        profiles[code] = {
          code: code,
          name: meta.name,
          dept: meta.dept,
          role: meta.role,
          modules: new Set(),
          sessions: []
        };
      }
      profiles[code].modules.add(slot.code);
      profiles[code].sessions.push({
        day: day,
        period: slot.period,
        code: slot.code,
        time: `${slot.start} - ${slot.end}`,
        type: slot.type
      });
    });
  });

  return Object.values(profiles).map(p => ({
    ...p,
    modules: Array.from(p.modules),
    weeklyCount: p.sessions.length
  })).sort((a, b) => b.weeklyCount - a.weeklyCount);
}

function toSeconds(timeStr) {
  const parts = timeStr.split(":").map(Number);
  return parts[0] * 3600 + parts[1] * 60;
}

function formatClockTime(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${minute} ${ampm}`;
}

function formatCountdown(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getDaysRemaining(dateString) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(dateString + "T00:00:00");
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "COMPLETED";
  if (diffDays === 0) return "TODAY";
  if (diffDays === 1) return "TOMORROW";
  return `IN ${diffDays} DAYS`;
}

function getLiveRoutineState(now = new Date()) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = days[now.getDay()];
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  if (currentDay === "Friday" || currentDay === "Saturday") {
    return {
      status: "WEEKEND",
      day: currentDay,
      headline: "WEEKEND MODE ACTIVE",
      subtext: "Next academic session resumes Sunday at 10:00 AM",
      schedule: ROUTINE_DATA.Sunday,
      previewDay: "Sunday"
    };
  }

  const todaySchedule = ROUTINE_DATA[currentDay];
  const firstStart = toSeconds(todaySchedule[0].start);
  const lastEnd = toSeconds(todaySchedule[todaySchedule.length - 1].end) + 59;

  if (currentSeconds < firstStart) {
    const remaining = firstStart - currentSeconds;
    return {
      status: "PRE_COLLEGE",
      day: currentDay,
      headline: "FIRST LECTURE STARTS IN",
      countdown: formatCountdown(remaining),
      activeSlot: null,
      nextSlot: todaySchedule[0],
      schedule: todaySchedule
    };
  }

  if (currentSeconds > lastEnd) {
    const nextDayIndex = (now.getDay() + 1) % 7;
    const nextAcademicDay = (nextDayIndex === 5 || nextDayIndex === 6) ? "Sunday" : days[nextDayIndex];
    return {
      status: "WRAPPED_UP",
      day: currentDay,
      headline: "CLASSES WRAPPED UP FOR TODAY",
      subtext: `Showing preview for ${nextAcademicDay}`,
      schedule: ROUTINE_DATA[nextAcademicDay],
      previewDay: nextAcademicDay
    };
  }

  for (let i = 0; i < todaySchedule.length; i++) {
    const slot = todaySchedule[i];
    const slotStart = toSeconds(slot.start);
    const slotEnd = (i < todaySchedule.length - 1)
      ? toSeconds(todaySchedule[i + 1].start) - 1
      : toSeconds(slot.end) + 59;

    if (currentSeconds >= slotStart && currentSeconds <= slotEnd) {
      const totalDuration = slotEnd - slotStart;
      const elapsed = currentSeconds - slotStart;
      const remaining = slotEnd - currentSeconds;
      const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

      return {
        status: "LIVE_SESSION",
        day: currentDay,
        activeIndex: i,
        activeSlot: slot,
        nextSlot: todaySchedule[i + 1] || null,
        progress: progress,
        countdown: formatCountdown(remaining),
        schedule: todaySchedule
      };
    }
  }
          }
