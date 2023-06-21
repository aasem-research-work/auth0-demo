import { readCSV, writeCSV } from '../../../lib/csvHelper';
import { getSession } from '@auth0/nextjs-auth0'; // Security: Import getSession from Auth0

// Security: Create a helper function to check if the user is authenticated
async function isAuthenticated(req, res) {
  const session = getSession(req, res);
  if (!session) {
    res.status(401).end(); // Unauthorized
    return false;
  }
  return true;
}

// GET /api/todo/:id
export async function get(req, res) {
  if (!(await isAuthenticated(req, res))) return; // Security: Check if the user is authenticated
  const { id } = req.query;
  const todos = await readCSV();
  const todo = todos.find((todo) => todo.created_timestamp === id);
  if (!todo) {
    return res.status(404).end(); // Not Found
  }
  res.status(200).json(todo);
}

// PUT /api/todo/:id
export async function put(req, res) {
  if (!(await isAuthenticated(req, res))) return; // Security: Check if the user is authenticated
  const { id } = req.query;
  const newTodo = req.body;
  let todos = await readCSV();
  const index = todos.findIndex((todo) => todo.created_timestamp === id);
  if (index === -1) {
    return res.status(404).end(); // Not Found
  }
  todos[index] = newTodo;
  await writeCSV(todos);
  res.status(200).json(newTodo);
}

// DELETE /api/todo/:id
export async function del(req, res) {
  if (!(await isAuthenticated(req, res))) return; // Security: Check if the user is authenticated
  const { id } = req.query;
  let todos = await readCSV();
  const index = todos.findIndex((todo) => todo.created_timestamp === id);
  if (index === -1) {
    return res.status(404).end(); // Not Found
  }
  todos = todos.filter((todo) => todo.created_timestamp !== id);
  await writeCSV(todos);
  res.status(204).end(); // No Content
}

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return get(req, res);
    case 'PUT':
      return put(req, res);
    case 'DELETE':
      return del(req, res);
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}
