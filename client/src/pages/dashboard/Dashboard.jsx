import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";

import StatCard from "../../components/ui/StatCard";

import {
  getDashboardStats,
  getRecentActivity,
} from "../../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    pendingClaims: 0,
    acceptedClaims: 0,
  });

  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
      ]);

      setStats(statsRes.data);

      setActivities(activityRes.data.activities || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center text-xl">
          Loading Dashboard...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Lost Items"
          value={stats.lostItems}
          color="text-red-500"
        />

        <StatCard
          title="Found Items"
          value={stats.foundItems}
          color="text-green-500"
        />

        <StatCard
          title="Pending Claims"
          value={stats.pendingClaims}
          color="text-yellow-500"
        />

        <StatCard
          title="Accepted Claims"
          value={stats.acceptedClaims}
          color="text-blue-500"
        />

      </div>

      <div className="mt-10 bg-white rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-bold mb-4">
          Recent Activity
        </h2>

        {activities.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li
                key={activity._id}
                className="border-b pb-2"
              >
                {activity.message}
              </li>
            ))}
          </ul>
        )}

      </div>

    </MainLayout>
  );
}

export default Dashboard;