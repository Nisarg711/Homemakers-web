'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';

const PropertyCard = ({ property = {} }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const {
    id = 1,
    apn = 1,
    title = 'Modern Apartment',
    location = 'Downtown Area',
    price = '₹45,00,000',
    bedrooms = 3,
    bathrooms = 2,
    area = '1,200 sq.ft',
    image = null,
    availableFor = 'sale'
  } = property;

  const handleViewDetails = () => {
    router.push(`/property/${property.apn}`);
  };

  return (
    <div className="bg-dark-bg-secondary rounded-lg shadow-dark-lg border border-dark-border overflow-hidden hover:border-accent-primary/40 hover:shadow-glow transition duration-300">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-dark-bg-tertiary via-dark-bg-secondary to-accent-primary/10 flex items-center justify-center overflow-hidden group">
        <p className="text-dark-text-muted">Property Image</p>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-dark-bg-secondary/90 rounded-full shadow-dark-md hover:bg-dark-bg-hover transition z-10 border border-dark-border"
        >
          <Heart
            size={20}
            className={isFavorite ? 'text-red-400 fill-red-400' : 'text-dark-text-muted'}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="text-2xl font-bold text-accent-primary mb-2">{price}</div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-dark-text mb-1 line-clamp-2">
          {title}
        </h3>
        {/* Available For */}
        <p className="text-sm text-dark-text-secondary mb-2 capitalize">For {availableFor}</p>
        {/* Location */}
        <div className="flex items-center gap-2 text-dark-text-secondary text-sm mb-4">
          <MapPin size={16} className="text-accent-primary" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-t border-b border-dark-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-dark-text-secondary mb-1">
              <Bed size={16} />
            </div>
            <p className="text-xs text-dark-text-secondary">{bedrooms} Beds</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-dark-text-secondary mb-1">
              <Bath size={16} />
            </div>
            <p className="text-xs text-dark-text-secondary">{bathrooms} Baths</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-dark-text-secondary mb-1">
              <Maximize2 size={16} />
            </div>
            <p className="text-xs text-dark-text-secondary">{area}</p>
          </div>
        </div>

        {/* View More Button */}
        <button
          onClick={() => handleViewDetails()}
          className="w-full bg-accent-primary hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition shadow-dark-md"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
