//file này nhằm mục đích tạo một hàm là getCurrentUse
// hàm này có mục đích là kết nối đến database để trả lại thông tin về current user.
// để làm điều này thì nó sẽ gọi một hàm được tạo sẵn bởi next-auth là getServerSession.
// hàm getServerSession này sẽ yêu cầu một số parameters. Do đó, ta sẽ tạo hết các parameters này vào const authOptions và pass cho nó.
// trong authOption này cũng có một hàm callback để trả lại thông tin của user hoặc gọi hàm create user nếu user không tồn tại.
// Lưu ý: user tồn tại hay không hiểu là đã tồn tại trong database chưa (mới với website), chứ không phải là chưa có google, github hay gì.


import { getServerSession } from "next-auth/next";
//•	The first line imports the getServerSession function from next-auth/next, which is a helper function to get the session object on the server side
import { NextAuthOptions, User } from "next-auth";
//•	The second line imports the NextAuthOptions and User types from next-auth, which are used to define the options and the user object for NextAuth.js
import { AdapterUser } from "next-auth/adapters";
//imports the AdapterUser type from next-auth/adapters, which is a type that extends the User type with additional fields for database adapters
import GoogleProvider from "next-auth/providers/google";
//imports the GoogleProvider function from next-auth/providers/google, which is a built-in provider for Google OAuth 2.0 authentication
import jsonwebtoken from 'jsonwebtoken'
//imports the jsonwebtoken module, which is a library for creating and verifying JSON Web Tokens (JWTs)
import { JWT } from "next-auth/jwt";
//imports the JWT type from next-auth/jwt, which is a type that defines the shape of the JWT object for NextAuth.js
import { createUser, getUser } from "./actions";
import { SessionInterface, UserProfile } from "@/common.types";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "grafbase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      );
      
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret);
      return decodedToken as JWT;
    },
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
  },
  callbacks: {
    async session({ session }) {
      const email = session?.user?.email as string;

      try { 
        const data = await getUser(email) as { user?: UserProfile }

        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data?.user,
          },
        };

        return newSession;
      } catch (error: any) {
        console.error("Error retrieving user data: ", error.message);
        return session;
      }
    },
    async signIn({ user }: {
      user: AdapterUser | User
    }) {
      try {
        const userExists = await getUser(user?.email as string) as { user?: UserProfile }
        
        if (!userExists.user) {
          await createUser(user.name as string, user.email as string, user.image as string)
        }

        return true;
      } catch (error: any) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as SessionInterface;

  return session;
}
