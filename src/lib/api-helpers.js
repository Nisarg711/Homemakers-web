import { auth } from "@/lib/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    return {
      session: null,
      error: new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      }),
    };
  }
  return { session, error: null };
}