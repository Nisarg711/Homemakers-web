import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

export async function POST(request) {
  try {
    const { session, error } = await requireAuth();
    if (error) {
      return error;
    }

    if (!session.user?.id) {
      return NextResponse.json(
        { error: "Authenticated user ID is unavailable" },
        { status: 401 }
      );
    }

    const { apn, visitDate, visitTime } = await request.json();

    if (!/^\d+$/.test(String(apn))) {
      return NextResponse.json(
        { error: "A valid property APN is required" },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate || "")) {
      return NextResponse.json(
        { error: "Visit date must use YYYY-MM-DD format" },
        { status: 400 }
      );
    }

    const parsedVisitDate = new Date(`${visitDate}T00:00:00Z`);
    if (
      Number.isNaN(parsedVisitDate.getTime()) ||
      parsedVisitDate.toISOString().slice(0, 10) !== visitDate
    ) {
      return NextResponse.json(
        { error: "Visit date is invalid" },
        { status: 400 }
      );
    }

    if (!/^\d{2}:\d{2}$/.test(visitTime || "")) {
      return NextResponse.json(
        { error: "Visit time must use HH:mm format" },
        { status: 400 }
      );
    }

    const [hours, minutes] = visitTime.split(":").map(Number);
    const validTourTime =
      hours >= 10 &&
      hours <= 20 &&
      minutes >= 0 &&
      minutes < 60 &&
      minutes % 15 === 0 &&
      !(hours === 20 && minutes !== 0);

    if (!validTourTime) {
      return NextResponse.json(
        { error: "Visit time must be a 15-minute slot between 10:00 and 20:00" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO project.appointment (
         user_id,
         property_id,
         issue_date,
         issue_time,
         visit_date,
         visit_time,
         status
       )
       SELECT
         $1,
         $2,
         (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date,
         (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::time,
         $3::date,
         $4::time,
         'Scheduled'::project.app_status
       WHERE ($3::date + $4::time) >
             (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')
       RETURNING
         user_id,
         property_id,
         issue_date,
         issue_time,
         visit_date,
         visit_time,
         status`,
      [session.user.id, String(apn), visitDate, visitTime]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Visit date and time must be in the future" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Appointment scheduled successfully",
        appointment: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment error:", error);
    return NextResponse.json(
      { error: "Unable to schedule appointment" },
      { status: 500 }
    );
  }
}
