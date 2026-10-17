import { NextAuthOptions, getServerSession } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.id,
                name: profile.username,
                email: profile.email,
                image: profile.avatar
                  ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                  : null,
                role: Role.MEMBER,
                discordId: profile.id,
                discordUsername: `${profile.username}#${profile.discriminator || "0"}`,
              };
            },
          }),
        ]
      : []),
    // Credentials provider for easy developer / demo testing
    CredentialsProvider({
      id: "demo-login",
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        try {
          // Find existing user or return demo user
          let user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            // Auto create demo user if doesn't exist
            const selectedRole = (credentials.role as Role) || Role.MEMBER;
            const name = credentials.email.split("@")[0].toUpperCase();
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: `Demo ${name}`,
                role: selectedRole,
                gameTag: `${name}#ID`,
                image: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
              },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            gameTag: user.gameTag,
            discordUsername: user.discordUsername,
          };
        } catch (error) {
          console.error("Auth authorize error:", error);
          // Return fallback mock session if database is not connected yet
          return {
            id: "demo-user-1",
            email: credentials.email,
            name: credentials.email.split("@")[0].toUpperCase(),
            image: "https://api.dicebear.com/7.x/bottts/svg?seed=demo",
            role: (credentials.role as Role) || Role.MEMBER,
            gameTag: "DEMO#PLAYER",
            discordUsername: "DemoPlayer#1337",
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.gameTag = user.gameTag;
        token.discordUsername = user.discordUsername;
      }

      // Sync role from DB on token refresh if DB is connected
      if (token.id && !user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, gameTag: true, discordUsername: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.gameTag = dbUser.gameTag;
            token.discordUsername = dbUser.discordUsername;
          }
        } catch {
          // ignore db errors in jwt refresh
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) || Role.MEMBER;
        session.user.gameTag = token.gameTag as string | null | undefined;
        session.user.discordUsername = token.discordUsername as string | null | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "nexus-scrim-fallback-development-secret-key-32chars",
};

export const getServerAuthSession = () => getServerSession(authOptions);
