import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import connectdb from "@/middleware/mongoose";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback triggered:', { provider: account?.provider, email: user?.email });
      
      if (account.provider === "google") {
        try {
          console.log('Connecting to database...');
          await connectdb();
          console.log('Database connected successfully');
          
          // Check if user already exists
          console.log('Checking for existing user:', user.email);
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            console.log('Creating new Google user...');
            // Create new user in database
            const newUser = new User({
              name: user.name,
              email: user.email,
              provider: "google",
              providerId: user.id,
            });
            const savedUser = await newUser.save();
            console.log('New Google user created successfully:', savedUser._id, user.email);
          } else {
            console.log('Existing Google user found:', existingUser._id, user.email);
          }
          
          return true;
        } catch (error) {
          console.error("Database error during Google sign-in:", error);
          console.error('Error details:', error.message);
          // Allow sign-in even if database save fails
          return true;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          await connectdb();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error("Error fetching user in session:", error);
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
