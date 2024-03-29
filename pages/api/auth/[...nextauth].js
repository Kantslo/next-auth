import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async (credentials) => {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error("User not found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could not log in!");
        }

        client.close();

        return { email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
    async session(session, user) {
      session.user.email = user.email;
      return session;
    },
  },
});
