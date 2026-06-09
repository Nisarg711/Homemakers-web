import {NextResponse} from "next/server";
import pool from "@/lib/db";
import {requireAuth} from "@/lib/api-helpers";

export async function GET() {
    const { error } = await requireAuth();
    if (error) {
        return error;
    }
    try{
        const query=`
            SELECT DISTINCT state, city
            FROM project.property
            ORDER BY city, state
        `;

        const result = await pool.query(query);
        const locations = result.rows.map((row) => ({
            state: row.state,
            city: row.city,
        }));

        return NextResponse.json({locations}, {status: 200});
    }
    catch(err){
        console.error("Error fetching locations:", err);
        return NextResponse.json({message: "Error fetching locations", error: err.message}, {status: 500});

    }
}
