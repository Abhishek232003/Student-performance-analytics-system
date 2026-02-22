import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function Announcements() {
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:5000/api/announcements/"
      );
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const sendAnnouncement = async () => {
    if (!message.trim()) return;

    try {
      await fetch("http://127.0.0.1:5000/api/announcements/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      setMessage("");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  // format date + time
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
        📢 Announcements
      </h1>

      {/* Input box */}
      <div className="bg-[#2d3748] p-5 rounded-xl mb-6">
        <textarea
          className="w-full p-3 rounded text-black"
          rows="4"
          placeholder="Write announcement for students..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendAnnouncement}
          className="
            mt-3 px-6 py-2
            bg-indigo-600 text-white
            rounded-full
            transition-all duration-200
            hover:shadow-[0_0_15px_rgba(99,102,241,0.8)]
            active:scale-95
          "
        >
          Send Announcement
        </button>
      </div>

      {/* Announcements list */}
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

export default Announcements;
