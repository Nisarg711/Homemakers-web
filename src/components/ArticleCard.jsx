'use client';

import React from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

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
      className="group bg-dark-bg-secondary rounded-2xl overflow-hidden border border-dark-border/60 cursor-pointer hover-lift hover:border-accent-primary/30 animate-in"
    >
      {/* Image Section */}
      <div className="relative h-36 bg-gradient-to-br from-accent-primary/10 via-dark-bg-tertiary to-accent-secondary/10 flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-secondary via-accent-primary to-accent-light opacity-50" />
        <div className="w-10 h-10 rounded-xl bg-accent-primary/15 flex items-center justify-center">
          <ExternalLink size={18} className="text-accent-primary" />
        </div>

        {/* Hover arrow */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-dark-bg-secondary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={14} className="text-accent-primary" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-sm font-semibold text-dark-text mb-2 line-clamp-2 group-hover:text-accent-primary transition-colors leading-snug">
          {title}
        </h3>

        {/* Content Preview */}
        <p className="text-xs text-dark-text-secondary mb-4 line-clamp-3 leading-relaxed">
          {truncateContent(content)}
        </p>

        {/* Read More Link */}
        <div className="flex items-center gap-1.5 text-xs text-accent-primary font-medium group-hover:gap-2.5 transition-all">
          <span>Read article</span>
          <ArrowUpRight size={12} />
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
