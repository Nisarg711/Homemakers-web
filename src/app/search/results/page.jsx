'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import { ArrowLeft, SearchX } from 'lucide-react';
import Link from 'next/link';

export default function SearchResultsPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('searchResults');
      const parsed = stored ? JSON.parse(stored) : [];
      setProperties(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error('Failed to read search results:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
          <p className="text-dark-text-secondary text-sm font-medium">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-accent-light hover:text-accent-primary font-medium mb-6 transition text-sm"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8 animate-in">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-text tracking-tight">Search Results</h1>
            <p className="text-dark-text-secondary text-sm mt-1">
              Browse properties matching your search
            </p>
          </div>
          <span className="px-3 py-1.5 bg-accent-primary/15 text-accent-primary rounded-full text-xs font-bold self-start sm:self-auto">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="bg-dark-bg-secondary rounded-2xl border border-dark-border/60 p-12 text-center animate-in">
            <div className="w-16 h-16 rounded-2xl bg-dark-bg-tertiary flex items-center justify-center mx-auto mb-4">
              <SearchX size={28} className="text-dark-text-muted" />
            </div>
            <p className="text-dark-text-secondary text-base font-medium mb-1">No properties found</p>
            <p className="text-dark-text-muted text-sm">
              Try searching with a different city or fewer filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <div key={property.apn} className={`delay-${Math.min(index + 1, 6)}`}>
                <PropertyCard
                  property={{
                    apn: property.apn,
                    title: property.title,
                    location: `${property.local_address}, ${property.city}, ${property.state}`,
                    price: property.price
                      ? `₹${property.price.toLocaleString('en-IN')}`
                      : property.monthly_rent
                      ? `₹${property.monthly_rent.toLocaleString('en-IN')}/mo`
                      : 'Price on request',
                    area: `${property.area} sq.ft`,
                    availableFor: property.available_for,
                    type: property.type,
                    image: property.image_url,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}