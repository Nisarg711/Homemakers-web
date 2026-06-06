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