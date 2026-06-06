import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const formdata = await request.json();
    const name = formdata.username;
    const email = formdata.email;
    const contactNo = formdata.contactNo;
    const password = formdata.password;
    const confirmPassword = formdata.confirmPassword;
    const usertype = formdata.userType;
    const officeAddress = formdata.officeAddress || "";
    const officeContact = formdata.officeContact || "";

    // Validation
    if (!name || !email || !password || !contactNo || !usertype) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const userTypeMap = {
      individual: "Individual",
      agent: "Agent",
      firm: "Firm",
    };
    const dbUserType = userTypeMap[usertype.toLowerCase()];
    if (!dbUserType) {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    if (dbUserType === "Firm" && !officeAddress) {
      return NextResponse.json(
        { error: "Office address is required for Firm accounts" },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existing = await pool.query(
      `SELECT user_id FROM project.users WHERE email = $1`,
      [email]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO project.users (name, email, password, user_type, contact_no, status)
       VALUES ($1, $2, $3, $4, $5, 'Active')
       RETURNING user_id`,
      [name, email, hashedPassword, dbUserType, BigInt(contactNo)]
    );
    const userId = result.rows[0].user_id;

    // Insert firm details if applicable
    if (dbUserType === "Firm") {
      await pool.query(
        `INSERT INTO project.firms (user_id, office_name, office_address)
         VALUES ($1, $2, $3)`,
        [userId, name, officeAddress]
      );

      if (officeContact) {
        await pool.query(
          `INSERT INTO project.firm_contact (user_id, office_contact)
           VALUES ($1, $2)`,
          [userId, BigInt(officeContact)]
        );
      }
    }

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Register error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong", detail: error.message },
      { status: 500 }
    );
  }
}