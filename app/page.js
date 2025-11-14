// app/page.js
"use client";

import { useState, useEffect } from "react";
import { useApp } from "./context/AppContext";
import CourseResourcePage from "./course/[code]/page";

const BRAND = {
  light: {
    primary: "#2467a4",        // deep academic blue
    primarySoft: "#E6F1FB",    // soft background
    primaryBorder: "#C3DBF3",
  },
  dark: {
    primary: "#2467a4",        // same blue for consistency
    primarySoft: "rgba(36,103,164,0.12)",
    primaryBorder: "rgba(36,103,164,0.25)",
  },
};


// Faculties with their majors
const FACULTIES = [
  {
    id: 1,
    nameEn: "Medicine",
    nameAr: "الطب",
    majors: [
      { id: 1, code: "MD", nameEn: "Doctor Of Medicine (MD)", nameAr: "دكتور في الطب" },
      { id: 39, code: "DVM", nameEn: "Doctor Of Veterinary Medicine (DVM)", nameAr: "دكتور في الطب البيطري" },
      { id: 33, code: "DDS", nameEn: "Doctor Of Dental Surgery", nameAr: "دكتور في جراحة الأسنان" },
    ]
  },
  {
    id: 2,
    nameEn: "Applied Medical Sciences",
    nameAr: "العلوم الطبية التطبيقية",
    majors: [
      { id: 2, code: "HMP", nameEn: "Health Management And Policy", nameAr: "إدارة وسياسة صحية" },
      { id: 3, code: "MLS", nameEn: "Medical Laboratory Sciences", nameAr: "علوم المختبرات الطبية" },
      { id: 4, code: "PARA", nameEn: "Paramedics", nameAr: "المسعفين" },
      { id: 5, code: "RT", nameEn: "Radiologic Technology", nameAr: "تكنولوجيا الأشعة" },
      { id: 6, code: "OPT", nameEn: "Optometry", nameAr: "البصريات" },
      { id: 7, code: "PT", nameEn: "Physical Therapy", nameAr: "العلاج الطبيعي" },
      { id: 8, code: "OT", nameEn: "Occupational Therapy", nameAr: "العلاج الوظيفي" },
      { id: 9, code: "ASP", nameEn: "Audiology & Speech Pathology", nameAr: "السمعيات وأمراض النطق" },
      { id: 10, code: "RESP", nameEn: "Respiratory Therapy", nameAr: "العلاج التنفسي" },
      { id: 11, code: "ANES", nameEn: "Anesthesia Technology", nameAr: "تكنولوجيا التخدير" },
      { id: 12, code: "CPSY", nameEn: "Clinical Psychology", nameAr: "علم النفس السريري" },
      { id: 13, code: "DDT", nameEn: "Digital Dental Technology", nameAr: "تكنولوجيا الأسنان الرقمية" },
      { id: 14, code: "DH", nameEn: "Dental Hygienist", nameAr: "صحة الأسنان" },
    ]
  },
  {
    id: 4,
    nameEn: "Pharmacy",
    nameAr: "الصيدلة",
    majors: [
      { id: 27, code: "PHAR", nameEn: "Pharmacy", nameAr: "الصيدلة" },
      { id: 28, code: "PHARMD", nameEn: "Doctor Of Pharmacy (Pharm D.)", nameAr: "دكتور في الصيدلة" },
      { id: 29, code: "PBM", nameEn: "Pharmaceutical And Biological Manufacturing", nameAr: "التصنيع الصيدلاني والبيولوجي" },
      { id: 30, code: "ACS", nameEn: "Applied Cosmetic Sciences", nameAr: "علوم التجميل التطبيقية" },
    ]
  },
    {
    id: 3,
    nameEn: "Engineering",
    nameAr: "الهندسة",
    majors: [
      { id: 15, code: "CHE", nameEn: "Chemical Engineering", nameAr: "الهندسة الكيميائية" },
      { id: 16, code: "CE", nameEn: "Civil Engineering", nameAr: "الهندسة المدنية" },
      { id: 17, code: "EE", nameEn: "Electrical Engineering", nameAr: "الهندسة الكهربائية" },
      { id: 18, code: "ME", nameEn: "Mechanical Engineering", nameAr: "الهندسة الميكانيكية" },
      { id: 19, code: "BME", nameEn: "Biomedical Engineering", nameAr: "الهندسة الطبية الحيوية" },
      { id: 20, code: "IE", nameEn: "Industrial Engineering", nameAr: "الهندسة الصناعية" },
      { id: 21, code: "AE", nameEn: "Aeronautical Engineering", nameAr: "هندسة الطيران" },
      { id: 22, code: "AMT", nameEn: "Aircraft Maintenance Technology", nameAr: "تكنولوجيا صيانة الطائرات" },
      { id: 23, code: "PDDE", nameEn: "Product Design & Development Engineering", nameAr: "هندسة تصميم وتطوير المنتجات" },
      { id: 24, code: "NE", nameEn: "Nuclear Engineering", nameAr: "الهندسة النووية" },
      { id: 25, code: "IEST", nameEn: "Intelligent Electrical Systems Technology", nameAr: "تكنولوجيا الأنظمة الكهربائية الذكية" },
      { id: 26, code: "UAVT", nameEn: "Unmanned Aerial Vehicles Technology", nameAr: "تكنولوجيا المركبات الجوية بدون طيار" },
    ]
  },
  {
    id: 5,
    nameEn: "Nursing",
    nameAr: "التمريض",
    majors: [
      { id: 31, code: "NURS", nameEn: "Nursing", nameAr: "التمريض" },
      { id: 32, code: "MID", nameEn: "Midwifery", nameAr: "القبالة" },
    ]
  },
  {
    id: 7,
    nameEn: "Agriculture",
    nameAr: "الزراعة",
    majors: [
      { id: 34, code: "SI", nameEn: "Soil & Irrigation", nameAr: "التربة والري" },
      { id: 35, code: "DA", nameEn: "Digital Agriculture", nameAr: "الزراعة الرقمية" },
      { id: 36, code: "CN", nameEn: "Clinical Nutrition", nameAr: "التغذية السريرية" },
      { id: 37, code: "PST", nameEn: "Plant Science And Technology", nameAr: "علوم وتكنولوجيا النبات" },
      { id: 38, code: "AST", nameEn: "Animal Science And Technology", nameAr: "علوم وتكنولوجيا الحيوان" },
    ]
  },
  {
    id: 9,
    nameEn: "Computer & Information Technology",
    nameAr: "الحاسوب وتكنولوجيا المعلومات",
    majors: [
      { id: 40, code: "CPE", nameEn: "Computer Engineering", nameAr: "هندسة الحاسوب" },
      { id: 41, code: "CS", nameEn: "Computer Science", nameAr: "علوم الحاسوب" },
      { id: 42, code: "NES", nameEn: "Network Engineering And Security", nameAr: "هندسة وأمن الشبكات" },
      { id: 43, code: "SE", nameEn: "Software Engineering", nameAr: "هندسة البرمجيات" },
      { id: 44, code: "CYB", nameEn: "Cybersecurity", nameAr: "الأمن السيبراني" },
      { id: 45, code: "DS", nameEn: "Data Science", nameAr: "علوم البيانات" },
      { id: 46, code: "AI", nameEn: "Artificial Intelligence", nameAr: "الذكاء الاصطناعي" },
      { id: 47, code: "IOT", nameEn: "Internet Of Things", nameAr: "إنترنت الأشياء" },
      { id: 48, code: "CGDD", nameEn: "Computer Games Design And Development", nameAr: "تصميم وتطوير ألعاب الحاسوب" },
      { id: 49, code: "HIS", nameEn: "Health Information Systems", nameAr: "أنظمة المعلومات الصحية" },
      { id: 50, code: "ROB", nameEn: "Robotics Science", nameAr: "علم الروبوتات" },
    ]
  },
    {
    id: 11,
    nameEn: "Institute Of Nanotechnology",
    nameAr: "معهد تكنولوجيا النانو",
    majors: [
      { id: 56, code: "NMS", nameEn: "Nanotechnology And Materials Science", nameAr: "تكنولوجيا النانو وعلوم المواد" },
    ]
  },
  {
    id: 12,
    nameEn: "Architecture And Design",
    nameAr: "العمارة والتصميم",
    majors: [
      { id: 57, code: "AR", nameEn: "Architecture", nameAr: "العمارة" },
      { id: 58, code: "UEPE", nameEn: "Urban And Environmental Planning Engineering", nameAr: "هندسة التخطيط العمراني والبيئي" },
      { id: 59, code: "DFMT", nameEn: "Digital Film And Multimedia Technology", nameAr: "تكنولوجيا الأفلام الرقمية والوسائط المتعددة" },
      { id: 60, code: "AGD", nameEn: "Animation And Game Design", nameAr: "تصميم الرسوم المتحركة والألعاب" },
    ]
  },
    {
    id: 10,
    nameEn: "Science & Arts",
    nameAr: "العلوم والآداب",
    majors: [
      { id: 51, code: "ELAL", nameEn: "English Language And Applied Linguistics", nameAr: "اللغة الإنجليزية واللسانيات التطبيقية" },
      { id: 52, code: "MATH", nameEn: "Mathematics", nameAr: "الرياضيات" },
      { id: 53, code: "CHEM", nameEn: "Chemistry", nameAr: "الكيمياء" },
      { id: 54, code: "PHYS", nameEn: "Physics", nameAr: "الفيزياء" },
      { id: 55, code: "BGE", nameEn: "Biotechnology & Genetic Engineering", nameAr: "التكنولوجيا الحيوية والهندسة الوراثية" },
    ]
  },
];

// Get all majors as flat array
const MAJORS = FACULTIES.flatMap(f => f.majors);

// dummy courses grouped by major code (later: fetch from Strapi by major id)
const COURSES_BY_MAJOR = {
  CPE: [
    { id: 101, code: "CPE 101", nameEn: "Introduction to Programming", nameAr: "مقدمة في البرمجة" },
    { id: 102, code: "CPE 241", nameEn: "Data Structures", nameAr: "هياكل البيانات" },
    { id: 103, code: "CPE 351", nameEn: "Computer Networks", nameAr: "شبكات الحاسوب" },
  ],
  EE: [
    { id: 201, code: "EE 241", nameEn: "Signals & Systems", nameAr: "الإشارات والأنظمة" },
    { id: 202, code: "EE 231", nameEn: "Electronics I", nameAr: "الإلكترونيات 1" },
    { id: 203, code: "EE 332", nameEn: "Power Systems", nameAr: "أنظمة القدرة" },
  ],
  ME: [
    { id: 301, code: "ME 210", nameEn: "Thermodynamics", nameAr: "الثرموديناميك" },
    { id: 302, code: "ME 315", nameEn: "Machine Design", nameAr: "تصميم الآلات" },
  ],
  CE: [
    { id: 401, code: "CE 210", nameEn: "Statics", nameAr: "الستاتيك" },
    { id: 402, code: "CE 340", nameEn: "Concrete Design", nameAr: "تصميم الخرسانة" },
  ],
  MED: [
    { id: 501, code: "MED 212", nameEn: "Anatomy", nameAr: "التشريح" },
    { id: 502, code: "MED 231", nameEn: "Physiology", nameAr: "علم وظائف الأعضاء" },
    { id: 503, code: "MED 245", nameEn: "Pathology", nameAr: "الباثولوجيا" },
  ],
  PHAR: [
    { id: 601, code: "PHAR 210", nameEn: "Pharmacology I", nameAr: "علم الأدوية 1" },
    { id: 602, code: "PHAR 220", nameEn: "Pharmaceutics", nameAr: "الصيدلانيات" },
  ],
  NURS: [
    { id: 701, code: "NURS 110", nameEn: "Fundamentals of Nursing", nameAr: "أساسيات التمريض" },
  ],
};

// Color mapping for different major codes
const MAJOR_COLORS = {
  CPE: { light: "#f97316", dark: "#fb923c" },      // orange
  EE: { light: "#eab308", dark: "#fbbf24" },       // yellow
  ME: { light: "#10b981", dark: "#34d399" },       // green
  CE: { light: "#06b6d4", dark: "#22d3ee" },       // cyan
  CHE: { light: "#8b5cf6", dark: "#a78bfa" },      // violet
  AR: { light: "#ec4899", dark: "#f472b6" },       // pink
  CSIT: { light: "#f97316", dark: "#fb923c" },     // orange
  SCI: { light: "#10b981", dark: "#34d399" },      // green
  MED: { light: "#ef4444", dark: "#f87171" },      // red
  DEN: { light: "#3b82f6", dark: "#60a5fa" },      // blue
  PHAR: { light: "#14b8a6", dark: "#2dd4bf" },     // teal
  NURS: { light: "#ec4899", dark: "#f472b6" },     // pink
  AMS: { light: "#f59e0b", dark: "#fbbf24" },      // amber
  AGRI: { light: "#22c55e", dark: "#4ade80" },     // green
  VET: { light: "#8b5cf6", dark: "#a78bfa" },      // violet
};

// Helper function to get color for a course based on its code
const getCourseColor = (courseCode, isDark) => {
  const majorCode = courseCode.split(' ')[0]; // Extract major code (e.g., "CPE" from "CPE 101")
  const colors = MAJOR_COLORS[majorCode];
  if (!colors) return isDark ? "#fb923c" : "#f97316"; // fallback to orange
  return isDark ? colors.dark : colors.light;
};

const TEXTS = {
  en: {
    appName: "JUST Archive",
    university: "Jordan University of Science and Technology",
    searchPlaceholder: "Search courses or PYQs...",
    majorsTitle: "Majors",
    majorsSubtitle: "Choose your faculty/major to see its courses.",
    selectedMajorLabel: "Selected major",
    selectedMajorDescription:
      "Browse all courses under this major. Later you can click a course to see PYQs, notes, and assignments.",
    coursesIn: (name) => `Courses in ${name}`,
    allCourses: "All Available Courses",
    noCourses: "No courses added yet for this major.",
    viewResources: "View resources →",
    langToggle: "العربية",
    themeToggleLight: "Light",
    themeToggleDark: "Dark",
    showAllCourses: "Show All Courses",
  },
  ar: {
    appName: "بنك جست",
    university: "جامعة العلوم والتكنولوجيا الأردنية",
    searchPlaceholder: "ابحث عن مواد أو أسئلة سنوات ...",
    majorsTitle: "التخصصات",
    majorsSubtitle: "اختر التخصص لعرض مواده.",
    selectedMajorLabel: "التخصص المختار",
    selectedMajorDescription:
      "تصفّح مواد هذا التخصص. لاحقاً يمكنك فتح المادة لرؤية أسئلة السنوات والملفات.",
    coursesIn: (name) => `المساقات في ${name}`,
    allCourses: "جميع المساقات المتاحة",
    noCourses: "لا يوجد مساقات مضافة لهذا التخصص حالياً.",
    viewResources: " عرض المحتوى ←",
    langToggle: "English",
    themeToggleLight: "فاتح",
    themeToggleDark: "داكن",
    showAllCourses: "عرض جميع المساقات",
  },
};

export default function HomePage() {
  const { lang, theme, isRTL, isDark } = useApp();
  const [selectedMajorCode, setSelectedMajorCode] = useState(null); // null means "show all"
  const [currentHash, setCurrentHash] = useState('');
  
  // Always start with default order to avoid hydration mismatch
  const [faculties, setFaculties] = useState(FACULTIES);
  
  // Monitor hash changes
  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash.slice(1));
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);
  
  // Load custom order from localStorage after mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('facultiesOrder');
    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        const ordered = orderIds
          .map(id => FACULTIES.find(f => f.id === id))
          .filter(Boolean);
        
        const existingIds = new Set(orderIds);
        const newFaculties = FACULTIES.filter(f => !existingIds.has(f.id));
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setFaculties([...ordered, ...newFaculties]);
      } catch (e) {
        console.error("Failed to load faculty order", e);
      }
    }
  }, []);
  
  // Initialize all faculties as collapsed by default
  const [collapsedFaculties, setCollapsedFaculties] = useState(() => 
    new Set(FACULTIES.map(f => f.id))
  );

  const t = {
    ...TEXTS[lang],
  };

  const toggleFaculty = (facultyId) => {
    setCollapsedFaculties(prev => {
      const next = new Set(prev);
      if (next.has(facultyId)) {
        next.delete(facultyId);
      } else {
        next.add(facultyId);
      }
      return next;
    });
  };

  const moveFaculty = (index, direction) => {
    const newFaculties = [...faculties];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newFaculties.length) {
      [newFaculties[index], newFaculties[newIndex]] = [newFaculties[newIndex], newFaculties[index]];
      setFaculties(newFaculties);
      
      // Save the new order to localStorage
      const orderIds = newFaculties.map(f => f.id);
      localStorage.setItem('facultiesOrder', JSON.stringify(orderIds));
    }
  };
  const allMajors = faculties.flatMap(f => f.majors);
  const selectedMajor = selectedMajorCode ? allMajors.find((m) => m.code === selectedMajorCode) : null;
  
  // Get courses: if no major selected, show all courses from all majors
  const courses = selectedMajorCode 
    ? (COURSES_BY_MAJOR[selectedMajorCode] || [])
    : Object.entries(COURSES_BY_MAJOR).flatMap(([majorCode, coursesArray]) => 
        coursesArray.map(course => ({
          ...course,
          majorCode, // Add major code to each course for reference
        }))
      );

  // If we're on a course page (hash starts with "course/"), show the course page
  if (currentHash.startsWith('course/')) {
    return <CourseResourcePage />;
  }

  return (
    <div
      className={
        "min-h-screen " +
        (isDark ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900") +
        (isRTL ? " rtl" : "")
      }
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Main Shell */}
      <div className="mx-auto flex max-w-[1400px] gap-10 px-4 py-6 min-h-screen">
       
        {/* Majors sidebar */}
        <aside className="hidden w-80 shrink-0 md:flex md:flex-col">
          <div
            className={
              (isDark
                ? "bg-slate-900/30 border-slate-800 shadow-sm"
                : "bg-white border-slate-200 shadow-sm") +
              " rounded-xl border flex flex-col h-full"
            }
          >
            <div className={(isDark ? "border-slate-800" : "border-slate-200") + " border-b px-4 py-3"}>
              <h2
                className={
                  (isDark ? "text-[#7DB4E5]" : "text-[#145C9E]") +
                  " text-xs font-medium uppercase tracking-wide"
                }
              >
                {t.majorsTitle}
              </h2>
              <p className={(isDark ? "text-slate-500" : "text-slate-400") + " mt-1 text-xs"}>
                {t.majorsSubtitle}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {/* Show All Courses Button */}
              <div className="mb-4">
                <button
                  onClick={() => setSelectedMajorCode(null)}
                  className={
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition " +
                    (selectedMajorCode === null
                      ? isDark
                        ? "bg-[#7DB4E5]/10 text-slate-100 border-l-2 border-[#7DB4E5]"
                        : "bg-[#145C9E]/10 text-slate-900 border-l-2 border-[#145C9E]"
                      : isDark
                      ? "text-slate-400 hover:bg-slate-800/50"
                      : "text-slate-500 hover:bg-slate-50")
                  }
                >
                  <span className="font-medium">{t.showAllCourses}</span>
                  {selectedMajorCode === null && (
                    <span
                      className={
                        (isDark
                          ? "bg-slate-800 text-[#7DB4E5]"
                          : "bg-[#145C9E]/10 text-[#145C9E]") +
                        " rounded-full px-2 py-0.5 text-xs font-medium"
                      }
                    >
                      {lang === "en" ? "Selected" : "محدد"}
                    </span>
                  )}
                </button>
              </div>

              {faculties.map((faculty, index) => (
                <div key={faculty.id} className="mb-2">
                  <div
                    className={
                      (isDark
                        ? "text-[#7DB4E5] bg-[#7DB4E5]/3"
                        : "text-[#145C9E] bg-slate-100") +
                      " flex items-center justify-between px-4 py-2 group"
                    }
                  >
                    <button
                      onClick={() => toggleFaculty(faculty.id)}
                      className="flex-1 text-left text-xs font-bold uppercase tracking-wider"
                    >
                      {lang === "en" ? faculty.nameEn : faculty.nameAr}
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveFaculty(index, 'up')}
                        disabled={index === 0}
                        className={(isDark ? "text-slate-500 hover:text-[#7DB4E5] disabled:opacity-30" : "text-slate-500 hover:text-[#145C9E] disabled:opacity-30") + " p-1 disabled:cursor-not-allowed"}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveFaculty(index, 'down')}
                        disabled={index === faculties.length - 1}
                        className={(isDark ? "text-slate-500 hover:text-[#7DB4E5] disabled:opacity-30" : "text-slate-500 hover:text-[#145C9E] disabled:opacity-30") + " p-1 disabled:cursor-not-allowed"}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {!collapsedFaculties.has(faculty.id) && (
                    <ul>
                      {faculty.majors.map((major) => {
                        const active = major.code === selectedMajorCode;
                        return (
                          <li key={major.id}>
                            <button
                              onClick={() => setSelectedMajorCode(major.code)}
                              className={
                                "flex w-full items-center justify-between px-4 py-2 text-left text-sm transition " +
                                (active
                                  ? isDark
                                    ? "bg-[#7DB4E5]/10 text-slate-100 border-l-2 border-[#7DB4E5]"
                                    : "bg-[#145C9E]/10 text-slate-900 border-l-2 border-[#145C9E]"
                                  : isDark
                                  ? "text-slate-400 hover:bg-slate-800/50"
                                  : "text-slate-500 hover:bg-slate-50")
                              }
                            >
                              <span>{lang === "en" ? major.nameEn : major.nameAr}</span>
                              {active && (
                                <span
                                  className={
                                    (isDark
                                      ? "bg-slate-800 text-[#7DB4E5]"
                                      : "bg-[#145C9E]/10 text-[#145C9E]") +
                                    " rounded-full px-2 py-0.5 text-xs font-medium"
                                  }
                                >
                                  {lang === "en" ? "Selected" : "محدد"}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Courses area */}
        <main className="flex-1 space-y-6">
          {/* Courses list for selected major */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h2
                className={
                  (isDark ? "text-slate-100" : "text-slate-800") +
                  " text-base font-semibold whitespace-nowrap"
                }
              >
                {selectedMajor
                  ? t.coursesIn(lang === "en" ? selectedMajor.nameEn : selectedMajor.nameAr)
                  : t.allCourses}
              </h2>
              
              {/* Search Bar */}
              <input
                className={
                  "flex-1 rounded-lg border px-4 py-2 text-sm outline-none transition " +
                  (isDark
                    ? "border-slate-800 bg-slate-900/40 text-slate-100 placeholder:text-slate-500 focus:border-[#7DB4E5]"
                    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#145C9E] focus:bg-white")
                }
                placeholder={t.searchPlaceholder}
              />

              <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-sm whitespace-nowrap"}>
                {courses.length} {lang === "en" ? "courses" : "مساق"}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                return (
                  <div
                    key={course.id}
                    onClick={() => window.location.hash = `course/${course.code.replace(/\s+/g, '')}`}
                    className={
                      (isDark
                        ? "bg-slate-900/40 border-slate-800 hover:border-[#7DB4E5]/40 shadow-sm"
                        : "bg-white border-slate-200 hover:border-[#145C9E]/40 shadow-sm") +
                      " rounded-lg border p-4 cursor-pointer transition hover:shadow-sm overflow-hidden"
                    }
                  >
                    <p className={(isDark ? "text-slate-500" : "text-[#145C9E]") + " text-sm uppercase tracking-wide"}>
                      {course.code}
                    </p>
                    <h3 className={(isDark ? "text-slate-100" : "text-slate-800") + " mt-1 text-base font-semibold"}>
                      {lang === "en" ? course.nameEn : course.nameAr}
                    </h3>
                    <p className={(isDark ? "text-slate-400" : "text-slate-400") + " mt-1 text-xs mb-3"}>
                      {t.viewResources}
                    </p>
                    
                    {/* Decorative lines at bottom */}
                    <div className="flex gap-2 mt-auto">
                      <div className={(isDark ? "bg-[#7DB4E5]" : "bg-[#145C9E]") + " h-1 flex-1 rounded-full"}></div>
                      <div 
                        className="h-1 w-10 rounded-full"
                        style={{ backgroundColor: getCourseColor(course.code, isDark) }}
                      ></div>
                      <div 
                        className="h-1 w-10 rounded-full opacity-70"
                        style={{ backgroundColor: getCourseColor(course.code, isDark) }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {courses.length === 0 && (
                <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-base"}>{t.noCourses}</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
