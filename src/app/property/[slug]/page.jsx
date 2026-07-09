'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Heart, MapPin, Bed, Bath, Maximize2, Phone, Mail, Home, TrendingUp, Calendar, Clock, X, Share2, ArrowLeft, MapPinIcon, Building2, Users, Award } from 'lucide-react';
import Link from 'next/link';

const TOUR_TIME_SLOTS = Array.from({ length: 41 }, (_, index) => {
  const totalMinutes = 10 * 60 + index * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const displayHour = hours % 12 || 12;
  const period = hours < 12 ? 'AM' : 'PM';

  return {
    value,
    label: `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`,
  };
});

export default function PropertyDetailPage() {
  const params = useParams();
  const { slug: apn } = params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showTourForm, setShowTourForm] = useState(false);
  const [tourData, setTourData] = useState({
    apn: '',
    visitDate: '',
    visitTime: '',
    Issue_date: '',
    Issue_time: '',
  });
  const [tourErrors, setTourErrors] = useState({});
  const [tourSubmitted, setTourSubmitted] = useState(false);
  const [isTourSubmitting, setIsTourSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState({ name: '', phone: '', email: '', message: '' });
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);

  // Fetch property data on mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/fetch/properties?apn=${apn}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch property');
        }
        
        const data = await res.json();
        console.log("Fetched property data: ", data.property);

        const property = {
          apn: data.property.apn,
          title: data.property.title,
          price: data.property.sell?.price ? `₹${data.property.sell.price.toLocaleString()}` : 'Price on request',
          monthlyRent: data.property.rent?.monthlyRent ? `₹${data.property.rent.monthlyRent.toLocaleString()}` : null,
          availableFor: data.property.availableFor,
          status: data.property.status,
          area: data.property.area,
          builtYear: data.property.builtYear,
          type: data.property.type,
          state: data.property.state,
          city: data.property.city,
          district: data.property.district,
          locality: data.property.localAddress,
          pincode: data.property.pincode,
          neighborhood: data.property.neighborhoodInfo,
          images: data.property.images.length > 0 ? data.property.images.map(img => img.url) : ['https://via.placeholder.com/800x600?text=No+Image'],
          amenities: data.property.amenities.length > 0 ? data.property.amenities : ['No amenities listed'],
          owner: {
            name: data.property.owner?.name || 'N/A',
            contact: data.property.owner?.contact || 'N/A',
            email: data.property.owner?.email || 'N/A',
            role: 'Property Owner',
            verified: true,
          },
          agent: data.property.agent ? {
            name: data.property.agent.name || 'N/A',
            contact: data.property.agent.contact || 'N/A',
            email: data.property.agent.email || 'N/A',
            role: 'Real Estate Agent',
            verified: true,
            licenseNo: data.property.agent.licenseNo || 'N/A',
          } : null,
          description: `Located in ${data.property.city}, ${data.property.state}, this ${data.property.type.toLowerCase()} offers ${data.property.area} sq.ft of space. ${data.property.neighborhoodInfo}`,
          highlights: [
            `Built in ${data.property.builtYear}`,
            `Located in ${data.property.district}`,
            `${data.property.area} sq.ft`,
            `Status: ${data.property.status}`,
            `Available for: ${data.property.availableFor}`
          ]
        };
        
        setProperty(property);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (apn) {
      fetchProperty();
    }
  }, [apn]);
  // Handle contact form
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactData);
    alert('Thank you! We will contact you soon.');
    setShowContactForm(false);
    setContactData({ name: '', phone: '', email: '', message: '' });
  };

  const getLocalDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleTourChange = (e) => {
    const { name, value } = e.target;
    setTourData((prev) => ({ ...prev, [name]: value }));
    setTourSubmitted(false);
    if (tourErrors[name]) {
      setTourErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateTour = () => {
    const errors = {};
    const { visitDate, visitTime } = tourData;

    if (!visitDate) {
      errors.visitDate = 'Select a visit date.';
    } else if (visitDate < getLocalDate()) {
      errors.visitDate = 'The visit date cannot be in the past.';
    }

    if (!visitTime) {
      errors.visitTime = 'Select a visit time.';
    } else if (visitTime < '10:00' || visitTime > '20:00') {
      errors.visitTime = 'Tours are available between 10:00 AM and 8:00 PM.';
    }

    if (visitDate && visitTime) {
      const selectedVisit = new Date(`${visitDate}T${visitTime}`);
      if (Number.isNaN(selectedVisit.getTime())) {
        errors.visitTime = 'Select a valid visit date and time.';
      } else if (selectedVisit <= new Date()) {
        errors.visitTime = 'The visit time must be in the future.';
      }
    }

    setTourErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTourSubmit = async (e) => {
    e.preventDefault();
    if (!validateTour()) return;

    const appointmentRequest = {
      apn: property.apn,
      visitDate: tourData.visitDate,
      visitTime: tourData.visitTime,
    };

    setIsTourSubmitting(true);
    setTourErrors((prev) => ({ ...prev, submit: '' }));

    try {
      const res = await fetch("/api/appointment/create", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentRequest),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to schedule the tour.');
      }

      setTourData((prev) => ({
        ...prev,
        apn: property.apn,
        Issue_date: data.appointment.issue_date,
        Issue_time: data.appointment.issue_time,
      }));
      setTourSubmitted(true);
    } catch (error) {
      setTourErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setIsTourSubmitting(false);
    }
  };

  const closeTourForm = () => {
    setShowTourForm(false);
    setTourData({
      apn: '',
      visitDate: '',
      visitTime: '',
      Issue_date: '',
      Issue_time: '',
    });
    setTourErrors({});
    setTourSubmitted(false);
    setIsTourSubmitting(false);
  };

  const tabs = ['overview', 'amenities', 'location', 'Point of Contact'];

  const inputClass = "w-full px-3.5 py-2.5 bg-dark-bg-primary border border-dark-border/60 rounded-xl text-dark-text placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary transition text-sm";

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
          <p className="text-dark-text-secondary text-sm font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-accent-light hover:text-accent-primary font-medium mb-6 transition text-sm">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          <div className="bg-dark-bg-secondary rounded-2xl border border-dark-border/60 p-8 text-center">
            <p className="text-dark-text-secondary">{error || 'Property not found'}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
     <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Button */}
        <Link href="/dashboard" className="flex items-center gap-2 text-accent-light hover:text-accent-primary font-medium mb-6 transition text-sm">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Header with Price and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 animate-in">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-text mb-2 break-words tracking-tight">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-bold gradient-text">{property.price}</span>
              <span className="px-3 py-1 bg-accent-primary/15 text-accent-primary rounded-full text-xs font-semibold">
                {property.status}
              </span>
              {property.monthlyRent && (
                <span className="text-xs text-dark-text-secondary bg-dark-bg-tertiary px-3 py-1 rounded-full">Rent: {property.monthlyRent}/month</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 self-end sm:self-start">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2.5 bg-dark-bg-secondary rounded-xl border border-dark-border/60 hover:border-accent-primary/40 hover:bg-dark-bg-hover transition"
            >
              <Heart
                size={16}
                className={isFavorite ? 'text-red-400 fill-red-400' : 'text-dark-text-muted'}
              />
            </button>
            <button className="p-2.5 bg-dark-bg-secondary rounded-xl border border-dark-border/60 hover:border-accent-primary/40 hover:bg-dark-bg-hover transition">
              <Share2 size={16} className="text-dark-text-muted" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-dark-bg-secondary rounded-2xl overflow-hidden border border-dark-border/60 shadow-dark-lg animate-in delay-1">
              <div className="relative h-56 sm:h-96 bg-gradient-to-br from-dark-bg-tertiary via-dark-bg-secondary to-accent-primary/5">
                <img
                  src={property.images[selectedImageIndex]}
                  alt={`Property view ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              <div className="flex gap-2 p-4 bg-dark-bg-secondary border-t border-dark-border/40 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden transition ${
                      selectedImageIndex === idx ? 'border-accent-primary shadow-glow' : 'border-dark-border/40 hover:border-accent-primary/50'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-dark-bg-secondary rounded-2xl border border-dark-border/60 overflow-hidden animate-in delay-2">
              {/* Tab bar with underline indicator */}
              <div className="flex border-b border-dark-border/40 overflow-x-auto scrollbar-none whitespace-nowrap">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 px-4 sm:px-6 font-medium text-center transition text-sm min-w-[100px] relative ${
                      activeTab === tab
                        ? 'text-accent-primary'
                        : 'text-dark-text-secondary hover:text-dark-text'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-5 sm:p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-dark-bg-primary/80 p-4 rounded-xl border border-dark-border/40">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center">
                            <Bed size={16} className="text-accent-primary" />
                          </div>
                          <span className="text-dark-text-secondary text-xs">Bedrooms</span>
                        </div>
                        <p className="text-xl font-bold text-dark-text">{property.bedrooms}</p>
                      </div>
                      <div className="bg-dark-bg-primary/80 p-4 rounded-xl border border-dark-border/40">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center">
                            <Bath size={16} className="text-accent-primary" />
                          </div>
                          <span className="text-dark-text-secondary text-xs">Bathrooms</span>
                        </div>
                        <p className="text-xl font-bold text-dark-text">{property.bathrooms}</p>
                      </div>
                      <div className="bg-dark-bg-primary/80 p-4 rounded-xl border border-dark-border/40">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center">
                            <Maximize2 size={16} className="text-accent-primary" />
                          </div>
                          <span className="text-dark-text-secondary text-xs">Area</span>
                        </div>
                        <p className="text-xl font-bold text-dark-text">{property.area.toLocaleString()} sq.ft</p>
                      </div>
                      <div className="bg-dark-bg-primary/80 p-4 rounded-xl border border-dark-border/40">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center">
                            <Building2 size={16} className="text-accent-primary" />
                          </div>
                          <span className="text-dark-text-secondary text-xs">Built Year</span>
                        </div>
                        <p className="text-xl font-bold text-dark-text">{property.builtYear}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-base font-bold text-dark-text mb-2">About This Property</h3>
                      <p className="text-dark-text-secondary leading-relaxed text-sm">{property.description}</p>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h3 className="text-base font-bold text-dark-text mb-3">Property Highlights</h3>
                      <ul className="space-y-2">
                        {property.highlights?.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-dark-text-secondary text-sm">
                            <span className="w-5 h-5 rounded-full bg-accent-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-accent-primary text-xs">✓</span>
                            </span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h3 className="text-base font-bold text-dark-text mb-4">Amenities & Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {property.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-dark-bg-primary/80 rounded-xl border border-dark-border/40">
                          <div className="w-2 h-2 bg-accent-primary rounded-full shrink-0" />
                          <span className="text-dark-text text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-dark-text mb-4">Location Details</h3>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-3 p-3 bg-dark-bg-primary/80 rounded-xl border border-dark-border/40">
                        <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center shrink-0">
                          <MapPin size={16} className="text-accent-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-dark-text-muted">Address</p>
                          <p className="text-dark-text text-sm">{property.locality}, {property.city}, {property.state}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-dark-bg-primary/80 rounded-xl border border-dark-border/40">
                        <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center shrink-0">
                          <MapPinIcon size={16} className="text-accent-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-dark-text-muted">Postal Code</p>
                          <p className="text-dark-text text-sm">{property.pincode}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-dark-bg-primary/80 rounded-xl border border-dark-border/40">
                        <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center shrink-0">
                          <Home size={16} className="text-accent-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-dark-text-muted">Neighborhood</p>
                          <p className="text-dark-text text-sm">{property.neighborhood}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Point of Contact' && (
                  <div className="space-y-4">
                    {/* Agent Card */}
                    {property.agent ? (
                      <div className="p-4 bg-dark-bg-primary/80 rounded-xl border border-dark-border/40">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center shadow-dark-sm shrink-0">
                            <Users size={24} className="text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-dark-text">{property.agent.name}</h4>
                              {property.agent.verified && (
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full flex items-center gap-1 font-medium">
                                  <Award size={10} /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-dark-text-secondary">{property.agent.role}</p>
                            <p className="text-xs text-dark-text-muted mt-0.5">Lic. No: {property.agent.licenseNo}</p>
                          </div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-dark-border/30">
                          <div className="flex items-center gap-3 text-dark-text-secondary hover:text-accent-primary transition cursor-pointer text-sm">
                            <Phone size={15} />
                            <span>{property.agent.contact}</span>
                          </div>
                          <div className="flex items-center gap-3 text-dark-text-secondary hover:text-accent-primary transition cursor-pointer text-sm">
                            <Mail size={15} />
                            <span>{property.agent.email}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-dark-bg-primary/80 rounded-xl border border-dark-border/40">
                        <p className="text-dark-text-secondary text-sm">No agent assigned for this property</p>
                      </div>
                    )}

                    {/* Owner Card */}
                    <div className="p-4 bg-dark-bg-primary/80 rounded-xl border border-dark-border/40">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-accent-secondary to-accent-primary rounded-xl flex items-center justify-center shadow-dark-sm shrink-0">
                          <Home size={24} className="text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-dark-text">{property.owner.name}</h4>
                            {property.owner.verified && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full flex items-center gap-1 font-medium">
                                <Award size={10} /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-dark-text-secondary">{property.owner.role}</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-dark-border/30">
                        <div className="flex items-center gap-3 text-dark-text-secondary hover:text-accent-primary transition cursor-pointer text-sm">
                          <Phone size={15} />
                          <span>{property.owner.contact}</span>
                        </div>
                        <div className="flex items-center gap-3 text-dark-text-secondary hover:text-accent-primary transition cursor-pointer text-sm">
                          <Mail size={15} />
                          <span>{property.owner.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-5">
            {/* Quick Info Card */}
            <div className="bg-dark-bg-secondary rounded-2xl border border-dark-border/60 p-5 shadow-dark-lg animate-in delay-2">
              <h3 className="text-base font-bold text-dark-text mb-4">Property Type</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-dark-border/40">
                  <span className="text-dark-text-secondary text-sm">Type</span>
                  <span className="text-dark-text font-medium text-sm">{property.type}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-dark-border/40">
                  <span className="text-dark-text-secondary text-sm">Available For</span>
                  <span className="text-dark-text font-medium text-sm">{property.availableFor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-text-secondary text-sm">Status</span>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full font-medium">{property.status}</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-dark-bg-secondary rounded-2xl border border-dark-border/60 p-5 shadow-dark-lg animate-in delay-3">
              <h3 className="text-base font-bold text-dark-text mb-4">Get In Touch</h3>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full bg-accent-primary hover:bg-accent-dark text-white font-semibold py-3 px-4 rounded-xl transition shadow-dark-sm hover:shadow-glow mb-3 text-sm"
              >
                Contact Now
              </button>
              <button
                type="button"
                onClick={() => setShowTourForm(true)}
                className="w-full bg-dark-bg-tertiary hover:bg-dark-bg-hover text-dark-text font-semibold py-3 px-4 rounded-xl transition border border-dark-border/60 flex items-center justify-center gap-2 text-sm"
              >
                <Calendar size={16} />
                Schedule Tour
              </button>

              {showContactForm && (
                <form onSubmit={handleContactSubmit} className="mt-4 space-y-3 pt-4 border-t border-dark-border/40">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactData.name}
                    onChange={handleContactChange}
                    required
                    className={inputClass}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactData.email}
                    onChange={handleContactChange}
                    required
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={contactData.phone}
                    onChange={handleContactChange}
                    required
                    className={inputClass}
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={contactData.message}
                    onChange={handleContactChange}
                    rows="3"
                    className={inputClass + ' resize-none'}
                  />
                  <button type="submit" className="w-full bg-accent-primary hover:bg-accent-dark text-white font-semibold py-2.5 rounded-xl transition text-sm">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>

    {showTourForm && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) closeTourForm();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-dialog-title"
          className="w-full max-w-md rounded-2xl border border-dark-border/60 bg-dark-bg-secondary p-6 shadow-dark-xl slide-down"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id="tour-dialog-title" className="text-xl font-bold text-dark-text">
                Schedule a Tour
              </h2>
              <p className="mt-1 text-sm text-dark-text-secondary">
                {property.title}
              </p>
            </div>
            <button
              type="button"
              onClick={closeTourForm}
              aria-label="Close schedule tour form"
              className="rounded-xl p-2 text-dark-text-muted transition hover:bg-dark-bg-hover hover:text-dark-text"
            >
              <X size={18} />
            </button>
          </div>

          {tourSubmitted ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="font-semibold text-emerald-400">Tour request prepared</p>
                <p className="mt-1 text-sm text-dark-text-secondary">
                  Your visit is set for {tourData.visitDate} at {tourData.visitTime}. It is ready to be sent when the API is connected.
                </p>
              </div>
              <button
                type="button"
                onClick={closeTourForm}
                className="w-full rounded-xl bg-accent-primary px-4 py-3 font-semibold text-white transition hover:bg-accent-dark text-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleTourSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="visitDate" className="mb-2 flex items-center gap-2 text-sm font-medium text-dark-text">
                  <Calendar size={15} className="text-accent-primary" />
                  Visit date
                </label>
                <input
                  id="visitDate"
                  name="visitDate"
                  type="date"
                  value={tourData.visitDate}
                  min={getLocalDate()}
                  onChange={handleTourChange}
                  aria-invalid={Boolean(tourErrors.visitDate)}
                  aria-describedby={tourErrors.visitDate ? 'visit-date-error' : undefined}
                  className={`${inputClass} [color-scheme:dark] ${
                    tourErrors.visitDate ? 'border-red-500' : ''
                  }`}
                />
                {tourErrors.visitDate && (
                  <p id="visit-date-error" className="mt-2 text-sm text-red-400">{tourErrors.visitDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="visitTime" className="mb-2 flex items-center gap-2 text-sm font-medium text-dark-text">
                  <Clock size={15} className="text-accent-primary" />
                  Visit time
                </label>
                <select
                  id="visitTime"
                  name="visitTime"
                  value={tourData.visitTime}
                  onChange={handleTourChange}
                  aria-invalid={Boolean(tourErrors.visitTime)}
                  aria-describedby={tourErrors.visitTime ? 'visit-time-error' : 'visit-time-help'}
                  className={`${inputClass} ${
                    tourErrors.visitTime ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a visit time</option>
                  {TOUR_TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                {tourErrors.visitTime ? (
                  <p id="visit-time-error" className="mt-2 text-sm text-red-400">{tourErrors.visitTime}</p>
                ) : (
                  <p id="visit-time-help" className="mt-2 text-xs text-dark-text-muted">
                    Available from 10:00 AM to 8:00 PM in 15-minute intervals.
                  </p>
                )}
              </div>

              {tourErrors.submit && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {tourErrors.submit}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeTourForm}
                  className="flex-1 rounded-xl border border-dark-border/60 bg-dark-bg-tertiary px-4 py-3 font-semibold text-dark-text transition hover:bg-dark-bg-hover text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTourSubmitting}
                  className="flex-1 rounded-xl bg-accent-primary px-4 py-3 font-semibold text-white transition hover:bg-accent-dark hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60 text-sm"
                >
                  {isTourSubmitting ? 'Scheduling...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )}
    </>
  );
}
