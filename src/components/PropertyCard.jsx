'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MapPin, Bed, Bath, Maximize2, ArrowRight } from 'lucide-react';

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
    <div className="group bg-dark-bg-secondary rounded-2xl shadow-dark-lg border border-dark-border/60 overflow-hidden hover-lift hover:border-accent-primary/30 animate-in">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-dark-bg-tertiary via-dark-bg-secondary to-accent-primary/5 flex items-center justify-center overflow-hidden">
        {/* Gradient accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-primary via-accent-light to-accent-secondary opacity-60" />
        <p className="text-dark-text-muted text-sm">Property Image</p>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
          className="absolute top-3 right-3 p-2 glass-card rounded-full shadow-dark-md hover:scale-110 transition-transform z-10"
        >
          <Heart
            size={16}
            className={isFavorite ? 'text-red-400 fill-red-400' : 'text-dark-text-muted'}
          />
        </button>

        {/* Availability badge */}
        <span className="absolute bottom-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-accent-primary/90 text-white capitalize shadow-dark-sm">
          For {availableFor}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Price */}
        <div className="text-xl font-bold text-accent-primary mb-1">{price}</div>

        {/* Title */}
        <h3 className="text-base font-semibold text-dark-text mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-dark-text-secondary text-sm mb-4">
          <MapPin size={14} className="text-accent-light shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-3 mb-5 py-3 border-t border-b border-dark-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent-light mb-1">
              <Bed size={14} />
            </div>
            <p className="text-xs text-dark-text-secondary font-medium">{bedrooms} Beds</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent-light mb-1">
              <Bath size={14} />
            </div>
            <p className="text-xs text-dark-text-secondary font-medium">{bathrooms} Baths</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-accent-light mb-1">
              <Maximize2 size={14} />
            </div>
            <p className="text-xs text-dark-text-secondary font-medium">{area}</p>
          </div>
        </div>

        {/* View More Button */}
        <button
          onClick={() => handleViewDetails()}
          className="w-full flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-dark text-white font-semibold py-2.5 px-4 rounded-xl transition shadow-dark-sm hover:shadow-glow group/btn text-sm"
        >
          View Details
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
