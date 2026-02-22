import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function Notifications() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/announcements/")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));

    // ✅ mark notifications as opened
    localStorage.setItem(
      "lastNotificationOpen",
      new Date().toISOString()
    );
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        🔔 Notifications
      </h1>

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className="bg-[#2d3748] p-4 rounded text-white flex justify-between items-center"
            >
              <span>{a.message}</span>
              <span className="text-sm text-gray-300">
                {formatDate(a.created_at)}
              </span>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
