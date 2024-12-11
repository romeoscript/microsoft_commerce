import sendResetMailToUser from '@/utils/lib/sendResetMailToUser';
import { client } from '@/utils/sanity/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const { email } = await req.json();
const formattedEmail = email.toLowerCase();
    // 1. Find the user by email
    const user = await client.fetch(`*[_type == "customer" && email == $email][0]`, { formattedEmail });

    if (!user) {
      return NextResponse.json({ message: 'User with this email does not exist.' }, { status: 404 });
    }

    // 2. Generate a reset token and expiry date
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // 3. Update the user with the reset token and expiry date
    await client
      .patch(user._id)
      .set({ resetToken, resetTokenExpiry })
      .commit();

    // 4. Send the reset email to user
    await sendResetMailToUser(user.email, resetToken);

    return NextResponse.json({ message: 'Password reset link sent' }, { status: 200 });
  } catch (error) {
    console.error('Error in password reset request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
