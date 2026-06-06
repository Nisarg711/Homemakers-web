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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden hover:shadow-md transition border border-gray-200">
      {/* Image Section */}
      <div className="h-32 bg-gradient-to-br from-indigo-200 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Article Image</p>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
