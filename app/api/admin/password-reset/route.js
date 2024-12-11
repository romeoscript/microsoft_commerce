import sendResetEmail from '@/utils/lib/sendResetMail';
import { client } from '@/utils/sanity/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const { email } = await req.json();

    // 1. Find the user by email
    const user = await client.fetch(`*[_type == "admin" && email == $email][0]`, { email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 2. Generate a reset token and expiry date
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // 3. Update the user with the reset token and expiry date
    await client
      .patch(user._id)
      .set({ resetToken, resetTokenExpiry })
      .commit();

    // 4. Send the reset email
    await sendResetEmail(user.email, resetToken);

    return NextResponse.json({ message: 'Password reset link sent' }, { status: 200 });
  } catch (error) {
    console.error('Error in password reset request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
