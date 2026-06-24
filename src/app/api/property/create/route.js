import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

export async function POST(request) {
    const {session,error}=requireAuth();
     if(error)
    {
        return error;
    }
    try{
        const body=await request.json()
        const userid=session.user.id;
        console.log("Received Property: ",body);
        return NextResponse.json(
      {
        message: "Successfully added your property!!"
      },
      { status: 201 }
    );
    }
    catch(err)
    {
        return NextResponse.json({"error":"Error adding Property"},{"status":500})
    }
}