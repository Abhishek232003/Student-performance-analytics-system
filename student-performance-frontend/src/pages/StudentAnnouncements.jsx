import { useEffect, useState } from "react";
import axios from "axios";
import StudentSidebar from "../components/StudentSidebar";

export default function StudentAnnouncements() {

  const studentId = localStorage.getItem("student_id");

  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {

    const fetchAnnouncements = async () => {

      try {

        const res = await axios.get(
          `http://127.0.0.1:5000/student/announcements/${studentId}`
        );

        setAnnouncements(res.data);

      } catch (error) {

        console.error(error);

      }

    };

    fetchAnnouncements();

  }, [studentId]);

  return (
    <div className="flex">

      <StudentSidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-8">
          Announcements
        </h1>

        <div className="space-y-6">

          {announcements.length === 0 ? (

            <p>No announcements available</p>

          ) : (

            announcements.map((a, index) => (

              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md"
              >

                <p className="text-lg">{a.message}</p>

                <p className="text-sm text-gray-500 mt-2">
                  {new Date(a.created_at).toLocaleString()}
                </p>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}