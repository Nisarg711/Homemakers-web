import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}

/*
Server component  →  use auth()        (async/await, no hook)
Client component  →  use useSession()  (hook, has loading state)
// auth() does:
// 1. reads cookie from request headers
// 2. decrypts it with AUTH_SECRET
// 3. calls your session() callback to shape the data
// 4. returns the result
auth()→  only reads and decrypts the cookie, no DB, no authorize()
 */