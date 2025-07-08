// routes/applications.js
import express from "express";
import { ClerkExpressRequireAuth, clerkClient } from "@clerk/clerk-sdk-node";
import Application from "../models/Application.js";

const router = express.Router();

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

// POST new application
router.post("/", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const data = req.body;
  try {
    const newApp = new Application({ ...data, userId });
    await newApp.save();
    res.status(201).json(newApp);
  } catch {
    res.status(400).json({ message: "Failed to create application" });
  }
});

// PUT update application
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

// DELETE application
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
