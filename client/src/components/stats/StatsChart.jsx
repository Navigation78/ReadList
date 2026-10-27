
import React from "react";

export default function StatsChart({
  data = [],
  title = "Reading Activity",
  description = "Books completed each month",
  year = new Date().getFullYear(),
}) {
  const normalizedData = data.map((item) => ({
    month: item.month,
    count: Math.max(
      0,
      Number(item.count ?? item.books ?? 0) || 0
    ),
  }));

  const maxValue = Math.max(
    ...normalizedData.map((item) => item.count),
    1
  );

  return (
    <section className="stats-card">
      <div className="stats-card__header">
        <div>
          <h2>{title}</h2>
          <p className="stats-card__description">
            {description}
          </p>
        </div>

        <span>{year}</span>
      </div>

      {normalizedData.length === 0 ? (
        <p className="stats-chart__empty">
          No reading activity recorded yet.
        </p>
      ) : (
        <div
          className="stats-chart"
          role="img"
          aria-label={normalizedData
            .map(
              (item) =>
                `${item.month}: ${item.count} books`
            )
            .join(", ")}
        >
          {normalizedData.map((item, index) => {
            const height =
              (item.count / maxValue) * 100;

            return (
              <div
                className="stats-chart__column"
                key={`${item.month}-${index}`}
              >
                <span className="stats-chart__value">
                  {item.count}
                </span>

                <div className="stats-chart__bar-area">
                  <div
                    className="stats-chart__bar"
                    style={{ height: `${height}%` }}
                  />
                </div>

                <span className="stats-chart__month">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
