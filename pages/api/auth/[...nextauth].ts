import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import { dbUsers } from "../../../database";
import { signIn } from 'next-auth/react';
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {
          label: 'Correo',
          type: 'email',
          placeholder: 'correo@google.com'
        },
        password: {
          label: 'Contraseña',
          type: 'password',
          placeholder: 'Contraseña'
        },
      },
      async authorize(credentials) {
        console.log({credentials});

        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password) as any;
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],


  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  // Callbacks
  jwt: {

  },
  
  // session: {
  //   maxAge: 2592000,
  //   strategy: 'jwt',
  //   updateAge: 86400,
  // },

  callbacks: {
    async jwt({token, user, account}: any) {
      // console.log({token, account, user});
      if (account) {
        token.accessToken = account.access_token;

        switch(account.type) {

          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
            break;

          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },

    async session({session, token, user}: any) {
      // console.log({session, token, user});
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}
export default NextAuth(authOptions)