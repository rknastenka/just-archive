// app/components/ReviewSystem.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";

// Star Rating Component
function StarRating({ rating, onRatingChange, interactive = false, size = "md" }) {
  const { isDark } = useApp();
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-colors`}
          aria-label={`Rate ${star} stars`}
        >
          <svg
            className={`${sizeClasses[size]} ${
              (hoverRating || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : isDark
                ? "text-slate-600"
                : "text-slate-300"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

// Main File Review System Component - Ratings only, no comments
export default function ReviewSystem({ courseCode, fileId, fileName }) {
  const { isDark } = useApp();
  const { t } = useTranslation();
  const [userRating, setUserRating] = useState(0);
  const [allRatings, setAllRatings] = useState([]);

  // Load ratings from localStorage
  useEffect(() => {
    const storageKey = `fileRatings_${courseCode}_${fileId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setAllRatings(data.ratings || []);
        setUserRating(data.userRating || 0);
      } catch (e) {
        console.error("Failed to parse ratings from localStorage", e);
      }
    }
  }, [courseCode, fileId]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (allRatings.length === 0) return 0;
    const sum = allRatings.reduce((acc, rating) => acc + rating, 0);
    return (sum / allRatings.length).toFixed(1);
  }, [allRatings]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allRatings.forEach((rating) => {
      dist[rating]++;
    });
    return dist;
  }, [allRatings]);

  // Handle rating submission
  const handleRatingChange = (newRating) => {
    const storageKey = `fileRatings_${courseCode}_${fileId}`;
    
    let newAllRatings;
    if (userRating === 0) {
      // New rating
      newAllRatings = [...allRatings, newRating];
    } else {
      // Update existing rating
      const index = allRatings.indexOf(userRating);
      newAllRatings = [...allRatings];
      if (index !== -1) {
        newAllRatings[index] = newRating;
      } else {
        newAllRatings.push(newRating);
      }
    }
    
    setAllRatings(newAllRatings);
    setUserRating(newRating);
    
    localStorage.setItem(
      storageKey,
      JSON.stringify({ ratings: newAllRatings, userRating: newRating })
    );
  };

  return (
    <div
      className={`${
        isDark ? "bg-slate-900/40 border-slate-700" : "bg-white border-slate-200"
      } rounded-lg border p-4`}
    >
      <h3
        className={`${isDark ? "text-slate-100" : "text-slate-800"} text-sm font-semibold mb-3`}
      >
        {t("rateThisFile")}
      </h3>

      {allRatings.length === 0 ? (
        // No ratings yet - show prompt
        <div className="text-center py-2">
          <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs mb-3`}>
            {t("noRatingsYet")}
          </p>
          <div className="flex justify-center">
            <StarRating rating={userRating} onRatingChange={handleRatingChange} interactive size="lg" />
          </div>
          {userRating > 0 && (
            <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs mt-2`}>
              {t("thankYouForRating")}
            </p>
          )}
        </div>
      ) : (
        // Show statistics and allow rating
        <div className="space-y-3">
          {/* Average Rating Display */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
            <div>
              <div className={`${isDark ? "text-slate-100" : "text-slate-800"} text-2xl font-bold`}>
                {averageRating}
              </div>
              <StarRating rating={Math.round(parseFloat(averageRating))} size="sm" />
              <p className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs mt-0.5`}>
                {allRatings.length} {allRatings.length === 1 ? t("rating") : t("ratings")}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 max-w-[180px] space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star];
                const percentage = allRatings.length > 0 ? (count / allRatings.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-1.5">
                    <span className={`${isDark ? "text-slate-400" : "text-slate-600"} text-xs w-2`}>
                      {star}
                    </span>
                    <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    <div className={`${isDark ? "bg-slate-700" : "bg-slate-200"} flex-1 h-1.5 rounded-full overflow-hidden`}>
                      <div
                        className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={`${isDark ? "text-slate-500" : "text-slate-400"} text-xs w-4 text-right`}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Your Rating */}
          <div>
            <p className={`${isDark ? "text-slate-300" : "text-slate-700"} text-xs font-medium mb-2`}>
              {userRating > 0 ? t("yourRating") : t("rateThisFile")}
            </p>
            <div className="flex items-center gap-2">
              <StarRating rating={userRating} onRatingChange={handleRatingChange} interactive size="md" />
              {userRating > 0 && (
                <span className={`${isDark ? "text-slate-400" : "text-slate-500"} text-xs`}>
                  ({userRating}/5)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
