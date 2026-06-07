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
      <div className="text-5xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-4">
        {index + 1}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-dark-text mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-dark-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
