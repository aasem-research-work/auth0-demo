import { readCSV, writeCSV } from '../../../lib/csvHelper';
import { getSession } from '@auth0/nextjs-auth0'; // Security: Import getSession from Auth0

// Security: Create a helper function to check if the user is authenticated
async function isAuthenticated(req, res) {
  const session = await getSession(req, res); // Add await here
  if (!session) {
    res.status(401).end(); // Unauthorized
    return false;
  }
  return true;
}


// GET /api/todo
export async function get(req, res) {
  if (!(await isAuthenticated(req, res))) return; // Security: Check if the user is authenticated
  const todos = await readCSV();
  res.status(200).json(todos);
}

// POST /api/todo
export async function post(req, res) {
  if (!(await isAuthenticated(req, res))) return; // Security: Check if the user is authenticated
  const newTodo = req.body;
  const todos = await readCSV();
  todos.push(newTodo);
  await writeCSV(todos);
  res.status(201).json(newTodo);
}

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return get(req, res);
    case 'POST':
      return post(req, res);
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}
