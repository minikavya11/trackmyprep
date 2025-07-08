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
    if (isEdit && initialData) {
      setForm((prevForm) => ({
        ...prevForm,
        ...initialData,
        category: initialData.category || "Internship",
      }));
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      const file = files[0];
      if (file) {
        setForm({ ...form, resumeUrl: file }); // Save the File object
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSelect = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append all fields to FormData
    for (const key in form) {
      if (key === "resumeUrl" && form.resumeUrl instanceof File) {
        formData.append("resume", form.resumeUrl);
      } else {
        formData.append(key, form[key]);
      }
    }

    // Include _id for updates
    if (isEdit && initialData._id) {
      formData.append("_id", initialData._id);
      onUpdate(formData);
    } else {
      onAdd(formData);
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
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Company</label>
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
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Role</label>
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
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Deadline</label>
        <Input
          type="date"
          name="deadline"
          value={form.deadline ? new Date(form.deadline).toISOString().split("T")[0] : ""}
          onChange={handleChange}
          required
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Status</label>
        <Select value={form.status} onValueChange={(val) => handleSelect("status", val)}>
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
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Priority</label>
        <Select value={form.priority} onValueChange={(val) => handleSelect("priority", val)}>
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
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Category</label>
        <Select value={form.category} onValueChange={(val) => handleSelect("category", val)}>
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
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Resume (PDF)</label>
        <Input
          type="file"
          name="resume"
          accept=".pdf"
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        {typeof form.resumeUrl === "string" && form.resumeUrl && (
          <a href={form.resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-500 underline mt-1 block">
            View current resume
          </a>
        )}
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Note</label>
        <Input
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="e.g. Contacted via LinkedIn"
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        {isEdit ? "Update Application" : "Add Application"}
      </Button>
    </form>
  );
};

export default ApplicationForm;
