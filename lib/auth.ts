import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import Admin from './models/Admin';

export const authOptions: AuthOptions = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();
        const admin = await Admin.findOne({ email: credentials.email });
        if (!admin) return null;

        const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!isValid) return null;

        return { id: admin._id.toString(), email: admin.email, name: admin.name };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/' },
  secret: process.env.NEXTAUTH_SECRET,
};
