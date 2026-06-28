'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, User, Bell, Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppointments } from '@/context/AppointmentsContext';

const Navbar = ({ locations = [], onLocationChange }) => {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('All India');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { appointments, loading } = useAppointments();
  const [theme, setTheme] = useState('dark');
  const [showBuyDropdown, setShowBuyDropdown] = useState(false);
  const buyTimerRef = useRef(null);
  const buyRef = useRef(null);
  const [internalLocations, setInternalLocations] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileCityDropdown, setShowMobileCityDropdown] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch('/api/fetch/locations');
        const data = await res.json();
        if (data && data.locations) {
          setInternalLocations(data.locations);
        }
      } catch (err) {
        console.error("Failed to fetch locations in Navbar:", err);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    return () => {
      if (buyTimerRef.current) clearTimeout(buyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showBuyDropdown) return;
    function handleOutsideClick(e) {
      if (buyRef.current && !buyRef.current.contains(e.target)) {
        setShowBuyDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showBuyDropdown]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!showMobileMenu) return;
    function handleOutsideClick(e) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setShowMobileMenu(false);
        setShowMobileCityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showMobileMenu]);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileCityDropdown(false);
  }, [router]);

  const handleBuyClick = (e) => {
    e.preventDefault();
    setShowBuyDropdown(true);
    if (buyTimerRef.current) clearTimeout(buyTimerRef.current);
    buyTimerRef.current = setTimeout(() => setShowBuyDropdown(false), 3500);
  };

  // Count only upcoming, scheduled appointments
  const pendingAppointments = appointments.filter(
    (appt) => appt.status === 'Scheduled'
  );
  const pendingCount = pendingAppointments.length;
  const locationOptions = [
    { city: 'All India', state: '' },
    ...internalLocations,
  ];

  const filteredLocations = locationOptions.filter((location) =>
    `${location.city} ${location.state}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (location) => {
    setSelectedCity(location.city);
    if (onLocationChange) {
      onLocationChange(location);
    }
    setShowCityDropdown(false);
    setShowMobileCityDropdown(false);
    setSearchQuery('');
    setShowMobileMenu(false);
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <nav className="bg-dark-bg-secondary/95 border-b border-dark-border shadow-dark-lg sticky top-0 z-50 backdrop-blur-xs" ref={mobileMenuRef}>
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Hamburger - mobile only */}
          <button
            onClick={() => {
              setShowMobileMenu(!showMobileMenu);
              if (showMobileMenu) setShowMobileCityDropdown(false);
            }}
            className="md:hidden p-1.5 rounded-lg hover:bg-dark-bg-hover transition text-dark-text-secondary"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">HomeMakers</span>
          </div>

          {/* Desktop city selector */}
          <div className="relative hidden md:block">
            <button
              onMouseEnter={() => setShowCityDropdown(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-bg-hover transition text-dark-text-secondary font-medium"
            >
              <span>{selectedCity}</span>
            </button>

            {showCityDropdown && (
              <div
                onMouseEnter={() => setShowCityDropdown(true)}
                onMouseLeave={() => setShowCityDropdown(false)}
                className="absolute top-full mt-2 w-72 bg-dark-bg-tertiary rounded-lg shadow-dark-xl border border-dark-border p-4 left-0 z-50"
              >
                <div className="mb-4 relative">
                  <Search size={18} className="absolute left-3 top-2.5 text-dark-text-muted" />
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-dark-border rounded-lg bg-dark-bg-secondary text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder:text-dark-text-muted text-sm"
                    autoFocus
                  />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <button
                        key={`${location.state}-${location.city}`}
                        onClick={() => handleCitySelect(location)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${selectedCity === location.city
                            ? 'bg-accent-primary text-white font-semibold'
                            : 'text-dark-text-secondary hover:bg-dark-bg-hover'
                          }`}
                      >
                        <span className="block">{location.city}</span>
                        {location.state && (
                          <span className="block text-xs opacity-70">{location.state}</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-dark-text-muted text-sm text-center py-4">No cities found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative" ref={buyRef}>
              <button
                onClick={handleBuyClick}
                className="text-dark-text-secondary font-medium hover:text-accent-primary transition px-2 py-1 rounded"
                aria-haspopup="true"
                aria-expanded={showBuyDropdown}
              >
                Buy
              </button>

              {showBuyDropdown && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-dark-bg-tertiary rounded-lg shadow-dark-xl border border-dark-border p-3 z-50 text-sm">
                  <p className="text-dark-text-secondary mb-2">Looking to buy? Try searching properties or pick a location.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowBuyDropdown(false); router.push('/search/results'); }}
                      className="flex-1 px-3 py-1 rounded bg-accent-primary text-white text-sm"
                    >
                      Search properties
                    </button>
                    <button
                      onClick={() => { setShowBuyDropdown(false); setShowCityDropdown(true); }}
                      className="flex-1 px-3 py-1 rounded border border-dark-border text-dark-text-secondary text-sm"
                    >
                      Search locations
                    </button>
                  </div>
                </div>
              )}
            </div>

            <a href="/sell" className="text-dark-text-secondary font-medium hover:text-accent-primary transition">Sell</a>
            <a href="#" className="text-dark-text-secondary font-medium hover:text-accent-primary transition">About us</a>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-dark-bg-hover transition text-dark-text-secondary"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Profile Icon with Badge */}
          <button
            onClick={handleProfileClick}
            className="relative p-2 rounded-full hover:bg-dark-bg-hover transition group"
            title={pendingCount > 0 ? `${pendingCount} upcoming appointment${pendingCount > 1 ? 's' : ''}` : undefined}
          >
            <User size={22} className="text-dark-text-secondary" />

            {!loading && pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-dark-bg-secondary">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}

            {/* Tooltip on hover */}
            {pendingCount > 0 && (
              <span className="absolute top-full right-0 mt-2 w-max px-3 py-1.5 bg-dark-bg-tertiary border border-dark-border rounded-lg text-xs text-dark-text-secondary opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-dark-lg hidden sm:block">
                You have {pendingCount} pending appointment{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-dark-border bg-dark-bg-secondary/95 backdrop-blur-xs">
          <div className="px-4 py-3 space-y-1">
            {/* City Selector */}
            <div>
              <button
                onClick={() => setShowMobileCityDropdown(!showMobileCityDropdown)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-dark-bg-hover transition text-dark-text-secondary font-medium"
              >
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{selectedCity}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform ${showMobileCityDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showMobileCityDropdown && (
                <div className="mt-2 bg-dark-bg-tertiary rounded-lg border border-dark-border p-3">
                  <div className="mb-3 relative">
                    <Search size={16} className="absolute left-3 top-2.5 text-dark-text-muted" />
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-dark-border rounded-lg bg-dark-bg-secondary text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder:text-dark-text-muted text-sm"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((location) => (
                        <button
                          key={`mobile-${location.state}-${location.city}`}
                          onClick={() => handleCitySelect(location)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${selectedCity === location.city
                              ? 'bg-accent-primary text-white font-semibold'
                              : 'text-dark-text-secondary hover:bg-dark-bg-hover'
                            }`}
                        >
                          <span className="block">{location.city}</span>
                          {location.state && (
                            <span className="block text-xs opacity-70">{location.state}</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="text-dark-text-muted text-sm text-center py-3">No cities found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Nav Links */}
            <button
              onClick={() => {
                router.push('/search/results');
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-dark-bg-hover transition text-dark-text-secondary font-medium"
            >
              Buy
            </button>
            <a
              href="/sell"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-dark-bg-hover transition text-dark-text-secondary font-medium"
            >
              Sell
            </a>
            <a
              href="#"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2.5 rounded-lg hover:bg-dark-bg-hover transition text-dark-text-secondary font-medium"
            >
              About us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;