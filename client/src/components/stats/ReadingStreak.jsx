
import React from "react";

export default function ReadingStreak({
  streak = 0,
  longestStreak,
}) {
  const currentStreak = Math.max(0, Number(streak) || 0);

  const hasLongestStreak =
    longestStreak !== undefined && longestStreak !== null;

  return (
    <section className="stats-card">
      <div className="stats-card__header">
        <h2>Reading Streak</h2>
        <span>Your consistency</span>
      </div>

      <div className="reading-streak__number">
        <strong>{currentStreak}</strong>
        <span>
          {currentStreak === 1
            ? "consecutive day"
            : "consecutive days"}
        </span>
      </div>

      <p className="stats-card__description">
        {currentStreak === 0
          ? "Start reading today to begin a new streak."
          : "Keep reading to maintain your streak."}
      </p>

      {hasLongestStreak && (
        <div className="reading-streak__footer">
          <span>Longest streak</span>
          <strong>{longestStreak} days</strong>
        </div>
      )}
    </section>
  );
}
