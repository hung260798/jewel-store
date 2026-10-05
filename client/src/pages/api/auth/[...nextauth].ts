import { API_URL } from "@/constants/URLS";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function fetchUserCart(userId: string, token: string) {
  const resString = await fetch(`${API_URL}/carts/customer/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const { cart } = await resString.json();
  return cart;
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const res = await fetch(`${API_URL}/customers/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.username,
            password: credentials?.password,
          }),
        });
        const tokens = await res.json();
        if (tokens) {
          const userString = await fetch(`${API_URL}/customers/login/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokens.token}`,
            },
          });
          const user = await userString.json();
          user.token = tokens.token;
          user.refreshToken = tokens.refreshToken;
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  pages: {
    signIn: "/dang-nhap",
    error: "/dang-nhap",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token = { ...token, ...session };
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      const cart = await fetchUserCart(
        token?._id as string,
        token?.token as string
      );
      session.carts = cart;
      session.user = token as any;
      return session;
    },
  },
};
export default NextAuth(authOptions);
