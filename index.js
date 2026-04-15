const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let agents = [
  { id: 1, name: 'Jett', role: 'Duelist', difficulty: 'Hard' },
  { id: 2, name: 'Sage', role: 'Sentinel', difficulty: 'Easy' },
  { id: 3, name: 'Omen', role: 'Controller', difficulty: 'Medium' },
];

let nextId = 4;

// ✅ 1. GET all agents
app.get('/api/agents', (req, res) => {
  res.status(200).json(agents);
});

// ✅ 2. GET agent by ID
app.get('/api/agents/:id', (req, res) => {
  const agent = agents.find((a) => a.id == req.params.id);
  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' });
  }
  res.json(agent);
});

// ✅ 3. POST new agent
app.post('/api/agents', (req, res) => {
  const { name, role, difficulty } = req.body;

  if (!name || !role || !difficulty) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const newAgent = { id: nextId++, name, role, difficulty };
  agents.push(newAgent);

  res.status(201).json(newAgent);
});

// ✅ 4. PUT update agent
app.put('/api/agents/:id', (req, res) => {
  const agent = agents.find((a) => a.id == req.params.id);

  if (!agent) {
    return res.status(404).json({ message: 'Agent not found' });
  }

  const { name, role, difficulty } = req.body;

  agent.name = name || agent.name;
  agent.role = role || agent.role;
  agent.difficulty = difficulty || agent.difficulty;

  res.json(agent);
});

app.delete('/api/agents/:id', (req, res) => {
  const index = agents.findIndex((a) => a.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Agent not found' });
  }

  agents.splice(index, 1);
  res.json({ message: 'Agent deleted' });
});

app.get('/api/agents/role/:role', (req, res) => {
  const filtered = agents.filter(
    (a) => a.role.toLowerCase() === req.params.role.toLowerCase()
  );

  res.json(filtered);
});

app.get('/api/search', (req, res) => {
  const name = req.query.name;

  const result = agents.filter((a) =>
    a.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json(result);
});

app.get('/api/random', (req, res) => {
  const random = agents[Math.floor(Math.random() * agents.length)];
  res.json(random);
});

app.get('/api/stats', (req, res) => {
  res.json({
    total: agents.length,
  });
});

app.get('/api/top-agents', (req, res) => {
  const top = agents.filter((a) => a.difficulty === 'Easy');
  res.json(top);
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server Error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
