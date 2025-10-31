import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hackathon Matchmaker Backend API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Example API routes for hackathon matchmaker
app.get('/api/hackathons', (req, res) => {
  res.json([
    { id: 1, name: 'Tech Innovation Hackathon', date: '2025-11-15', location: 'San Francisco' },
    { id: 2, name: 'AI/ML Challenge', date: '2025-12-01', location: 'New York' }
  ]);
});

app.get('/api/participants', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', skills: ['JavaScript', 'React', 'Node.js'] },
    { id: 2, name: 'Jane Smith', skills: ['Python', 'Machine Learning', 'Data Science'] }
  ]);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});