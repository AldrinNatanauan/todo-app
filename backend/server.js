import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRoute from './routes/health.js';

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/health', healthRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
