import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function Analysis() {

  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [attendance, setAttendance] = useState(null);
  const [internalMarks, setInternalMarks] = useState(null);
  const [assignmentScore, setAssignmentScore] = useState(null);
  const [behaviorScore, setBehaviorScore] = useState(null);

  const [riskLevel, setRiskLevel] = useState("");

  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {

    if (!userId) return;

    if (userId >= 1001 && userId <= 1003) {
      setSubjects(["DSA", "OS"]);
    }
    else if (userId >= 1004 && userId <= 1006) {
      setSubjects(["VLSI", "DSP"]);
    }
    else if (userId >= 1007 && userId <= 1009) {
      setSubjects(["Robotics", "CAD"]);
    }

  }, [userId]);

  const fetchStudentData = async () => {

    if (!studentId || !subject) {
      alert("Enter Student ID and select subject");
      return;
    }

    try {

      const res = await axios.get(
        "http://127.0.0.1:5000/api/students/analysis",
        {
          params: {
            student_id: studentId,
            subject: subject
          }
        }
      );

      const data = res.data;

      setAttendance(data.attendance);
      setInternalMarks(data.internal_marks);
      setAssignmentScore(data.assignment_score);
      setBehaviorScore(data.behavior_score);

      setRiskLevel("");

    } catch (error) {

      console.error("Fetch error:", error);
      alert("Failed to fetch student data");

    }

  };

  const predictRisk = async () => {

    try {

      const res = await axios.post(
        "http://127.0.0.1:5000/api/students/predict",
        {
          attendance: attendance,
          internal_marks: internalMarks,
          assignment: assignmentScore,
          behavior: behaviorScore
        }
      );

      setRiskLevel(res.data.predicted_risk);

    } catch (error) {

      console.error("Prediction error:", error);
      alert("Prediction failed");

    }

  };

  // ✅ UPDATED FUNCTION (THIS IS THE ONLY REAL CHANGE)
  const notifyStudent = async () => {

    if (!studentId) {
      alert("Student ID missing");
      return;
    }

    try {

      const res = await fetch("http://127.0.0.1:5000/teacher/notify-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: parseInt(studentId)
        })
      });

      const data = await res.json();

      alert(data.message); // "Notification sent"

    } catch (error) {

      console.error("Notify error:", error);
      alert("Failed to send notification");

    }
  };

  return (
    <div className="flex">

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col items-center">

        <h1 className="text-3xl font-bold mb-8">
          Student Analysis
        </h1>

        {/* Input Card */}
        <div className="bg-white shadow rounded-xl p-8 w-full max-w-2xl space-y-4">

          <input
            type="text"
            placeholder="Enter Student ID"
            className="w-full p-3 border rounded-full bg-gray-100"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <select
            className="w-full p-3 border rounded-full bg-gray-100"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option>Select Subject</option>

            {subjects.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}

          </select>

          <button
            onClick={fetchStudentData}
            className="w-full p-3 rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-600"
          >
            Fetch Data
          </button>

        </div>

        {/* Result Card */}
        {attendance !== null && (

          <div className="bg-white shadow rounded-xl p-8 w-full max-w-2xl mt-8 space-y-3">

            <p>Attendance: {attendance}</p>
            <p>Internal Marks: {internalMarks}</p>
            <p>Assignment Score: {assignmentScore}</p>
            <p>Behavior Score: {behaviorScore}</p>

            <div className="flex items-center gap-4 mt-4">

              <button
                onClick={predictRisk}
                className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-indigo-600"
              >
                Predict Risk
              </button>

              {riskLevel && (
                <p>
                  Risk Level: <strong>{riskLevel}</strong>
                </p>
              )}

              {riskLevel === "High" && (
                <button
                  onClick={notifyStudent}
                  className="px-6 py-2 rounded-full bg-red-500 text-white"
                >
                  Notify
                </button>
              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}