import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";


export default function Requests() {

  const teacherId = localStorage.getItem("teacher_id");

  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  // fetch requests from backend
  useEffect(() => {

    const fetchRequests = async () => {

      try {

        const res = await axios.get(
          `http://127.0.0.1:5000/teacher/requests/${teacherId}`
        );

        setRequests(res.data);

      } catch (error) {

        console.error("Error fetching requests:", error);

      }

    };

    fetchRequests();

  }, [teacherId]);


  // approve / reject
  const updateStatus = async (id, status) => {

    try {

      await axios.put(
        `http://127.0.0.1:5000/teacher/requests/update/${id}`,
        { status }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: status } : req
        )
      );

    } catch (error) {

      console.error("Error updating request:", error);

    }

  };


  const filteredRequests = requests.filter((req) =>
    activeTab === "pending"
      ? req.status === "Pending"
      : req.status !== "Pending"
  );


  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Requests
        </h1>

        <div className="flex gap-4 mb-8">

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "pending"
                ? "bg-purple-600 text-white"
                : "bg-gray-300"
            }`}
          >
            Pending Requests
          </button>

          <button
            onClick={() => setActiveTab("resolved")}
            className={`px-6 py-2 rounded-full ${
              activeTab === "resolved"
                ? "bg-purple-600 text-white"
                : "bg-gray-300"
            }`}
          >
            Resolved Requests
          </button>

        </div>

        <div className="space-y-6">

          {filteredRequests.map((req) => (

            <div
              key={req.id}
              className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
            >

              <div>

                <h3 className="font-semibold">
                  Student {req.student_id}
                </h3>

                <p className="text-gray-500">
                  {req.description}
                </p>

              </div>

              {req.status === "Pending" ? (

                <div className="flex gap-3">

                  <button
                    onClick={() => updateStatus(req.id, "Approved")}
                    className="bg-green-600 text-white px-4 py-2 rounded-full"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(req.id, "Rejected")}
                    className="bg-red-500 text-white px-4 py-2 rounded-full"
                  >
                    Reject
                  </button>

                </div>

              ) : (

                <span className="text-gray-600">
                  {req.status}
                </span>

              )}

            </div>

          ))}

        </div>

      </div>
          
        
    </div>
  );
}