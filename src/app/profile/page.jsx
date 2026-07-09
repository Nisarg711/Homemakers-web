'use client';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { User, Mail, MapPin, ArrowLeft, Calendar, Clock, ChevronDown, ChevronUp, X, Home, Shield, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useAppointments } from '@/context/AppointmentsContext';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { appointments, loading, refetchAppointments } = useAppointments();
  const [showAppointments, setShowAppointments] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const [myProperties, setMyProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [showMyProperties, setShowMyProperties] = useState(false);

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const res = await fetch('/api/fetch/my-properties');
        const data = await res.json();
        console.log("Fetched Props are: ", data);
        setMyProperties(data.properties || []);
      } catch (err) {
        console.error('Failed to fetch your properties:', err);
        setMyProperties([]);
      } finally {
        setPropertiesLoading(false);
      }
    };
    fetchMyProperties();
  }, []);

  useEffect(() => {
    console.log(session);
  }, [status]);

  useEffect(() => {
    console.log("Appointments are: ", appointments)
  }, [appointments])
  const handleCancelAppointment = async (appt) => {
    const apptKey = `${appt.property_id}-${appt.issue_date}-${appt.issue_time}`;
    setCancellingId(apptKey);
    setCancelError(null);

    try {
      // TODO: build this endpoint — should update status to 'Cancelled'
      // for the appointment matching user_id + property_id + issue_date + issue_time
      const res = await fetch('/api/appointment/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apn: appt.property_id,
          Issue_date: appt.issue_date,
          Issue_time: appt.issue_time,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel appointment');
      }

      // Refresh the cached appointments list after successful cancellation
      refetchAppointments();
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  const statusStyles = {
    Scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-accent-light hover:text-accent-primary font-medium mb-6 text-sm transition">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-dark-bg-secondary rounded-2xl shadow-dark-lg border border-dark-border/60 overflow-hidden animate-in">
          {/* Gradient banner */}
          <div className="h-24 bg-gradient-to-r from-accent-primary via-accent-light to-accent-secondary relative">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-secondary to-transparent" />
          </div>

          <div className="px-5 sm:px-8 pb-6 -mt-10 relative">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-dark-lg border-4 border-dark-bg-secondary mb-4">
              <User size={32} className="text-white" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-dark-text mb-1">Your Profile</h1>
            <p className="text-sm text-dark-text-secondary">Manage your account information</p>

            {/* Fields */}
            <div className="space-y-4 mt-6 pt-6 border-t border-dark-border/50">
              <div>
                <label className="block text-xs font-medium text-dark-text-muted mb-1.5 uppercase tracking-wider">Username</label>
                <div className="flex items-center gap-3 p-3 bg-dark-bg-primary/80 rounded-xl text-sm text-dark-text border border-dark-border/50">
                  <User size={16} className="text-dark-text-muted" />
                  {session?.user?.name || 'User Name'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-text-muted mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-3 p-3 bg-dark-bg-primary/80 rounded-xl text-sm text-dark-text border border-dark-border/50">
                  <Mail size={16} className="text-dark-text-muted" />
                  {session?.user?.email || 'user@example.com'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-text-muted mb-1.5 uppercase tracking-wider">Account Type</label>
                <div className="flex items-center gap-3 p-3 bg-dark-bg-primary/80 rounded-xl text-sm text-dark-text border border-dark-border/50">
                  <Shield size={16} className="text-dark-text-muted" />
                  {session?.user?.role || 'Role'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-text-muted mb-1.5 uppercase tracking-wider">Location</label>
                <div className="flex items-center gap-3 p-3 bg-dark-bg-primary/80 rounded-xl text-sm text-dark-text border border-dark-border/50">
                  <MapPin size={16} className="text-dark-text-muted" />
                  All India
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-6 border-t border-dark-border/50 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-accent-primary hover:bg-accent-dark text-white font-semibold py-2.5 px-4 rounded-xl transition shadow-dark-sm hover:shadow-glow text-sm">
                Edit Profile
              </button>
              <button className="flex-1 bg-dark-bg-tertiary hover:bg-dark-bg-hover text-dark-text font-semibold py-2.5 px-4 rounded-xl transition border border-dark-border/60 text-sm">
                Change Password
              </button>
            </div>

            <button onClick={() => signOut()} className="w-full mt-3 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/15 text-red-400 hover:text-red-300 border border-red-500/20 font-semibold py-2.5 px-4 rounded-xl transition text-sm">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* My Appointments Section */}
        <div className="bg-dark-bg-secondary rounded-2xl shadow-dark-lg border border-dark-border/60 mt-6 overflow-hidden animate-in delay-2">
          <button
            onClick={() => setShowAppointments(!showAppointments)}
            className="w-full flex items-center justify-between p-5 hover:bg-dark-bg-hover/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-primary/15 flex items-center justify-center">
                <Calendar size={18} className="text-accent-primary" />
              </div>
              <span className="text-base font-bold text-dark-text">My Appointments</span>
              {appointments.length > 0 && (
                <span className="px-2 py-0.5 bg-accent-primary/15 text-accent-primary text-xs font-bold rounded-full">
                  {appointments.length}
                </span>
              )}
            </div>
            {showAppointments ? (
              <ChevronUp size={18} className="text-dark-text-secondary" />
            ) : (
              <ChevronDown size={18} className="text-dark-text-secondary" />
            )}
          </button>

          {showAppointments && (
            <div className="border-t border-dark-border/50 p-5 space-y-3 slide-down">
              {cancelError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {cancelError}
                </div>
              )}

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-xl border border-dark-border/40 p-4 space-y-3">
                      <div className="skeleton h-4 w-1/3" />
                      <div className="skeleton h-3 w-2/3" />
                      <div className="skeleton h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-dark-text-secondary text-center py-6 text-sm">
                  You have no appointments yet.
                </p>
              ) : (
                appointments.map((appt) => {
                  const apptKey = `${appt.property_id}-${appt.issue_date}-${appt.issue_time}`;
                  const isCancelling = cancellingId === apptKey;
                  const canCancel = appt.status === 'Scheduled';

                  return (
                    <div
                      key={apptKey}
                      className="p-4 bg-dark-bg-primary/80 rounded-xl border border-dark-border/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            href={`/property/${appt.property_id}`}
                            className="flex items-center gap-2 text-accent-light hover:text-accent-primary font-semibold transition text-sm"
                          >
                            <Home size={14} />
                            {appt.title ? appt.title : `Property #${appt.property_id}`}
                          </Link>
                          {(appt.city || appt.local_address) && (
                            <p className="text-xs text-dark-text-secondary mt-1">
                              {appt.local_address ? `${appt.local_address}, ` : ''}{appt.city}{appt.state ? `, ${appt.state}` : ''}
                            </p>
                          )}
                          <p className="text-xs text-dark-text-muted mt-0.5">APN: {appt.property_id}</p>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[appt.status] || 'bg-dark-bg-tertiary text-dark-text-secondary border-dark-border'
                            }`}
                        >
                          {appt.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-dark-text-secondary">
                          <Calendar size={13} className="text-dark-text-muted" />
                          <span className="text-xs">Visit: {appt.visit_date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-dark-text-secondary">
                          <Clock size={13} className="text-dark-text-muted" />
                          <span className="text-xs">{appt.visit_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-dark-text-muted text-xs col-span-2">
                          <span>Requested on {appt.issue_date} at {appt.issue_time}</span>
                        </div>
                      </div>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelAppointment(appt)}
                          disabled={isCancelling}
                          className="w-full mt-3 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/15 text-red-400 hover:text-red-300 border border-red-500/20 font-medium py-2 rounded-xl transition disabled:opacity-50 text-xs"
                        >
                          <X size={13} />
                          {isCancelling ? 'Cancelling...' : 'Cancel Appointment'}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* My Listed Properties Section */}
        <div className="bg-dark-bg-secondary rounded-2xl shadow-dark-lg border border-dark-border/60 mt-6 overflow-hidden animate-in delay-3">
          <button
            onClick={() => setShowMyProperties(!showMyProperties)}
            className="w-full flex items-center justify-between p-5 hover:bg-dark-bg-hover/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-primary/15 flex items-center justify-center">
                <Home size={18} className="text-accent-primary" />
              </div>
              <span className="text-base font-bold text-dark-text">My Listed Properties</span>
              {myProperties.length > 0 && (
                <span className="px-2 py-0.5 bg-accent-primary/15 text-accent-primary text-xs font-bold rounded-full">
                  {myProperties.length}
                </span>
              )}
            </div>
            {showMyProperties ? (
              <ChevronUp size={18} className="text-dark-text-secondary" />
            ) : (
              <ChevronDown size={18} className="text-dark-text-secondary" />
            )}
          </button>

          {showMyProperties && (
            <div className="border-t border-dark-border/50 p-5 space-y-3 slide-down">
              {propertiesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-xl border border-dark-border/40 p-4 space-y-3">
                      <div className="skeleton h-4 w-1/3" />
                      <div className="skeleton h-3 w-2/3" />
                      <div className="skeleton h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : myProperties.length === 0 ? (
                <p className="text-dark-text-secondary text-center py-6 text-sm">
                  You haven't listed any properties yet.
                </p>
              ) : (
                myProperties.map((property) => {
                  const hasAppointments = property.appointments.length > 0;

                  return (
                    <div
                      key={property.apn}
                      className="p-4 bg-dark-bg-primary/80 rounded-xl border border-dark-border/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            href={`/property/${property.apn}`}
                            className="flex items-center gap-2 text-accent-light hover:text-accent-primary font-semibold transition text-sm"
                          >
                            <Home size={14} />
                            {property.title}
                          </Link>
                          <p className="text-xs text-dark-text-secondary mt-1">
                            {property.city}{property.state ? `, ${property.state}` : ''}
                          </p>
                          <p className="text-xs text-dark-text-muted mt-0.5">APN: {property.apn}</p>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[property.status] || 'bg-dark-bg-tertiary text-dark-text-secondary border-dark-border'
                            }`}
                        >
                          {property.status}
                        </span>
                      </div>

                      {/* Nested appointments */}
                      <div className="mt-3 pt-3 border-t border-dark-border/40">
                        {!hasAppointments ? (
                          <p className="text-dark-text-muted text-xs italic">
                            No appointments scheduled yet.
                          </p>
                        ) : (
                          <div className="space-y-2.5">
                            <p className="text-xs font-semibold text-dark-text-secondary uppercase tracking-wider">
                              {property.appointments.length} appointment{property.appointments.length > 1 ? 's' : ''}
                            </p>
                            {property.appointments.map((appt, idx) => (
                              <div
                                key={`${property.apn}-${idx}`}
                                className="p-3 bg-dark-bg-secondary rounded-xl border border-dark-border/40"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="text-dark-text font-medium text-sm">
                                      {appt.visitor_name || 'Unknown visitor'}
                                    </p>
                                    <p className="text-dark-text-muted text-xs">
                                      {appt.visitor_email || 'No email'} · {appt.visitor_contact || 'No contact'}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[appt.status] || 'bg-dark-bg-tertiary text-dark-text-secondary border-dark-border'
                                      }`}
                                  >
                                    {appt.status}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-dark-text-secondary">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar size={11} className="text-dark-text-muted" />
                                    {appt.visit_date}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock size={11} className="text-dark-text-muted" />
                                    {appt.visit_time}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}