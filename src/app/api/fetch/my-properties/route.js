import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

export async function GET(request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const query = `
      SELECT 
        p.apn, p.title, p.city, p.state, p.status,
        a.visit_date, a.visit_time, a.issue_date, a.issue_time, 
        a.status AS appointment_status,
        u.name AS visitor_name, 
        u.contact_no AS visitor_contact, 
        u.email AS visitor_email
      FROM project.property p
      LEFT JOIN project.appointment a ON p.apn = a.property_id
      LEFT JOIN project.users u ON a.user_id = u.user_id
      WHERE p.owner_id = $1
      ORDER BY p.apn ASC
    `;
    const res = await pool.query(query, [`${session.user.id}`]);
    console.log(res);
    // TODO: run pool.query with this query, passing session.user.id as the param

    // TODO: group rows by apn using a Map — same exact pattern as your 
    // property-detail route's image grouping. Each property entry should have
    // an `appointments: []` array, and you push one appointment object per row
    // that actually HAS a visit_date (skip pushing anything if a.visit_date is null,
    // since that just means "this property has zero appointments")

    // TODO: return NextResponse.json({ properties: Array.from(propertiesMap.values()) })

    const propertiesMap = new Map();

    res.rows.forEach((row) => {
      if (!propertiesMap.has(row.apn)) {
        propertiesMap.set(row.apn, {
          apn: row.apn,
          title: row.title,
          city: row.city,
          state: row.state,
          status: row.status,
          appointments: [],
        });
      }

      // Only push an appointment entry if this row actually represents one
      if (row.visit_date) {
        propertiesMap.get(row.apn).appointments.push({
          visit_date: row.visit_date,
          visit_time: row.visit_time,
          issue_date: row.issue_date,
          issue_time: row.issue_time,
          status: row.appointment_status,
          visitor_name: row.visitor_name,
          visitor_contact: row.visitor_contact,
          visitor_email: row.visitor_email,
        });
      }
    });

    return NextResponse.json(
      { properties: Array.from(propertiesMap.values()) },
      { status: 200 }
    );
  } catch (err) {
    console.error("My properties fetch error:", err.message);
    return NextResponse.json({ error: "Failed to fetch your properties" }, { status: 500 });
  }
}