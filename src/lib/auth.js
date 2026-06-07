import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "./db";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /*
      When user submits the login form, 
      signIn("credentials", { email, password }) is called. 
      NextAuth runs your authorize() function:
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { rows } = await pool.query(
          `SELECT user_id, name, email, password, user_type, status 
           FROM project.users 
           WHERE email = $1`,
          [credentials.email]
        );

        const user = rows[0];
        if (!user) return null;
        if (user.status === "Inactive") return null;

        const pwdmatch = await bcrypt.compare(credentials.password, user.password);
        if (!pwdmatch) return null;

        return {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.user_type,
        };
      },
    }),
  ],
  callbacks: {

    /*
    Right after authorize() returns, NextAuth calls your jwt() callback:
jsasync jwt({ token, user }) {
  // user is only available THIS ONE TIME — right after login
  // after this, user is undefined on every other call
  if (user) {
    token.id = user.id;     // UUID
    token.role = user.role; // "Individual


    NextAuth then:

Takes that token object
Encrypts it using your AUTH_SECRET
Stores it as a cookie named authjs.session-token in the browser

The DB is never touched again after this point.

     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
};
const result = NextAuth(authConfig);
export const { handlers, auth, signIn, signOut } =result;