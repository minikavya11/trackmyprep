import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

const ApplicationForm = ({ onAdd, onUpdate, initialData = null }) => {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    deadline: "",
    priority: "Medium",
    resumeUrl: "",
    note: "",
    category: "Internship",
  });

  useEffect(() => {
    if (isEdit) {
      setForm(initialData); // This will include _id from backend
    }
  }, [initialData]);

  const handleChange = (e) => {
    if (e.target.name === "resume") {
      const file = e.target.files[0];
      if (file) {
        const resumeURL = URL.createObjectURL(file);
        setForm({ ...form, resumeUrl: resumeURL });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSelect = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      // Update application with _id intact
      onUpdate(form);
    } else {
      // Add new application
      onAdd(form);
      // Reset form
      setForm({
        company: "",
        role: "",
        status: "Applied",
        deadline: "",
        priority: "Medium",
        resumeUrl: "",
        note: "",
        category: "Internship",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
    >
      {/* Company */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Company
        </label>
        <Input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="e.g. Google"
          required
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Role
        </label>
        <Input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="e.g. SDE Intern"
          required
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Deadline
        </label>
        <Input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Status
        </label>
        <Select
          value={form.status}
          onValueChange={(val) => handleSelect("status", val)}
        >
          <SelectTrigger className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offer">Offer</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Priority
        </label>
        <Select
          value={form.priority}
          onValueChange={(val) => handleSelect("priority", val)}
        >
          <SelectTrigger className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Category
        </label>
        <Select
          value={form.category}
          onValueChange={(val) => handleSelect("category", val)}
        >
          <SelectTrigger className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Internship">Internship</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resume Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Resume (PDF)
        </label>
        <Input
          type="file"
          name="resume"
          accept=".pdf"
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        {form.resumeUrl && (
          <a
            href={form.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-blue-600 dark:text-blue-400 mt-1 underline"
          >
            View current resume
          </a>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Note
        </label>
        <Input
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="e.g. Contacted via LinkedIn"
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-lg transition-all"
      >
        {isEdit ? "Update Application" : "Add Application"}
      </Button>
    </form>
  );
};

export default ApplicationForm;
