'use client';
import { useState, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { useRef } from 'react';
import { useRouter } from "next/navigation";

const SearchBar = ({ onLocationRequest, location, locationLoading, userAddress }) => {
  const [activeFilter, setActiveFilter] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const searchContainerRef = useRef(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    async function fetchsuggestions() {
      setSuggestionsLoading(true);
      try {
        const trimmedQuery = searchQuery.trim();
        const result = await fetch(`/api/search/suggestions?query=${encodeURIComponent(trimmedQuery)}`);
        const res = await result.json();
        console.log(res)
        setSuggestions(res.suggestions || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestions fetch error:", err);
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchsuggestions();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (selectedLocations.length === 0) {
      console.log('No locations selected');
      return;
    }

    try {
      const res = await fetch('/api/search/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: selectedLocations }),
      });
      const data = await res.json();
      console.log("Search results: ", data);
      sessionStorage.setItem('searchResults', JSON.stringify(data.properties));
      router.push('/search/results');
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handlesuggestionClick = (suggestion) => {
    if (suggestion.type == "property") {
      setShowSuggestions(false);
      router.push(`/property/${suggestion.apn}`);
    }
    if (suggestion.type == "city") {
      const city = {
        "city": suggestion.label,
        "state": suggestion.subtitle
      }
      if (selectedLocations.some((ele) => {
        return ((ele.city == city.city) && (city.state == ele.state));
      }) == false) {
        setSelectedLocations([...selectedLocations, city])
        setSearchQuery('');
        setShowSuggestions(false);
      }
    }
  }

  useEffect(() => {
    console.log("check:", selectedLocations)
  }, [selectedLocations])

  const filters = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
    { id: 'Both', label: 'Both' },
  ];

  return (
    <div className="w-full glass-card shadow-dark-xl rounded-2xl overflow-visible mx-auto max-w-6xl -mt-8 relative z-20">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center px-4 sm:px-6 py-4 gap-3 sm:gap-4">

        {/* Filter Buttons — pill style */}
        <div className="flex gap-1.5 sm:border-r border-dark-border sm:pr-5 shrink-0">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${activeFilter === filter.id
                  ? 'bg-accent-primary text-white shadow-glow'
                  : 'bg-dark-bg-tertiary/80 text-dark-text-secondary hover:bg-dark-bg-hover hover:text-dark-text'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search Input + Action Buttons row */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Search Input */}
          <div className="flex-1 relative min-w-0" ref={searchContainerRef}>
            {selectedLocations.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {selectedLocations.map((loc, idx) => (
                  <span
                    key={`${loc.city}-${idx}`}
                    className="flex items-center gap-1.5 px-3 py-1 bg-accent-primary/10 text-accent-primary text-xs sm:text-sm rounded-full border border-accent-primary/25 font-medium"
                  >
                    {loc.city}
                    <button
                      onClick={() => {
                        setSelectedLocations(selectedLocations.filter((ele) => {
                          return ele.city !== loc.city;
                        }))
                      }}
                      className="hover:text-accent-dark transition"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="relative">
              <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-dark-text-muted" />
              <input
                type="text"
                placeholder={
                  userAddress
                    ? `${userAddress.suburb || userAddress.city || 'Search based on City or title of Property'}`
                    : "Search by locality, project, or landmark"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-6 bg-transparent focus:outline-none placeholder:text-dark-text-muted text-dark-text text-sm sm:text-base"
              />
            </div>
            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 mt-3 w-full glass-card rounded-xl shadow-dark-xl max-h-72 overflow-y-auto z-50 slide-down">
                {suggestionsLoading ? (
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-5 w-1/2" />
                    <div className="skeleton h-5 w-2/3" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="py-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={`${suggestion.type}-${suggestion.label}-${idx}`}
                        onClick={() => {
                          handlesuggestionClick(suggestion);
                          console.log(suggestion)
                        }}
                        className="w-full flex items-center justify-between gap-3 text-left px-4 py-2.5 hover:bg-dark-bg-hover/80 transition"
                      >
                        <div className="min-w-0">
                          <span className="block text-dark-text font-medium text-sm truncate">
                            {suggestion.label}
                          </span>
                          <span className="block text-dark-text-muted text-xs truncate">
                            {suggestion.subtitle}
                          </span>
                        </div>
                        <span
                          className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${suggestion.type === 'property'
                              ? 'bg-accent-primary/15 text-accent-primary'
                              : 'bg-dark-bg-tertiary text-dark-text-secondary'
                            }`}
                        >
                          {suggestion.type === 'property' ? 'Property' : 'City'}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-text-muted text-sm text-center py-4">No results found</p>
                )}
              </div>
            )}
          </div>

          {/* Location Button */}
          <button
            onClick={onLocationRequest}
            disabled={locationLoading}
            className={`p-2.5 rounded-xl transition shrink-0 border ${location
              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
              : 'text-accent-primary border-dark-border hover:bg-dark-bg-hover hover:border-accent-primary/30'
              } disabled:opacity-50`}
          >
            <MapPin size={18} />
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="p-2.5 bg-accent-primary hover:bg-accent-dark text-white rounded-xl transition shadow-dark-md hover:shadow-glow shrink-0"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Address display when location is detected */}
      {userAddress && (
        <div className="px-4 sm:px-6 pb-3 flex items-center gap-2 text-xs text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {userAddress.suburb || userAddress.neighbourhood} {userAddress.city || userAddress.village}, {userAddress.state}, {userAddress.country}
        </div>
      )}
    </div>
  );
};

export default SearchBar;