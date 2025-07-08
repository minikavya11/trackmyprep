import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays, isSameDay } from "date-fns";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationCard from "../components/ApplicationCard";
import useApplications from "../hooks/useApplication";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import logo from '../assets/intern.png';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "@clerk/clerk-react";

const getWeeklyStats = (applications) => {
  const stats = [];
  for (let i = 6; i >= 0; i--) {
    const day = subDays(new Date(), i);
    const dayStr = format(day, "EEE");
    const count = applications.filter((app) =>
      isSameDay(new Date(app.createdAt || app.id * 1), day)
    ).length;
    stats.push({ day: dayStr, count });
  }
  return stats;
};

const Dashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [applications, setApplications] = useApplications();
  const [editingApp, setEditingApp] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Search/Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", isDark ? "light" : "dark");
  };

  const handleAdd = async (newApp) => {
    const token = await getToken();
    const res = await fetch(`https://trackmyprep-backend.onrender.com/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newApp),
    });
    const savedApp = await res.json();
    setApplications((prev) => [savedApp, ...prev]);
  };

  const handleDelete = async (id) => {
    const token = await getToken();
    const res = await fetch(`https://trackmyprep-backend.onrender.com/applications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setApplications(applications.filter((a) => a._id !== id));
      toast.success("✅ Deleted successfully!");
    }
  };

  const handleUpdate = async (updatedApp) => {
    const token = await getToken();
    const res = await fetch(`https://trackmyprep-backend.onrender.com/applications/${updatedApp._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedApp),
    });

    const updated = await res.json();
    setApplications((prev) =>
      prev.map((a) => (a._id === updated._id ? updated : a))
    );
    setIsDialogOpen(false);
    setEditingApp(null);
  };

  // Filtering logic
  const filteredApps = applications.filter((app) => {
    return (
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "All" || app.status === statusFilter) &&
      (priorityFilter === "All" || app.priority === priorityFilter) &&
      (categoryFilter === "All" || app.category === categoryFilter)
    );
  });

  const summary = {
    total: applications.length,
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };
  applications.forEach((a) => summary[a.status]++);

  const weeklyStats = getWeeklyStats(applications);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-6 sm:px-6 lg:px-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
       <div className="flex items-center gap-4 mb-6">
  <img
    src={logo}
    alt="TrackMyPrep Logo"
    className="w-14 h-14 rounded-full shadow-md"
  />
  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
    Welcome to <span className="text-indigo-600 dark:text-indigo-400">TrackMyPrep</span> 👋
  </h1>
</div>

        <div className="flex gap-3">
          <button
            onClick={toggleTheme}
            className="text-sm px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            🌗 Toggle Theme
          </button>
          <SignOutButton>
            <button className="text-sm px-4 py-2 rounded bg-red-500 text-white">
              🔓 Sign Out
            </button>
          </SignOutButton>
          <Link
  to="/profile"
  className="text-sm px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
>
  🧑 View Profile
</Link>
        </div>
      </div>

     
     


      {/* Weekly Chart */}
      <div className="bg-white dark:bg-gray-800 rounded p-4 mb-8">
        <h2 className="font-semibold text-lg mb-2">📈 Weekly Stats</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyStats}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
       {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Input
          type="text"
          placeholder="🔍 Search by company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded border dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All Statuses</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="p-2 rounded border dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 rounded border dark:bg-gray-700 dark:text-white"
        >
          <option value="All">All Categories</option>
          <option>Internship</option>
          <option>Full-time</option>
          <option>Remote</option>
          <option>Contract</option>
        </select>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded shadow hover:scale-105"
              onClick={() => {
                setEditingApp(null);
                setIsDialogOpen(true);
              }}
            >
              + Add Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{editingApp ? "Edit" : "Add"} Application</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 dark:text-gray-300 mb-4">
              Track your job/internship progress.
            </DialogDescription>
            <ApplicationForm
              onAdd={handleAdd}
              onUpdate={handleUpdate}
              initialData={editingApp}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Applications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredApps.map((app) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ApplicationCard
                data={app}
                onDelete={handleDelete}
                onUpdate={(updated) => {
                  setEditingApp(updated);
                  setIsDialogOpen(true);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
