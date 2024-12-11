// pages/api/signup.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { createAdmin, getAdminByEmail } from '@/utils/sanity/client';

const secretKey = process.env.NEXT_PRIVATE_JWT_SECRET_KEY;

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Check if admin with the email already exists
    const existingUser = await getAdminByEmail(email);
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Admin with this email already exists' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = {
      id: uuidv4(),
      email,
      name,
      password: hashedPassword,
      role: 'admin', // Ensure role is set to 'admin'
    };

    // Create the admin in Sanity
    const createdAdmin = await createAdmin(newAdmin);

    // Generate JWT token
    const token = jwt.sign(
      { userId: createdAdmin._id, role: 'admin' },
      secretKey,
      { expiresIn: '7d' }
    );

    return new Response(
      JSON.stringify({
        message: 'Admin signed up successfully!',
        user: createdAdmin,
        token,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Error during admin signup:', err);
    return new Response(
      JSON.stringify({ message: 'An error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
