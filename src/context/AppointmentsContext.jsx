"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const AppointmentsContext = createContext(undefined);
export function AppointmentsProvider({children}) {
  const { status } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  /*Every time a React component re-renders, all functions declared inside it are 
recreated from scratch. useCallback stops this behavior by caching the function instance 
in memory. It will only generate a brand-new function instance if its specified 
dependencies change */

 const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fetch/appointments");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data.appointments || []);
      console.log("Fetched Appointments: ",data)
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);
 useEffect(() => {
    if (status === "authenticated") {
      fetchAppointments();
    } else if (status === "unauthenticated") {
      setAppointments([]);
      setLoading(false);
    }
  }, [status, fetchAppointments]);

  return (
    <div>
        {/*Here, refetch appointment is required becuz when a user schedules appointment
        the appointment array won't update on its own, we'll call the fetch appointments once
        again to fetch and get updated appointmentss*/}
      <AppointmentsContext.Provider  value={{ appointments, loading, refetchAppointments: fetchAppointments}}>
            {children}
      </AppointmentsContext.Provider>
    </div>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentsProvider");
  }
  return context;
}
