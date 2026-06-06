/* 
This one file handles ALL auth-related API calls automatically:

POST /api/auth/callback/credentials → login
GET /api/auth/signout → logout
GET /api/auth/session → session check
*/
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;