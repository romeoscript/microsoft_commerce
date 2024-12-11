import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { client } from '@/utils/sanity/client';

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    // 1. Find the user by reset token and validate the token expiry
    const user = await client.fetch(
      `*[_type == "admin" && resetToken == $token][0]`,
      { token }
    );

    // Separate checks for invalid token and expired token
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    if (user.resetTokenExpiry <= new Date().toISOString()) {
      return NextResponse.json({ message: 'Expired token' }, { status: 400 });
    }

    // 2. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update the user's password, set isVerified to true, and clear the reset token
    await client
      .patch(user._id)
      .set({ password: hashedPassword, isVerified: true })
      .unset(['resetToken', 'resetTokenExpiry'])
      .commit();

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    console.error('Error in password reset:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
