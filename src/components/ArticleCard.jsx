'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

const ArticleCard = ({ article = {} }) => {
  const {
    title = 'Article Title',
    content = 'Article content goes here',
    url = '#',
  } = article;

  // Truncate content to relevant preview (first 150 characters)
  const truncateContent = (text, maxLength = 150) => {
    if (!text) return 'Click to read more...';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleClick = () => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-tertiary rounded-lg overflow-hidden hover:shadow-glow hover:scale-105 transition border border-dark-border cursor-pointer"
    >
      {/* Image Section */}
      <div className="h-32 bg-gradient-to-br from-dark-bg-tertiary to-accent-primary/10 flex items-center justify-center">
        <p className="text-dark-text-muted text-sm">Real Estate News</p>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-semibold text-dark-text mb-2 line-clamp-2 hover:text-accent-primary transition">
          {title}
        </h3>

        {/* Content Preview */}
        <p className="text-sm text-dark-text-secondary mb-3 line-clamp-3">
          {truncateContent(content)}
        </p>

        {/* Read More Link */}
        <div className="flex items-center gap-2 text-xs text-accent-primary hover:text-accent-secondary transition">
          <span>Read more</span>
          <ExternalLink size={12} />
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
