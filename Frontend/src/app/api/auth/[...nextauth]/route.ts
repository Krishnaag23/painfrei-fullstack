import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "lib/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          // Convert user.id to a string if it's not already
          return { id: String(user.id), name: user.name, email: user.email };
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Custom signin page
    error: "/auth/error", // Error page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production",
});

export { handler as GET, handler as POST };
