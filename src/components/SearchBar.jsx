'use client';

import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

const SearchBar = () => {
  const [activeFilter, setActiveFilter] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLocationClick = () => {
    // TODO: Implement live location fetching from backend
    console.log('Location button clicked - Backend implementation pending');
  };

  const handleSearch = () => {
    console.log('Search query:', searchQuery);
    console.log('Filter:', activeFilter);
    // TODO: Implement search functionality
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden mx-auto max-w-6xl -mt-8 relative z-20">
      <div className="flex items-center px-6 py-4 gap-4">
        {/* Filter Buttons */}
        <div className="flex gap-2 border-r border-gray-300 pr-6">
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
                  ? 'bg-indigo-950 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            className="w-full focus:outline-none placeholder:text-gray-500 text-gray-900"
          />
        </div>

        {/* Location Button (Icon Only) */}
        <button
          onClick={handleLocationClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition text-blue-400"
        >
          <MapPin size={22} />
        </button>

        {/* Search Button (Icon Only) */}
        <button
          onClick={handleSearch}
          className="p-2 bg-indigo-950 hover:bg-indigo-800 text-white rounded-lg transition"
        >
          <Search size={22} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
