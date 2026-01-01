// app/components/coursePage.js
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import ReviewSystem from "./ReviewSystem";

// Course data - in production, this would come from your Strapi backend
const ALL_COURSES = {
  "CPE101": {
    code: "CPE 101",
    nameEn: "Introduction to Programming",
    nameAr: "مقدمة في البرمجة",
    majorEn: "Computer Engineering",
    majorAr: "هندسة الحاسوب",
  },
  "CPE241": {
    code: "CPE 241",
    nameEn: "Data Structures",
    nameAr: "هياكل البيانات",
    majorEn: "Computer Engineering",
    majorAr: "هندسة الحاسوب",
  },
  "CPE351": {
    code: "CPE 351",
    nameEn: "Computer Networks",
    nameAr: "شبكات الحاسوب",
    majorEn: "Computer Engineering",
    majorAr: "هندسة الحاسوب",
  },
  "EE241": {
    code: "EE 241",
    nameEn: "Signals & Systems",
    nameAr: "الإشارات والأنظمة",
    majorEn: "Electrical Engineering",
    majorAr: "الهندسة الكهربائية",
  },
  "EE231": {
    code: "EE 231",
    nameEn: "Electronics I",
    nameAr: "الإلكترونيات 1",
    majorEn: "Electrical Engineering",
    majorAr: "الهندسة الكهربائية",
  },
  "EE332": {
    code: "EE 332",
    nameEn: "Power Systems",
    nameAr: "أنظمة القدرة",
    majorEn: "Electrical Engineering",
    majorAr: "الهندسة الكهربائية",
  },
  "ME210": {
    code: "ME 210",
    nameEn: "Thermodynamics",
    nameAr: "الثرموديناميك",
    majorEn: "Mechanical Engineering",
    majorAr: "الهندسة الميكانيكية",
  },
  "ME315": {
    code: "ME 315",
    nameEn: "Machine Design",
    nameAr: "تصميم الآلات",
    majorEn: "Mechanical Engineering",
    majorAr: "الهندسة الميكانيكية",
  },
  "CE210": {
    code: "CE 210",
    nameEn: "Statics",
    nameAr: "الستاتيك",
    majorEn: "Civil Engineering",
    majorAr: "الهندسة المدنية",
  },
  "CE340": {
    code: "CE 340",
    nameEn: "Concrete Design",
    nameAr: "تصميم الخرسانة",
    majorEn: "Civil Engineering",
    majorAr: "الهندسة المدنية",
  },
  "MED212": {
    code: "MED 212",
    nameEn: "Anatomy",
    nameAr: "التشريح",
    majorEn: "Medicine",
    majorAr: "الطب",
  },
  "MED231": {
    code: "MED 231",
    nameEn: "Physiology",
    nameAr: "علم وظائف الأعضاء",
    majorEn: "Medicine",
    majorAr: "الطب",
  },
  "MED245": {
    code: "MED 245",
    nameEn: "Pathology",
    nameAr: "الباثولوجيا",
    majorEn: "Medicine",
    majorAr: "الطب",
  },
  "PHAR210": {
    code: "PHAR 210",
    nameEn: "Pharmacology I",
    nameAr: "علم الأدوية 1",
    majorEn: "Pharmacy",
    majorAr: "الصيدلة",
  },
  "PHAR220": {
    code: "PHAR 220",
    nameEn: "Pharmaceutics",
    nameAr: "الصيدلانيات",
    majorEn: "Pharmacy",
    majorAr: "الصيدلة",
  },
  "NURS110": {
    code: "NURS 110",
    nameEn: "Fundamentals of Nursing",
    nameAr: "أساسيات التمريض",
    majorEn: "Nursing",
    majorAr: "التمريض",
  },
};

export default function CourseResourcePage() {
  const { isDark, lang, isRTL } = useApp();
  const { t } = useTranslation();
  
  // Get course code from URL hash
  const [courseCode, setCourseCode] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const getCodeFromHash = () => {
      const hash = window.location.hash.slice(1); // Remove '#'
      const match = hash.match(/^course\/(.+)$/);
      return match ? match[1].toUpperCase() : "";
    };
    
    setCourseCode(getCodeFromHash());
    
    const handleHashChange = () => {
      setCourseCode(getCodeFromHash());
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Get course data or show 404
  const course = useMemo(() => {
    return ALL_COURSES[courseCode] || {
      code: courseCode,
      nameEn: "Course Not Found",
      nameAr: "المساق غير موجود",
      majorEn: "Unknown",
      majorAr: "غير معروف",
    };
  }, [courseCode]);

  const courseExists = ALL_COURSES[courseCode] !== undefined;

  // added "youtube"
  const [activeTab, setActiveTab] = useState("pyq");
  const [selectedResourceId, setSelectedResourceId] = useState("pyq-first-2025");
  const [examFilter, setExamFilter] = useState("all"); // "all", "first", "second", "midterm", "final"
  
  // Load completed files from localStorage - always start with empty object to avoid hydration mismatch
  const [completedFiles, setCompletedFiles] = useState({});
  const mountedRef = useRef(false);
  const tabsRef = useRef(null);

  // Load from localStorage after mount
  useEffect(() => {
    const storageKey = `completedFiles_${courseCode}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setCompletedFiles(parsed);
      } catch (e) {
        console.error("Failed to parse completed files from localStorage", e);
      }
    }
    
    // Check if this course is in favorites
    const favoritesStored = localStorage.getItem('favoriteCourses');
    if (favoritesStored) {
      try {
        const favorites = JSON.parse(favoritesStored);
        setIsFavorite(favorites.some(fav => fav.code === courseCode));
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
      }
    }
    
    mountedRef.current = true;
  }, [courseCode]);

  // Save completed files to localStorage whenever it changes (skip initial mount)
  useEffect(() => {
    if (!mountedRef.current) return;
    const storageKey = `completedFiles_${courseCode}`;
    localStorage.setItem(storageKey, JSON.stringify(completedFiles));
  }, [completedFiles, courseCode]);

  // Toggle file completion status
  const toggleFileCompletion = (fileId) => {
    setCompletedFiles((prev) => ({
      ...prev,
      [fileId]: !prev[fileId],
    }));
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    const favoritesStored = localStorage.getItem('favoriteCourses');
    let favorites = [];
    
    if (favoritesStored) {
      try {
        favorites = JSON.parse(favoritesStored);
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
      }
    }
    
    const courseData = {
      code: courseCode,
      nameEn: course.nameEn,
      nameAr: course.nameAr,
      majorEn: course.majorEn,
      majorAr: course.majorAr,
    };
    
    if (isFavorite) {
      // Remove from favorites
      favorites = favorites.filter(fav => fav.code !== courseCode);
      setIsFavorite(false);
    } else {
      // Add to favorites
      favorites.push(courseData);
      setIsFavorite(true);
    }
    
    localStorage.setItem('favoriteCourses', JSON.stringify(favorites));
  };

  // PYQs grouped by exam term in your order
  const pyqSections = useMemo(() => [
    {
      section: "First Exam",
      items: [
        {
          id: "pyq-first-2025",
          name: "First Exam 2024-2025",
          type: "PDF",
          size: "1.1 MB",
          updatedAt: "Oct 4, 2025",
          uploader: "CPE Society",
        },
        {
          id: "pyq-first-2024",
          name: "First Exam 2023-2024",
          type: "PDF",
          size: "1.0 MB",
          updatedAt: "Oct 6, 2024",
          uploader: "CPE Society",
        },
      ],
    },
    {
      section: "Second Exam",
      items: [
        {
          id: "pyq-second-2025",
          name: "Second Exam 2024-2025",
          type: "PDF",
          size: "1.2 MB",
          updatedAt: "Nov 1, 2025",
          uploader: "CPE Society",
        },
      ],
    },
    {
      section: "Midterm",
      items: [
        {
          id: "pyq-midterm-2025",
          name: "Midterm 2024-2025",
          type: "PDF",
          size: "1.4 MB",
          updatedAt: "Nov 15, 2025",
          uploader: "CPE Society",
        },
      ],
    },
    {
      section: "Final Exam",
      items: [
        {
          id: "pyq-final-2025",
          name: "Final 2024-2025",
          type: "PDF",
          size: "2.4 MB",
          updatedAt: "Jan 25, 2025",
          uploader: "CPE Society",
        },
        {
          id: "pyq-final-2024",
          name: "Final 2023-2024",
          type: "PDF",
          size: "2.2 MB",
          updatedAt: "Jan 20, 2024",
          uploader: "CPE Society",
        },
      ],
    },
  ], []);

  // notes & assignments stay flat
  const noteResources = [
    {
      id: "notes-week1",
      name: "Week 1 – Introduction",
      type: "PDF",
      size: "600 KB",
      updatedAt: "Oct 1, 2025",
      uploader: "CPE Society",
    },
    {
      id: "notes-week2",
      name: "Week 2 – Variables & Data Types",
      type: "PDF",
      size: "900 KB",
      updatedAt: "Oct 5, 2025",
      uploader: "CPE Society",
    },
  ];

  const assignmentResources = [
    {
      id: "assg-1",
      name: "Assignment 1 – Simple Calculator",
      type: "PDF",
      size: "500 KB",
      updatedAt: "Nov 1, 2025",
      uploader: "Course Admin",
    },
  ];

  // new: youtube playlists
  const youtubePlaylists = [
    {
      id: "yt-1",
      title: "Intro to Programming in C++ (Arabic)",
      channel: "Code with JUST",
      videos: 24,
      duration: "6h total",
      link: "#",
    },
    {
      id: "yt-2",
      title: "Data Structures Basics",
      channel: "Elzero-like CS",
      videos: 18,
      duration: "4h total",
      link: "#",
    },
    {
      id: "yt-3",
      title: "Computer Engineering Math Refresh",
      channel: "University Helper",
      videos: 12,
      duration: "3h total",
      link: "#",
    },
  ];

  const flatCurrentResources =
    activeTab === "notes"
      ? noteResources
      : activeTab === "assignments"
      ? assignmentResources
      : [];

  const selectedResource =
    activeTab === "pyq"
      ? pyqSections
          .flatMap((sec) => sec.items)
          .find((r) => r.id === selectedResourceId)
      : flatCurrentResources.find((r) => r.id === selectedResourceId) || null;

  // Filter PYQ sections based on exam filter
  const filteredPyqSections = useMemo(() => {
    if (examFilter === "all") return pyqSections;
    
    const filterMap = {
      first: "First Exam",
      second: "Second Exam",
      midterm: "Midterm",
      final: "Final Exam",
    };
    
    return pyqSections.filter((section) => section.section === filterMap[examFilter]);
  }, [examFilter, pyqSections]);

  return (
    <div className={isDark ? "min-h-screen bg-slate-900" : "min-h-screen bg-slate-50"}>
      <main className="mb-10 mx-auto max-w-[1350px] px-4 py-6 space-y-6">
        {/* course header */}
        <section className={
          (isDark ? "bg-slate-900/30 border-slate-700" : "bg-white border-slate-200") +
          " rounded-lg px-4 sm:px-6 py-4 sm:py-5 border flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4"
        }>
          <div className="flex-1 w-full sm:w-auto">
            <button
              onClick={() => window.location.href = window.location.pathname}
              className={
                (isDark ? "text-[#7DB4E5] hover:text-[#9CC5E9]" : "text-[#145C9E] hover:text-[#1f3d78]") +
                " text-[11px] sm:text-xs hover:underline mb-2 flex items-center gap-1 transition-all"
              }
            >
              <svg className={"w-3 h-3 sm:w-3.5 sm:h-3.5" + (isRTL ? " rotate-180" : "")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('backToCourses')}
            </button>
            <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-[10px] sm:text-xs uppercase tracking-wide"}>
              {lang === "en" ? course.majorEn : course.majorAr}
            </p>
            <h1 className={(isDark ? "text-slate-100" : "text-slate-800") + " mt-1 text-lg sm:text-xl font-semibold"}>
              {lang === "en" ? course.nameEn : course.nameAr}
            </h1>
            <p className={(isDark ? "text-slate-400" : "text-slate-500") + " mt-0.5 sm:mt-1 text-xs sm:text-sm"}>{course.code}</p>
            {!courseExists && (
              <p className={
                (isDark ? "text-amber-400 bg-amber-900/20" : "text-amber-600 bg-amber-50") +
                " mt-2 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md inline-block"
              }>
                {t('courseDoesntExist')}
              </p>
            )}
          </div>
          <div className="hidden sm:flex gap-2 w-auto">
            <button 
              onClick={toggleFavorite}
              className={
                (isDark
                  ? "border-slate-700 hover:bg-slate-800/50 text-slate-300"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700") +
                " rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1.5 transition border"
              }
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg 
                className="w-4.5 h-4.5" 
                fill={isFavorite ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className={
              (isDark ? "bg-[#7DB4E5] text-slate-950 hover:bg-[#9CC5E9]" : "bg-[#145C9E] text-white hover:bg-[#1f3d78]") +
              " rounded-md px-4 py-2 text-xs font-medium transition"
            }>
              {t('uploadResources')}
            </button>
          </div>
        </section>

        {/* Show content only if course exists */}
        {courseExists ? (
          <>
            {/* tabs */}
            <div className={(isDark ? "border-slate-700" : "border-slate-200") + " border-b overflow-x-auto scrollbar-hide"}>
              <div 
                ref={tabsRef}
                className="flex gap-2 min-w-max"
                style={{ scrollBehavior: 'smooth' }}
              >
                <button
                  onClick={() => {
                    setActiveTab("syllabus");
                    setSelectedResourceId(null);
                  }}
                  className={`px-3 py-2 text-sm whitespace-nowrap ${
                    activeTab === "syllabus"
                      ? isDark
                        ? "border-b-2 border-[#7DB4E5] text-slate-100"
                        : "border-b-2 border-[#145C9E] text-slate-900"
                      : isDark
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  {t('syllabus')}
                </button>
                <button
                  onClick={() => {
                    setActiveTab("pyq");
                    setSelectedResourceId(pyqSections[0]?.items[0]?.id ?? null);
                  }}
                  className={`px-3 py-2 text-sm whitespace-nowrap ${
                    activeTab === "pyq"
                      ? isDark
                        ? "border-b-2 border-[#7DB4E5] text-slate-100"
                        : "border-b-2 border-[#145C9E] text-slate-900"
                      : isDark
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  {t('pyqs')}
                </button>
                <button
                  onClick={() => {
                    setActiveTab("notes");
                    setSelectedResourceId(noteResources[0]?.id || null);
                  }}
                  className={`px-3 py-2 text-sm whitespace-nowrap ${
                    activeTab === "notes"
                      ? isDark
                        ? "border-b-2 border-[#7DB4E5] text-slate-100"
                        : "border-b-2 border-[#145C9E] text-slate-900"
                      : isDark
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  {t('notes')}
                </button>

                <button
                  onClick={() => {
                    setActiveTab("youtube");
                    setSelectedResourceId(null);
                  }}
                  className={`px-3 py-2 text-sm whitespace-nowrap ${
                    activeTab === "youtube"
                      ? isDark
                        ? "border-b-2 border-[#7DB4E5] text-slate-100"
                        : "border-b-2 border-[#145C9E] text-slate-900"
                      : isDark
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  {t('youtubePlaylists')}
                </button>
              </div>
            </div>

        {/* Exam Filter - only show when on PYQ tab */}
        {activeTab === "pyq" && (
          <div className="grid lg:gap-6 lg:grid-cols-[1.05fr_0.4fr]">
            <div className={(isDark ? "bg-slate-900/40 border-slate-700" : "bg-white border-slate-200") + " rounded-lg border px-4 py-3"}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={(isDark ? "text-slate-400" : "text-slate-600") + " text-xs font-medium"}>
                  {t('filterByExam')}
                </span>
                <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setExamFilter("all")}
                  className={`px-3 py-1.5 text-xs rounded-md transition ${
                    examFilter === "all"
                      ? isDark
                        ? "bg-[#7DB4E5] text-slate-950 font-medium"
                        : "bg-[#145C9E] text-white font-medium"
                      : isDark
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t('all')}
                </button>
                <button
                  onClick={() => setExamFilter("first")}
                  className={`px-3 py-1.5 text-xs rounded-md transition ${
                    examFilter === "first"
                      ? isDark
                        ? "bg-[#7DB4E5] text-slate-950 font-medium"
                        : "bg-[#145C9E] text-white font-medium"
                      : isDark
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t('firstExam')}
                </button>
                <button
                  onClick={() => setExamFilter("second")}
                  className={`px-3 py-1.5 text-xs rounded-md transition ${
                    examFilter === "second"
                      ? isDark
                        ? "bg-[#7DB4E5] text-slate-950 font-medium"
                        : "bg-[#145C9E] text-white font-medium"
                      : isDark
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t('secondExam')}
                </button>
                <button
                  onClick={() => setExamFilter("midterm")}
                  className={`px-3 py-1.5 text-xs rounded-md transition ${
                    examFilter === "midterm"
                      ? isDark
                        ? "bg-[#7DB4E5] text-slate-950 font-medium"
                        : "bg-[#145C9E] text-white font-medium"
                      : isDark
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t('midterm')}
                </button>
                <button
                  onClick={() => setExamFilter("final")}
                  className={`px-3 py-1.5 text-xs rounded-md transition ${
                    examFilter === "final"
                      ? isDark
                        ? "bg-[#7DB4E5] text-slate-950 font-medium"
                        : "bg-[#145C9E] text-white font-medium"
                      : isDark
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t('finalExam')}
                </button>
              </div>
            </div>
            </div>
            {/* Empty div for right column spacing */}
            <div></div>
          </div>
        )}

        {/* main area */}
        {activeTab === "syllabus" ? (
          // SYLLABUS VIEW
          <div className="flex justify-center">
            <div className={(isDark ? "bg-slate-900/40 border-slate-700" : "bg-white border-slate-200") + " rounded-lg border p-6 w-full max-w-4xl"}>
              <h3 className={(isDark ? "text-slate-200" : "text-slate-700") + " text-lg font-semibold mb-4"}>
                {t('courseSyllabus')}
              </h3>
              <div className={(isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200") + " rounded-md border border-dashed aspect-[8.5/11] flex items-center justify-center text-sm text-slate-400"}>
                {t('pdfSyllabusPreview')}
              </div>
              <div className="flex gap-2 mt-4">
                <button className={
                  (isDark ? "bg-[#7DB4E5] text-slate-950 hover:bg-[#9CC5E9]" : "bg-[#145C9E] text-white hover:bg-[#1f3d78]") +
                  " rounded-md px-4 py-2 text-sm transition"
                }>
                  {t('downloadSyllabus')}
                </button>
                <button className={
                  (isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800/50" : "border-slate-200 text-slate-700 hover:bg-slate-50") +
                  " rounded-md border px-4 py-2 text-sm transition"
                }>
                  {t('openInNewTab')}
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === "youtube" ? (
          // YOUTUBE VIEW
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {youtubePlaylists.map((pl) => (
              <div
                key={pl.id}
                className={
                  (isDark
                    ? "bg-slate-900/40 border-slate-700 hover:border-[#7DB4E5]/40"
                    : "bg-white border-slate-200 hover:border-[#145C9E]/40") +
                  " rounded-lg border p-4 hover:shadow-sm transition"
                }
              >
                <div className={(isDark ? "bg-slate-800" : "bg-slate-200") + " aspect-video mb-3 rounded-md flex items-center justify-center text-[10px] text-slate-500"}>
                  {t('youtubeThumbnail')}
                </div>
                <h3 className={(isDark ? "text-slate-100" : "text-slate-800") + " text-sm font-semibold"}>
                  {pl.title}
                </h3>
                <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-xs mt-1"}>
                  {pl.channel} · {pl.videos} {t('videos')} · {pl.duration}
                </p>
                <button className={(isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-900 hover:bg-slate-800") + " mt-3 w-full rounded-md px-3 py-1.5 text-xs text-white transition"}>
                  {t('openPlaylist')}
                </button>
              </div>
            ))}
            {youtubePlaylists.length === 0 && (
              <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-sm"}>
                {t('noSuggestedPlaylists')}
              </p>
            )}
          </div>
        ) : (
          // RESOURCES VIEW (notes, assignments, pyq)
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.4fr]">
            {/* left list */}
            <div className={(isDark ? "bg-slate-900/40 border-slate-700" : "bg-white border-slate-200") + " rounded-lg border overflow-hidden"}>
              <div className={(isDark ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200") + " flex items-center justify-between border-b px-4 py-2"}>
                <p className={(isDark ? "text-slate-400" : "text-slate-500") + " text-xs font-medium"}>
                  {activeTab === "pyq"
                    ? filteredPyqSections.reduce(
                        (sum, sec) => sum + sec.items.length,
                        0
                      ) + " " + t('resources')
                    : flatCurrentResources.length + " " + t('resources')}
                </p>
                <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-[10px]"}>
                  {activeTab === "pyq"
                    ? t('groupedByExamTerm')
                    : t('sortedByLastUpdated')}
                </p>
              </div>

              {activeTab === "pyq" ? (
                <ul className={(isDark ? "divide-slate-800" : "divide-slate-100") + " divide-y"}>
                  {filteredPyqSections.length > 0 ? (
                    filteredPyqSections.map((section) => (
                      <li key={section.section}>
                        <p className={(isDark ? "bg-slate-900/60 text-slate-500" : "bg-slate-50 text-slate-400") + " px-4 py-2 text-[11px] font-semibold uppercase tracking-wide"}>
                          {section.section}
                        </p>
                        {section.items.map((res) => {
                          const isActive = res.id === selectedResourceId;
                          const isCompleted = completedFiles[res.id] || false;
                          return (
                            <div
                              key={res.id}
                              className={`flex w-full items-center gap-3 px-4 py-3 transition ${
                                isActive
                                  ? isDark
                                    ? "bg-[#7DB4E5]/10 border-l-2 border-[#7DB4E5]"
                                    : "bg-[#145C9E]/10 border-l-2 border-[#145C9E]"
                                  : isDark
                                  ? "hover:bg-slate-800/50"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              {/* File content - clickable area */}
                              <button
                                type="button"
                                onClick={() => setSelectedResourceId(res.id)}
                                className={(isRTL ? "text-right" : "text-left") + " flex flex-1 items-center gap-3 min-w-0"}
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600 text-[10px] font-semibold">
                                  PDF
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <p className={(isDark ? "text-slate-100" : "text-slate-800") + " text-sm font-medium truncate"}>
                                    {res.name}
                                  </p>
                                  <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-[11px]"}>
                                    {res.uploader} · {res.updatedAt}
                                  </p>
                                </div>
                                <div className={(isDark ? "text-slate-500" : "text-slate-400") + " flex items-center gap-4 text-[11px]"}>
                                  <span>{res.size}</span>
                                </div>
                              </button>
                              
                              {/* Compact Checkbox - Right Side */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFileCompletion(res.id);
                                }}
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded transition ${
                                  isCompleted
                                    ? isDark
                                      ? "bg-[#7DB4E5] text-white"
                                      : "bg-[#145C9E] text-white"
                                    : isDark
                                    ? "border border-slate-600 hover:border-slate-500"
                                    : "border border-slate-300 hover:border-slate-400"
                                }`}
                                title={isCompleted ? t('markAsIncomplete') : t('markAsComplete')}
                              >
                                {isCompleted && (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-8 text-center">
                      <p className={(isDark ? "text-slate-400" : "text-slate-500") + " text-sm"}>
                        {t('noResourcesFound')}
                      </p>
                    </li>
                  )}
                </ul>
              ) : (
                <ul className={(isDark ? "divide-slate-800" : "divide-slate-100") + " divide-y"}>
                  {flatCurrentResources.map((res) => {
                    const isActive = res.id === selectedResourceId;
                    const isCompleted = completedFiles[res.id] || false;
                    return (
                      <li key={res.id}>
                        <div
                          className={`flex w-full items-center gap-3 px-4 py-3 transition ${
                            isActive
                              ? isDark
                                ? "bg-[#7DB4E5]/10 border-l-2 border-[#7DB4E5]"
                                : "bg-[#145C9E]/10 border-l-2 border-[#145C9E]"
                              : isDark
                              ? "hover:bg-slate-800/50"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          {/* File content - clickable area */}
                          <button
                            type="button"
                            onClick={() => setSelectedResourceId(res.id)}
                            className={(isRTL ? "text-right" : "text-left") + " flex flex-1 items-center gap-3 min-w-0"}
                          >
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold ${
                                res.type === "PDF"
                                  ? "bg-red-100 text-red-600"
                                  : isDark
                                  ? "bg-slate-800 text-slate-300"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {res.type}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <p className={(isDark ? "text-slate-100" : "text-slate-800") + " text-sm font-medium truncate"}>
                                {res.name}
                              </p>
                              <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-[11px]"}>
                                {res.uploader} · {res.updatedAt}
                              </p>
                            </div>
                            <div className={(isDark ? "text-slate-500" : "text-slate-400") + " flex items-center gap-4 text-[11px]"}>
                              <span>{res.size}</span>
                            </div>
                          </button>

                          {/* Compact Checkbox - Right Side */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFileCompletion(res.id);
                            }}
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded transition ${
                              isCompleted
                                ? isDark
                                  ? "bg-[#7DB4E5] text-white"
                                  : "bg-[#145C9E] text-white"
                                : isDark
                                ? "border border-slate-600 hover:border-slate-500"
                                : "border border-slate-300 hover:border-slate-400"
                            }`}
                            title={isCompleted ? t('markAsIncomplete') : t('markAsComplete')}
                          >
                            {isCompleted && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* right preview */}
            <aside className="space-y-4">
              <div className={(isDark ? "bg-slate-900/40 border-slate-700" : "bg-white border-slate-200") + " rounded-lg border p-4 min-h-[220px]"}>
                <h3 className={(isDark ? "text-slate-200" : "text-slate-700") + " text-sm font-semibold"}>
                  {t('preview')}
                </h3>
                {selectedResource ? (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-md text-[10px] font-semibold ${
                          selectedResource.type === "PDF"
                            ? "bg-red-100 text-red-600"
                            : isDark
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {selectedResource.type}
                      </div>
                      <div>
                        <p className={(isDark ? "text-slate-100" : "text-slate-800") + " text-sm font-medium"}>
                          {selectedResource.name}
                        </p>
                        <p className={(isDark ? "text-slate-500" : "text-slate-400") + " text-[11px]"}>
                          {selectedResource.size} · {selectedResource.uploader}
                        </p>
                      </div>
                    </div>
                    <div className={(isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200") + " rounded-md border border-dashed h-28 flex items-center justify-center text-xs text-slate-400"}>
                      {t('pdfPreviewPlaceholder')}
                    </div>
                    <div className="flex gap-2">
                      <button className={
                        (isDark ? "bg-[#7DB4E5] text-slate-950 hover:bg-[#9CC5E9]" : "bg-[#145C9E] text-white hover:bg-[#1f3d78]") +
                        " rounded-md px-3 py-1.5 text-xs transition"
                      }>
                        {t('download')}
                      </button>
                      <button className={
                        (isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800/50" : "border-slate-200 text-slate-700 hover:bg-slate-50") +
                        " rounded-md border px-3 py-1.5 text-xs transition"
                      }>
                        {t('openInNewTab')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={(isDark ? "text-slate-500" : "text-slate-400") + " mt-3 text-xs"}>
                    {t('selectResourceToPreview')}
                  </p>
                )}
              </div>
              
              {/* Review System - Only show for Notes tab */}
              {activeTab === "notes" && selectedResource && (
                <ReviewSystem 
                  courseCode={courseCode}
                  fileId={selectedResource.id}
                  fileName={selectedResource.name}
                />
              )}
            </aside>
          </div>
        )}
          </>
        ) : (
          <div className={(isDark ? "bg-slate-900/40 border-slate-700" : "bg-white border-slate-200") + " rounded-lg px-6 py-8 shadow-sm border text-center"}>
            <div className="max-w-md mx-auto">
              <div className="text-5xl mb-4"> </div>
              <h2 className={(isDark ? "text-slate-100" : "text-slate-800") + " text-lg font-semibold mb-2"}>
                {t('noResourcesAvailable')}
              </h2>
              <p className={(isDark ? "text-slate-400" : "text-slate-500") + " text-sm mb-4"}>
                {t('courseNotInDatabase')}
              </p>
              <button
                onClick={() => window.location.href = window.location.pathname}
                className={
                  (isDark ? "bg-[#7DB4E5] text-slate-950 hover:bg-[#9CC5E9]" : "bg-[#145C9E] text-white hover:bg-[#1f3d78]") +
                  " rounded-md px-4 py-2 text-sm font-medium transition"
                }
              >
                {t('browseAllCourses')}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
