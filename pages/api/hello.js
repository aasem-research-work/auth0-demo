// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession } from '@auth0/nextjs-auth0'; // Security: Import getSession from Auth0

// Security: Create a helper function to check if the user is authenticated
async function isAuthenticated(req, res) {
  const session = await getSession(req, res); // Add await here
  if (!session) {
    res.status(401).end(); // Unauthorized
    return false;
  }
  return true;}

export default async function handler(req, res) {
  if (!(await isAuthenticated(req, res))) return;

  res.status(200).json({ name: 'John Doe' })
}



