'use client';

import React, { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';

const PropertyCard = ({ property = {} }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    id = 1,
    title = 'Modern Apartment',
    location = 'Downtown Area',
    price = '₹45,00,000',
    bedrooms = 3,
    bathrooms = 2,
    area = '1,200 sq.ft',
    image = null,
  } = property;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden group">
        <p className="text-gray-400">Property Image</p>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition z-10"
        >
          <Heart
            size={20}
            className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="text-2xl font-bold text-indigo-700 mb-2">{price}</div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
          <MapPin size={16} className="text-red-500" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-t border-b border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <Bed size={16} />
            </div>
            <p className="text-xs text-gray-600">{bedrooms} Beds</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <Bath size={16} />
            </div>
            <p className="text-xs text-gray-600">{bathrooms} Baths</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
              <Maximize2 size={16} />
            </div>
            <p className="text-xs text-gray-600">{area}</p>
          </div>
        </div>

        {/* View More Button */}
        <button className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-lg transition">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
