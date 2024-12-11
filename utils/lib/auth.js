import { verifyToken } from './jwt';

export function isAdmin(headers) {
  const authHeader = headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  if (!token) return false;

  try {
    const decoded = verifyToken(token);
    return decoded && decoded.role === 'admin';
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}
