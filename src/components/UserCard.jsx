'use client';

import React from 'react';
import { ArrowRight, ShoppingBag, Key, DollarSign } from 'lucide-react';

const iconMap = {
  'Buyers': ShoppingBag,
  'Tenants': Key,
  'Sellers': DollarSign,
};

const UserCard = ({ userType = {}, image = null }) => {
  const {
    id = 1,
    title = 'Buyers',
    description = 'Find your perfect property',
    buttonText = 'Buy Now',
  } = userType;

  const Icon = iconMap[title] || ShoppingBag;

  return (
    <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden group cursor-pointer border border-dark-border/60 bg-dark-bg-secondary hover-lift hover:border-accent-primary transition-all animate-in">
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7">
        {/* Top Section */}
        <div>
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-dark-bg-tertiary border border-dark-border flex items-center justify-center mb-4 text-accent-primary">
            <Icon size={22} className="text-accent-primary" />
          </div>

          <h3 className="text-2xl font-bold text-dark-text mb-2">{title}</h3>
          <p className="text-dark-text-secondary text-sm leading-relaxed max-w-xs">
            {description}
          </p>
        </div>

        {/* Bottom Section - Button */}
        <div>
          <button className="flex items-center gap-2 text-accent-primary hover:text-accent-light hover:gap-3 transition-all duration-300 group/btn">
            <span className="text-sm font-semibold tracking-wide">{buttonText}</span>
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
