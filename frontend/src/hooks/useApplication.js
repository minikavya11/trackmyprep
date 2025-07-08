import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

export default function useApplications() {
  const { getToken } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    async function fetchApps() {
      try {
        const token = await getToken();
        const res = await fetch('https://your-backend.onrender.com/applications', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // 🔥 Normalize _id to id for frontend compatibility
        const normalizedData = data.map((app) => ({
          ...app,
          id: app._id,
        }));

        setApplications(normalizedData);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    }

    fetchApps();
  }, [getToken]);

  return [applications, setApplications];
}
