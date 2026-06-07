'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

const ArticleCard = ({ article = {} }) => {
  const {
    id = 1,
    title = 'Article Title',
    description = 'Short article description goes here',
    date = 'Jan 1, 2024',
    image = null,
  } = article;

  return (
    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-tertiary rounded-lg overflow-hidden hover:shadow-glow transition border border-dark-border">
      {/* Image Section */}
      <div className="h-32 bg-gradient-to-br from-dark-bg-tertiary to-accent-primary/10 flex items-center justify-center">
        <p className="text-dark-text-muted text-sm">Article Image</p>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-semibold text-dark-text mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-dark-text-secondary mb-3 line-clamp-2">
          {description}
        </p>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-dark-text-muted">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
