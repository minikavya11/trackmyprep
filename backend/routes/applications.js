// routes/applications.js
import express from "express";
import multer from "multer";
import path from "path";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Application from "../models/Application.js";

const router = express.Router();

// ✅ Setup multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/", // make sure this folder exists
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1620000.pdf
  },
});
const upload = multer({ storage });

// ✅ Serve static files from /uploads in your main server file
// app.use("/uploads", express.static("uploads"));


// GET all applications
router.get("/", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  try {
    const apps = await Application.find({ userId }).sort({ createdAt: -1 });
    res.json(apps);
  } catch {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// ✅ POST with file upload
router.post("/", ClerkExpressRequireAuth(), upload.single("resume"), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const {
      company,
      role,
      status,
      deadline,
      priority,
      note,
      category
    } = req.body;

    const resumeUrl = req.file
      ? `https://trackmyprep-backend.onrender.com/uploads/${req.file.filename}`
      : "";

    const newApp = new Application({
      company,
      role,
      status,
      deadline,
      priority,
      note,
      category,
      resumeUrl,
      userId,
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create application" });
  }
});

// PUT update (text only, file updates not supported here yet)
router.put("/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const appId = req.params.id;
  try {
    const updated = await Application.findOneAndUpdate(
      { _id: appId, userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Application not found" });
    res.json(updated);
  } catch {
    res.status(400).json({ message: "Failed to update application" });
  }
});

// DELETE
router.delete("/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const appId = req.params.id;
  try {
    const deleted = await Application.findOneAndDelete({ _id: appId, userId });
    if (!deleted) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch {
    res.status(400).json({ message: "Failed to delete application" });
  }
});

export default router;
