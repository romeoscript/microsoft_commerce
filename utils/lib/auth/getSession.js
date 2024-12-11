// utils/auth/session.js
import jwt from 'jsonwebtoken';

export async function getSession(req) {
  const authorizationHeader = req.headers.get('Authorization');
  // console.log("authorization ===>>> ", authorizationHeader);
  
  
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null; // No authorization header or not a Bearer token
  }

  const token = authorizationHeader.split(' ')[1]; // Extract the token part
  console.log("authorization tonek===>>> ", token);

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.NEXT_PRIVATE_JWT_SECRET_KEY);

    // Return the decoded token as the session
    return {
      user: decodedToken,
    };
  } catch (error) {
    // If token verification fails, return null
    console.error('Failed to verify token:', error);
    return null;
  }
}
