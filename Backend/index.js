import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import routes
import authrouter from './routes/auth.routes.js';

// Use routes
app.use('/api/auth', authrouter);



// Connect to database and start server
connectDB().then(() => {
  console.log('Database connected');
  app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
}).catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});
