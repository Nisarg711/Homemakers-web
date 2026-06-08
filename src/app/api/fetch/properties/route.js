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
         
         const { state, city, district } = body;

         if (!state) {
            return NextResponse.json({message: "State is required"}, {status: 400});
         }

         // Query with priority matching: exact match (state + city + district) OR state-only fallback
         const query = `
            SELECT 
              p.apn,
              p.built_year,
              p.status,
              p.map_url,
              p.area,
              p.state,
              p.city,
              p.district,
              p.local_address,
              p.pincode,
              p.neighborhood_info,
              p.title,
              p.available_for,
              p.type,
              p.tour_url,
              p.society_reg_no,
              r.monthly_rent,
              r.security_deposit,
              s.price,
              u.user_id,
              u.name as owner_name,
              u.contact_no as owner_contact,
              u.email as owner_email,
              pi.image_url,
              pi.description as image_description,
              CASE 
                WHEN p.state = $1 AND p.city = $2 AND p.district = $3 THEN 1
                ELSE 2
              END as match_priority
            FROM project.property p
            LEFT JOIN project.rent r 
              ON p.apn = r.property_id AND p.owner_id = r.owner_id
            LEFT JOIN project.sell s 
              ON p.apn = s.property_id AND p.owner_id = s.owner_id
            LEFT JOIN project.users u 
              ON p.owner_id = u.user_id
            LEFT JOIN project.property_image pi 
              ON p.apn = pi.property_id
            WHERE p.status = 'Available'
              AND (
                (p.state = $1 AND p.city = $2 AND p.district = $3)
                OR (p.state = $1)
              )
            ORDER BY match_priority ASC, p.apn ASC
         `;

         const result = await pool.query(query, [state, city, district]);
         
         console.log(`Found ${result.rows.length} properties matching criteria`);
         
         // Group results by property APN to handle multiple images per property
         const propertiesMap = new Map();
         
         result.rows.forEach(row => {
            const apn = row.apn;
            if (!propertiesMap.has(apn)) {
               propertiesMap.set(apn, {
                  apn: row.apn,
                  builtYear: row.built_year,
                  status: row.status,
                  mapUrl: row.map_url,
                  area: row.area,
                  state: row.state,
                  city: row.city,
                  district: row.district,
                  localAddress: row.local_address,
                  pincode: row.pincode,
                  neighborhoodInfo: row.neighborhood_info,
                  title: row.title,
                  availableFor: row.available_for,
                  type: row.type,
                  tourUrl: row.tour_url,
                  societyRegNo: row.society_reg_no,
                  rent: row.monthly_rent ? {
                     monthlyRent: row.monthly_rent,
                     securityDeposit: row.security_deposit
                  } : null,
                  sell: row.price ? {
                     price: row.price
                  } : null,
                  owner: row.user_id ? {
                     userId: row.user_id,
                     name: row.owner_name,
                     contact: row.owner_contact,
                     email: row.owner_email
                  } : null,
                  images: []
               });
            }
            
            // Add image if present
            if (row.image_url) {
               propertiesMap.get(apn).images.push({
                  url: row.image_url,
                  description: row.image_description
               });
            }
         });

         const properties = Array.from(propertiesMap.values());
         
         return NextResponse.json({
            success: true,
            count: properties.length,
            properties: properties
         }, {status: 200});
         
    }
    catch(error)
    {
         console.error("Error fetching properties: ", error);
        return NextResponse.json({message: "Error fetching properties", error: error.message}, {status: 500});
    }
}