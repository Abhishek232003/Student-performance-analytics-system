import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function Announcements() {

  const teacherId = localStorage.getItem("teacher_id");
  const [message, setMessage] = useState("");

  const handleSend = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:5000/teacher/announcements",
        {
          teacher_id: teacherId,
          message: message
        }
      );

      alert("Announcement sent successfully");

      setMessage("");

    } catch (error) {

      console.error(error);
      alert("Failed to send announcement");

    }

  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-8">
          Announcements
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">

          <form onSubmit={handleSend} className="space-y-6">

            <textarea
              className="w-full p-3 border rounded-lg"
              rows="5"
              placeholder="Type announcement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg"
            >
              Send Announcement
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}