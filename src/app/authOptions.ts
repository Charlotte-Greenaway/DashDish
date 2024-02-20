import nextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { handleNewUserReg } from "@/database_actions/users";
import { connectToDb } from "@/database_actions/dbConfig";
import UserModel from "@/models/user-model";
connectToDb();
export const authOptions = {
    secret: process.env.NEXT_AUTH_SECRET!,
    // Configure one or more authentication providers
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
        
      }),
      Google({
        clientId: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
      }),
      DiscordProvider({
        clientId: process.env.DISCORD_ID!,
        clientSecret: process.env.DISCORD_SECRET!,
      })
    ],
    callbacks: {
  
      //implement correct sign in logic
      async signIn({ user }: any) {
        console.log(user)
        // Directly check if the user's email matches the specified address
        const hasAccount = await UserModel.findOne({ email: user?.email });
        console.log(hasAccount)
        if(hasAccount){
          if(!hasAccount.isActive){
            return false;
          }
          return true;
        }else{
          await handleNewUserReg(user?.email, user?.name)
          return true;
        }
      },
      async jwt({ token, user, account }: any) {
        // Initial sign in
        if (account && user) {
          return {
            ...token,
            accessToken: account.access_token,
          };
        }
        return token;
      },
      async session({ session, token}: any) {
        session.accessToken = token.accessToken;   
        return session;
      },
      async redirect({ url, baseUrl}:any) {
        if(new URL(url).pathname=="/login"){
          return baseUrl;
        }
        // Return to the homepage after sign-in
        return url
      },
    },
      pages: {
        signIn: '/login', // Custom sign-in page
        error: '/login',
      },
  };
