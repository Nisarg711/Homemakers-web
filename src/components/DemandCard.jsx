'use client';

import React from 'react';

const DemandCard = ({ category = {}, locations = [] }) => {
  const {
    id = 1,
    title = 'Apartments',
    subtitle = 'Most searched localities',
  } = category;

  return (
    <div className="bg-dark-bg-secondary rounded-lg shadow-dark-lg border border-dark-border p-6 hover:border-accent-primary/40 hover:shadow-glow transition">
      {/* Header */}
      <h3 className="text-lg font-semibold text-dark-text mb-1">{title}</h3>
      <p className="text-sm text-dark-text-secondary mb-4">{subtitle}</p>

      {/* Top Locations List */}
      <div className="space-y-3">
        {locations.map((location, index) => {
          // Calculate progress bar width based on ranking (100% for #1, decreasing)
          const progressWidth = Math.max(20, 100 - index * 15);

          return (
            <div key={index} className="flex items-center gap-3">
              {/* Rank Number */}
              <span className="text-sm font-bold text-accent-primary min-w-6">#{index + 1}</span>

              {/* Location Name & Progress Bar */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-dark-text">{location}</span>
                </div>
                <div className="h-2 bg-dark-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DemandCard;
