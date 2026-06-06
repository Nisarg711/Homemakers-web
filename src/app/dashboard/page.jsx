'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import ArticleCard from '@/components/ArticleCard';
import DemandCard from '@/components/DemandCard';
import UserCard from '@/components/UserCard';
import FeatureCard from '@/components/FeatureCard';

export default function DashboardPage() {
  const [selectedLocation, setSelectedLocation] = useState('All India');
  const propertyRecommendations = [
    {
      id: 1,
      title: 'property 1',
      location: 'Bandra, Mumbai',
      price: '₹0',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,500 sq.ft'
    },
    {
      id: 2,
      title: 'property 2',
      location: 'Whitefield, Bangalore',
      price: '₹0',
      bedrooms: 4,
      bathrooms: 3,
      area: '3,200 sq.ft'
    },
    {
      id: 3,
      title: 'property 3',
      location: 'Indiranagar, Bangalore',
      price: '₹0',
      bedrooms: 2,
      bathrooms: 2,
      area: '1,100 sq.ft'
    },
  ];

  const topArticles = [
    {
      id: 1,
      title: 'Article 1',
      description: 'description 1',
      date: 'Dec 28, 2024',
    },
    {
      id: 2,
      title: 'Article 2',
      description: 'description 2',
      date: 'Dec 25, 2024',
    },
    {
      id: 3,
      title: 'Article 3',
      description: 'description 3',
      date: 'Dec 20, 2024',
    },
  ];

  const demandData = {
    apartments: ['location1', 'location2', 'location3', 'location4', 'location5'],
    plots: ['location1', 'location2', 'location3', 'location4', 'location5'],
    rawHouse: ['location1', 'location2', 'location3', 'location4', 'location5'],
  };

  const userData = [
    {
      id: 1,
      title: 'Buyers',
      description: 'Find your perfect property with our extensive listings and personalized recommendations.',
      buttonText: 'Buy Now',
    },
    {
      id: 2,
      title: 'Tenants',
      description: 'Browse rental properties and find a home that fits your lifestyle and budget.',
      buttonText: 'Try Now',
    },
    {
      id: 3,
      title: 'Sellers',
      description: 'List your property and connect with qualified buyers in your area.',
      buttonText: 'Sell Now',
    },
  ];

  const features = [
    {
      id: 1,
      title: 'Supports Multiple Users',
      description: 'Manage accounts for buyers, tenants, sellers, agents, and firms all on one platform.',
    },
    {
      id: 2,
      title: 'AI-Powered Platform',
      description: 'Not just an ordinary real estate site. Integrated with AI for our users',
    },
    {
      id: 3,
      title: 'Secure & Transparent',
      description: 'Efficient transaction tracking with privacy',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLocationChange={setSelectedLocation} />

      {/* Hero Section with Background Image */}
      <div 
        className="relative h-64 flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url(./cover.png)',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-lg text-blue-100">
            Explore properties across India with ease
          </p>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="px-6 pb-12">
        <SearchBar />
      </div>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Property Recommendations Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended for You</h2>
          <p className="text-gray-600 mb-8">
            properties based on your preferences
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {propertyRecommendations.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>

        {/* Top Articles Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Demand Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Demand in {selectedLocation}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DemandCard
              category={{ title: 'Apartments', subtitle: 'Most searched localities for Apartments' }}
              locations={demandData.apartments}
            />
            <DemandCard
              category={{ title: 'Plots', subtitle: 'Most searched societies for Plots' }}
              locations={demandData.plots}
            />
            <DemandCard
              category={{ title: 'Raw House', subtitle: 'Most searched localities for Houses' }}
              locations={demandData.rawHouse}
            />
          </div>
        </section>

        {/* Our Users Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userData.map((user) => (
              <UserCard key={user.id} userType={user} />
            ))}
          </div>
        </section>

        {/* Why Homemakers Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Homemakers?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
