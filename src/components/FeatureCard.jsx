'use client';

import React from 'react';
import { Users, Cpu, Shield } from 'lucide-react';

const iconMap = {
  1: Users,
  2: Cpu,
  3: Shield,
};

const FeatureCard = ({ feature = {}, index = 0 }) => {
  const {
    id = 1,
    title = 'Feature Title',
    description = 'Feature description goes here',
  } = feature;

  const Icon = iconMap[id] || Users;

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-bg-secondary border border-dark-border/60 hover-lift hover:border-accent-primary/30 animate-in">
      {/* Icon in gradient circle */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-dark-md mb-5">
        <Icon size={24} className="text-white" />
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-dark-text mb-2">
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
