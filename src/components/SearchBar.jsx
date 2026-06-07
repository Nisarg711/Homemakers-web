'use client';

import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import {useGeolocation} from '@/hooks/useGeolocation';
const SearchBar = () => {
  const [activeFilter, setActiveFilter] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Search query:', searchQuery);
    console.log('Filter:', activeFilter);
    // TODO: Implement search functionality
  };
const { location, error, loading, getLocation } = useGeolocation();

  return (
    <div className="w-full bg-dark-bg-secondary/95 shadow-dark-xl rounded-lg overflow-hidden mx-auto max-w-6xl -mt-8 relative z-20 border border-dark-border backdrop-blur-xs">
      <div className="flex items-center px-6 py-4 gap-4">
        {/* Filter Buttons */}
        <div className="flex gap-2 border-r border-dark-border pr-6">
          {[
            { id: 'buy', label: 'Buy' },
            { id: 'rent', label: 'Rent' },
            { id: 'Both', label: 'Both' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                activeFilter === filter.id
                  ? 'bg-accent-primary text-white shadow-dark-md'
                  : 'bg-dark-bg-tertiary text-dark-text-secondary hover:bg-dark-bg-hover'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by locality, project, or landmark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-transparent focus:outline-none placeholder:text-dark-text-muted text-dark-text"
          />
        </div>

        {/* Location Button (Icon Only) */}
        <button
          onClick={()=>{
            getLocation();
            if(location)
            {
              console.log('User location:', location);
            }
            else
            {
              console.log(error)
            }
          }}
          className="p-2 hover:bg-dark-bg-hover rounded-lg transition text-accent-primary"
        >
          <MapPin size={22} />
        </button>

        {/* Search Button (Icon Only) */}
        <button
          onClick={handleSearch}
          className="p-2 bg-accent-primary hover:bg-accent-dark text-white rounded-lg transition shadow-dark-md"
        >
          <Search size={22} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
