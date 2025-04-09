import { auth } from '@/firebaseAdmin';
/**
 * Verifies a Firebase ID token
 * @param token - The Firebase ID token to verify
 * @returns A promise that resolves with the decoded token
 */
export async function verifyIdToken(token: string) {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}