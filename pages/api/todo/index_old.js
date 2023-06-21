import { readCSV, writeCSV } from '../../../lib/csvHelper';

// GET /api/todo
export async function get(req, res) {
  const todos = await readCSV();
  res.status(200).json(todos);
}

// POST /api/todo
export async function post(req, res) {
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
