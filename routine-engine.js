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
    { period: "1st", code: "ICT", title: "ICT", teacher: "KA", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "E-2", title: "English 2nd Paper", teacher: "SY", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "H.M-1", title: "Higher Math 1st Paper", teacher: "TK", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "Bio-1", title: "Biology 1st Paper", teacher: "RB", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin Break (30 Mins)", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th & 6th", code: "Phy-1 Practical", title: "Physics 1st Paper Lab", teacher: "HU", start: "13:16", end: "14:25", type: "practical" },
    { period: "7th", code: "B-1", title: "Bangla 1st Paper", teacher: "AT", start: "14:26", end: "15:00", type: "theory" }
  ],
  Monday: [
    { period: "1st", code: "Che-1", title: "Chemistry 1st Paper", teacher: "MZ", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "B-1", title: "Bangla 1st Paper", teacher: "AT", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "H.M-2", title: "Higher Math 2nd Paper", teacher: "NZ", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "E-2", title: "English 2nd Paper", teacher: "SY", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin Break (30 Mins)", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th & 6th", code: "H.M-1 Practical", title: "Higher Math 1st Paper Lab", teacher: "DH", start: "13:16", end: "14:25", type: "practical" },
    { period: "7th", code: "Phy-2", title: "Physics 2nd Paper", teacher: "HU", start: "14:26", end: "15:00", type: "theory" }
  ],
  Tuesday: [
    { period: "1st", code: "Che-1", title: "Chemistry 1st Paper", teacher: "MZ", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "Bio-1", title: "Biology 1st Paper", teacher: "RB", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "E-1", title: "English 1st Paper", teacher: "MM", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "Phy-1", title: "Physics 1st Paper", teacher: "HU", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin Break (30 Mins)", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th", code: "B-1", title: "Bangla 1st Paper", teacher: "AT", start: "13:16", end: "13:50", type: "theory" },
    { period: "6th", code: "H.M-2", title: "Higher Math 2nd Paper", teacher: "NZ", start: "13:51", end: "14:25", type: "theory" },
    { period: "7th", code: "Bio-2", title: "Biology 2nd Paper", teacher: "RB", start: "14:26", end: "15:00", type: "theory" }
  ],
  Wednesday: [
    { period: "1st", code: "B-2", title: "Bangla 2nd Paper", teacher: "JA", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "E-1", title: "English 1st Paper", teacher: "MM", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "H.M-1", title: "Higher Math 1st Paper", teacher: "TK", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "Phy-1", title: "Physics 1st Paper", teacher: "HU", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin Break (30 Mins)", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th & 6th", code: "Che-1 Practical", title: "Chemistry 1st Paper Lab", teacher: "SK", start: "13:16", end: "14:25", type: "practical" },
    { period: "7th", code: "Che-2", title: "Chemistry 2nd Paper", teacher: "MF", start: "14:26", end: "15:00", type: "theory" }
  ],
  Thursday: [
    { period: "1st", code: "Phy-2", title: "Physics 2nd Paper", teacher: "HU", start: "10:00", end: "10:45", type: "theory" },
    { period: "2nd", code: "Che-2", title: "Chemistry 2nd Paper", teacher: "MF", start: "10:46", end: "11:25", type: "theory" },
    { period: "3rd", code: "B-2", title: "Bangla 2nd Paper", teacher: "JA", start: "11:26", end: "12:05", type: "theory" },
    { period: "4th", code: "Bio-2", title: "Biology 2nd Paper", teacher: "RB", start: "12:06", end: "12:45", type: "theory" },
    { period: "Break", code: "TIFFIN", title: "Tiffin Break (30 Mins)", teacher: "—", start: "12:46", end: "13:15", type: "break" },
    { period: "5th & 6th", code: "Bio-1 Practical", title: "Biology 1st Paper Lab", teacher: "AAli", start: "13:16", end: "14:25", type: "practical" },
    { period: "7th", code: "E-1", title: "English 1st Paper", teacher: "MM", start: "14:26", end: "15:00", type: "theory" }
  ]
};

const FACULTY_DIRECTORY = {
  HU: { name: "Physics Teacher (HU)", dept: "Physics", role: "Theory & Practical" },
  RB: { name: "Biology Teacher (RB)", dept: "Biology", role: "Biology 1st & 2nd Paper" },
  MZ: { name: "Chemistry Teacher (MZ)", dept: "Chemistry", role: "Chemistry 1st Paper" },
  MF: { name: "Chemistry Teacher (MF)", dept: "Chemistry", role: "Chemistry 2nd Paper" },
  TK: { name: "Math Teacher (TK)", dept: "Higher Math", role: "Higher Math 1st Paper" },
  NZ: { name: "Math Teacher (NZ)", dept: "Higher Math", role: "Higher Math 2nd Paper" },
  AT: { name: "Bangla Teacher (AT)", dept: "Bangla", role: "Bangla 1st Paper" },
  JA: { name: "Bangla Teacher (JA)", dept: "Bangla", role: "Bangla 2nd Paper" },
  MM: { name: "English Teacher (MM)", dept: "English", role: "English 1st Paper" },
  SY: { name: "English Teacher (SY)", dept: "English", role: "English 2nd Paper" },
  KA: { name: "ICT Teacher (KA)", dept: "ICT", role: "ICT Subject Teacher" },
  DH: { name: "Md. Delwar Hossain (DH)", dept: "Higher Math", role: "Math Lab & Routine Committee" },
  SK: { name: "Chemistry Teacher (SK)", dept: "Chemistry", role: "Chemistry Practical" },
  AAli: { name: "Biology Teacher (AAli)", dept: "Biology", role: "Biology Practical" }
};

const RADAR_EVENTS = [
  {
    id: "RAD-01",
    category: "LAB KHATA",
    subject: "Physics & Chemistry Lab",
    title: "Bring Practical Notebook for Lab Class",
    targetDate: "2026-10-04",
    priority: "HIGH",
    meta: "During 5th & 6th Period Lab (1:16 PM)"
  },
  {
    id: "RAD-02",
    category: "CLASS TEST",
    subject: "Higher Math 1st Paper (TK)",
    title: "Class Test 1 — Matrices & Determinants",
    targetDate: "2026-10-07",
    priority: "CRITICAL",
    meta: "Time: 25 Mins • 3rd Period (11:26 AM)"
  },
  {
    id: "RAD-03",
    category: "CLASS TEST",
    subject: "Chemistry 1st Paper (MZ)",
    title: "Class Test 1 — Chapter 1 & 2 Basics",
    targetDate: "2026-10-12",
    priority: "NORMAL",
    meta: "1st Period (10:00 AM)"
  },
  {
    id: "RAD-04",
    category: "NOTICE",
    subject: "All XI-Science Students",
    title: "Practical Group Roll Number List",
    targetDate: "2026-09-30",
    priority: "HIGH",
    meta: "Check college notice board in Tiffin Break"
  }
];

const ATTENDANCE_SUBJECTS = [
  { id: "PHY", name: "Physics (1st, 2nd & Lab)", codes: "Phy-1, Phy-2, Lab", teacher: "HU" },
  { id: "CHE", name: "Chemistry (1st, 2nd & Lab)", codes: "Che-1, Che-2, Lab", teacher: "MZ, MF, SK" },
  { id: "MATH", name: "Higher Math (1st, 2nd & Lab)", codes: "H.M-1, H.M-2, Lab", teacher: "TK, NZ, DH" },
  { id: "BIO", name: "Biology (1st, 2nd & Lab)", codes: "Bio-1, Bio-2, Lab", teacher: "RB, AAli" },
  { id: "ENG", name: "English (1st & 2nd Paper)", codes: "E-1, E-2", teacher: "MM, SY" },
  { id: "BAN", name: "Bangla (1st & 2nd Paper)", codes: "B-1, B-2", teacher: "AT, JA" },
  { id: "ICT", name: "ICT", codes: "ICT", teacher: "KA" }
];

const STUDY_NOTES = [
  {
    category: "SYLLABUS",
    subject: "All Subjects (XI-Science)",
    title: "Full College Syllabus & Book List 2026",
    info: "PDF Document • Official College Copy",
    link: "#syllabus-pdf"
  },
  {
    category: "PRACTICAL PDF",
    subject: "Physics 1st Paper Lab (HU)",
    title: "Vernier Calipers, Screw Gauge & Spherometer Guide",
    info: "Sunday 5th-6th Period • Experiment List",
    link: "#phy-lab"
  },
  {
    category: "PRACTICAL PDF",
    subject: "Chemistry 1st Paper Lab (SK)",
    title: "Qualitative Salt Analysis & Lab Safety Rules",
    info: "Wednesday 5th-6th Period • Lab Manual",
    link: "#che-lab"
  },
  {
    category: "PRACTICAL PDF",
    subject: "Higher Math 1st Paper Lab (DH)",
    title: "Graph Plotting & Function Analysis Instructions",
    info: "Monday 5th-6th Period • Practical Guide",
    link: "#math-lab"
  },
  {
    category: "PRACTICAL PDF",
    subject: "Biology 1st Paper Lab (AAli)",
    title: "Microscope Setup & Plant Cell Division Slides",
    info: "Thursday 5th-6th Period • Drawing Rules",
    link: "#bio-lab"
  },
  {
    category: "CLASS NOTES",
    subject: "ICT & Higher Math",
    title: "Chapter-1 Lecture Notes & Formula Sheet",
    info: "Handwritten PDF • Shared by Classmates",
    link: "#class-notes"
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
          name: `Teacher (${code})`,
          dept: "Science Group",
          role: "Subject Teacher"
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
        time: `${formatClockTime(slot.start)} - ${formatClockTime(slot.end)}`,
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
  if (diffDays < 0) return "DONE";
  if (diffDays === 0) return "TODAY";
  if (diffDays === 1) return "TOMORROW";
  return `${diffDays} DAYS LEFT`;
}

function getLiveRoutineState(now = new Date()) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = days[now.getDay()];
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  if (currentDay === "Friday" || currentDay === "Saturday") {
    return {
      status: "WEEKEND",
      day: currentDay,
      headline: "COLLEGE CLOSED TODAY",
      subtext: "Weekend Holiday! Next class on Sunday at 10:00 AM",
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
      headline: "TODAY'S 1ST CLASS",
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
      headline: "TODAY'S CLASSES FINISHED",
      subtext: `Showing routine for ${nextAcademicDay}`,
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

