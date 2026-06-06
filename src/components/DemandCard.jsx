'use client';

import React from 'react';

const DemandCard = ({ category = {}, locations = [] }) => {
  const {
    id = 1,
    title = 'Apartments',
    subtitle = 'Most searched localities',
  } = category;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>

      {/* Top Locations List */}
      <div className="space-y-3">
        {locations.map((location, index) => {
          // Calculate progress bar width based on ranking (100% for #1, decreasing)
          const progressWidth = Math.max(20, 100 - index * 15);

          return (
            <div key={index} className="flex items-center gap-3">
              {/* Rank Number */}
              <span className="text-sm font-bold text-gray-700 min-w-6">#{index + 1}</span>

              {/* Location Name & Progress Bar */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{location}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all"
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
