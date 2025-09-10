import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cookieparser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, 
}));

// Import routes
import authrouter from './routes/auth.routes.js';
import userouter from './routes/user.router.js';
import postrouter from './routes/post.routes.js';

// Use routes
app.use('/api/auth', authrouter);
app.use('/api/user', userouter);
app.use('/api/posts', postrouter);

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
