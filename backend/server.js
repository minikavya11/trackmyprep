import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { ClerkExpressRequireAuth, clerkClient } from '@clerk/clerk-sdk-node';
import applicationRoutes from './routes/applications.js';
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix CORS for deployed frontend
const allowedOrigins = ['https://trackmyprep.onrender.com'];

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Static file serving
app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded resumes
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

  app.get("/", (req, res) => {
  res.send("TrackMyPrep Backend is running!");
});

// Routes
app.use("/applications", applicationRoutes);

// Clerk profile route
app.get('/profile', ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const user = await clerkClient.users.getUser(userId);
    res.json({
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
