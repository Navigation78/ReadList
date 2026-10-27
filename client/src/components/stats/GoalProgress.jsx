
import React from "react";

export default function GoalProgress({
  completed = 0,
  goal = 20,
  year = new Date().getFullYear(),
}) {
  const safeCompleted = Math.max(0, Number(completed) || 0);
  const safeGoal = Math.max(0, Number(goal) || 0);

  const percentage =
    safeGoal > 0
      ? Math.min((safeCompleted / safeGoal) * 100, 100)
      : 0;

  const remaining = Math.max(safeGoal - safeCompleted, 0);

  return (
    <section className="stats-card">
      <div className="stats-card__header">
        <h2>Annual Reading Goal</h2>
        <span>{year}</span>
      </div>

      <div className="goal-progress__numbers">
        <div>
          <strong>{safeCompleted}</strong>
          <span> of {safeGoal} books</span>
        </div>

        <span className="goal-progress__percentage">
          {Math.round(percentage)}%
        </span>
      </div>

      <div
        className="goal-progress__track"
        role="progressbar"
        aria-label="Annual reading goal progress"
        aria-valuemin={0}
        aria-valuemax={safeGoal || 1}
        aria-valuenow={Math.min(safeCompleted, safeGoal || 1)}
      >
        <div
          className="goal-progress__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="stats-card__description">
        {safeGoal === 0
          ? "Set a reading goal to get started."
          : remaining === 0
            ? "You've reached your reading goal."
            : `${remaining} more ${remaining === 1 ? "book" : "books"
            } to reach your goal.`}
      </p>
    </section>
  );
}
