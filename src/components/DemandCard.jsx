'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

const DemandCard = ({ category = {}, locations = [] }) => {
  const {
    id = 1,
    title = 'Apartments',
    subtitle = 'Most searched localities',
  } = category;

  return (
    <div className="bg-dark-bg-secondary rounded-2xl shadow-dark-lg border border-dark-border/60 overflow-hidden hover-lift hover:border-accent-primary/30 animate-in">
      {/* Header with gradient bar */}
      <div className="relative px-5 pt-5 pb-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-primary via-accent-light to-accent-secondary opacity-60" />
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center">
            <TrendingUp size={16} className="text-accent-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-dark-text">{title}</h3>
            <p className="text-xs text-dark-text-muted">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Top Locations List */}
      <div className="px-5 pb-5 space-y-3">
        {locations.map((location, index) => {
          // Calculate progress bar width based on ranking (100% for #1, decreasing)
          const progressWidth = Math.max(20, 100 - index * 15);

          return (
            <div key={index} className="flex items-center gap-3">
              {/* Rank Badge */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                index === 0
                  ? 'bg-accent-primary/20 text-accent-primary'
                  : 'bg-dark-bg-tertiary text-dark-text-muted'
              }`}>
                {index + 1}
              </div>

              {/* Location Name & Progress Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-dark-text truncate">{location}</span>
                </div>
                <div className="h-1.5 bg-dark-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-light rounded-full transition-all duration-700 ease-out"
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
