'use client';

import React from 'react';

const FeatureCard = ({ feature = {}, index = 0 }) => {
  const {
    id = 1,
    title = 'Feature Title',
    description = 'Feature description goes here',
  } = feature;

  return (
    <div className="flex flex-col items-center text-center">
      {/* Number */}
      <div className="text-5xl font-bold text-gray-700 mb-4">
        {index + 1}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
