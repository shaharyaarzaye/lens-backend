// api/index.js
import express from 'express';
import serverless from 'serverless-http';
import { connectDB } from '../utils/db.js';
import User from '../models/User.js';

// Initialize Express
const app = express();
app.use(express.json());

// Connect to DB on cold start
connectDB().catch(err => console.error('DB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Express + MongoDB on Vercel 🚀' });
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
export const handler = serverless(app);
