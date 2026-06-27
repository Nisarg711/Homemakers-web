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
        <p className="text-dark-text-secondary text-lg">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-accent-light hover:text-accent-primary font-medium mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-dark-text mb-2">Search Results</h1>
        <p className="text-dark-text-secondary mb-8">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
        </p>

        {properties.length === 0 ? (
          <div className="bg-dark-bg-secondary rounded-lg border border-dark-border p-12 text-center">
            <SearchX size={40} className="text-dark-text-muted mx-auto mb-4" />
            <p className="text-dark-text-secondary text-lg mb-2">No properties found</p>
            <p className="text-dark-text-muted text-sm">
              Try searching with a different city or fewer filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.apn}
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}