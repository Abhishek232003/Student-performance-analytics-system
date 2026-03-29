import { useState, useEffect } from "react";
import axios from "axios";
import StudentSidebar from "../components/StudentSidebar";

export default function StudentRequests() {

  const studentId = localStorage.getItem("student_id");

  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("create");

  // Fetch teachers for dropdown
  useEffect(() => {

    const fetchTeachers = async () => {

      try {

        const res = await axios.get(
          `http://127.0.0.1:5000/student/teachers/${studentId}`
        );

        setTeachers(res.data);

      } catch (error) {
        console.error("Teacher fetch error:", error);
      }

    };

    fetchTeachers();

  }, [studentId]);


  // Fetch sent requests
  const fetchRequests = async () => {

    try {

      const res = await axios.get(
        `http://127.0.0.1:5000/student/requests/${studentId}`
      );

      setRequests(res.data);

    } catch (error) {

      console.error("Request fetch error:", error);

    }

  };


  useEffect(() => {

    if (activeTab === "sent") {
      fetchRequests();
    }

  }, [activeTab]);


  // Send request
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:5000/student/requests",
        {
          student_id: studentId,
          teacher_id: teacherId,
          description: description
        }
      );

      alert("Request sent successfully");

      setTeacherId("");
      setDescription("");

    } catch (error) {

      alert("Failed to send request");
      console.error(error);

    }

  };


  return (
    <div className="flex">

      <StudentSidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-8">
          My Requests
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">

          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "create"
                ? "bg-purple-600 text-white"
                : "bg-gray-300"
            }`}
          >
            Create Request
          </button>

          <button
            onClick={() => setActiveTab("sent")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "sent"
                ? "bg-purple-600 text-white"
                : "bg-gray-300"
            }`}
          >
            Sent Requests
          </button>

        </div>


        {/* CREATE REQUEST */}
        {activeTab === "create" && (

          <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Teacher Dropdown */}
              <select
                className="w-full p-3 border rounded-lg"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
              >

                <option value="">Select Teacher</option>

                {teachers.map((teacher) => (

                  <option
                    key={teacher.teacher_id}
                    value={teacher.teacher_id}
                  >
                    {teacher.name}
                  </option>

                ))}

              </select>


              {/* Description */}
              <textarea
                placeholder="Description"
                className="w-full p-3 border rounded-lg"
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />


              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg"
              >
                Send Request
              </button>

            </form>

          </div>

        )}


        {/* SENT REQUESTS */}
        {activeTab === "sent" && (

          <div className="space-y-4">

            {requests.length === 0 ? (

              <p>No requests sent yet.</p>

            ) : (

              requests.map((req) => (

                <div
                  key={req.id}
                  className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center"
                >

                  <div>

                    <p className="font-semibold">
                      Teacher ID: {req.teacher_id}
                    </p>

                    <p className="text-gray-600">
                      {req.description}
                    </p>

                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-white ${
                      req.status === "Pending"
                        ? "bg-yellow-500"
                        : req.status === "Approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {req.status}
                  </span>

                </div>

              ))

            )}

          </div>

        )}

      </div>

    </div>
  );
}