import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true,
  },
  category: {
    type: String,
    enum: ['Internship', 'Full-time', 'Remote', 'Contract'],
    required: true,
  },
  deadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
  resumeUrl: { type: String }
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
