import { useUser, SignOutButton, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { format, subDays, isSameDay } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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

const Profile = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [applications, setApplications] = useState([]);
  const [resumeCount, setResumeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Profile | TrackMyPrep";
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = await getToken();

      const res = await fetch("http://localhost:5000/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = contentType.includes("application/json") ? await res.json() : [];
      setApplications(data || []);

      const count = data.filter((app) => app.resumeUrl && app.resumeUrl !== "").length;
      setResumeCount(count);
    } catch (err) {
      console.error("❌ Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const weeklyStats = getWeeklyStats(applications);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-6 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        {/* Profile Info */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src={user?.imageUrl}
            alt="User avatar"
            className="w-20 h-20 rounded-full border border-gray-300 dark:border-gray-600"
          />
         <div>
  <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
  <p className="text-sm text-gray-600 dark:text-gray-300">
    {user?.emailAddresses?.[0]?.emailAddress}
  </p>
  <a
  href="/edit-profile"
  className="inline-block mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline"
>
  ✏️ Edit Profile
</a>
</div>

        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-300">Loading applications...</p>
        ) : (
          <>
            {/* Application Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-white p-4 rounded shadow">
                <h4 className="text-lg font-semibold mb-1">📄 Resumes Uploaded</h4>
                <p className="text-2xl font-bold">{resumeCount}</p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-white p-4 rounded shadow">
                <h4 className="text-lg font-semibold mb-1">📊 Total Applications</h4>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                📈 Applications This Week
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyStats}>
                  <XAxis dataKey="day" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

      
       
      </div>
    </div>
  );
};

export default Profile;
