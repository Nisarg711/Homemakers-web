import {NextResponse} from "next/server";
import pool from "@/lib/db";
import {requireAuth} from "@/lib/api-helpers";

export async function POST(request)
{
    const { session, error } = await requireAuth();
    if (error) {
        return error;
    }
    try{
       console.log("Received request to fetch properties with query: ", request.url)
         const body = await request.json();
         console.log("Request body: ", body)
         
    }
    catch(error)
    {
         console.error("Error parsing request: ", error);
        return NextResponse.json({message: "Error parsing request"}, {status: 400});
    }
    return NextResponse.json({message: "This is a placeholder response from the properties API route."});
}