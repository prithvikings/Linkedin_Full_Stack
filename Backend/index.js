import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from "socket.io";
import http from 'http';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
let server=http.createServer(app);
export const io=new Server(server,{
  cors:{
    origin:process.env.CLIENT_URL,
    credentials:true
  } 
})

io.on("connection",(socket)=>{
  console.log("User connected: ",socket.id);
  socket.on("disconnect",()=>{
    console.log("User disconnected",socket.id);
  }
  )
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. "http://localhost:5173"
    credentials: true,
  })
);

// Import routes
import authrouter from './routes/auth.routes.js';
import userouter from './routes/user.router.js';
import postrouter from './routes/post.routes.js';
import connectionrouter from './routes/connection.routes.js';

// Use routes
app.use('/api/auth', authrouter);
app.use('/api/user', userouter);
app.use('/api/posts', postrouter);
app.use('/api/connections', connectionrouter);

// Connect to database and start server
connectDB()
  .then(() => {
    console.log('✅ Database connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });
