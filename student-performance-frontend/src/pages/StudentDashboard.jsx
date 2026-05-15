import { useEffect, useState } from "react";
import axios from "axios";
import StudentSidebar from "../components/StudentSidebar";
import ChatWidget from "../components/ChatWidget";


export default function StudentDashboard({ setLoading }) {

  const [student, setStudent] = useState(null);

  const studentId = localStorage.getItem("student_id");

  useEffect(() => {

    const fetchStudent = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `http://127.0.0.1:5000/student/dashboard/${studentId}`
        );

        setStudent(res.data);

      } catch (error) {

        console.error("Error fetching student data:", error);

      }

      setLoading(false);

    };

    if (studentId) {
      fetchStudent();
    }

  }, [studentId]);

  return (
    <div className="flex">

      <StudentSidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-10">
          Student Dashboard
        </h1>

        {student ? (

          <div className="grid grid-cols-3 gap-8">

            {/* Name */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <p className="text-gray-500">Name</p>
              <h2 className="text-2xl font-bold">
                {student.name}
              </h2>
            </div>

            {/* Student ID */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <p className="text-gray-500">Student ID</p>
              <h2 className="text-2xl font-bold">
                {student.student_id}
              </h2>
            </div>

            {/* Department */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <p className="text-gray-500">Department</p>
              <h2 className="text-2xl font-bold">
                {student.department_name}
              </h2>
            </div>

            {/* Section */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <p className="text-gray-500">Section</p>
              <h2 className="text-2xl font-bold">
                {student.section_name}
              </h2>
            </div>

            {/* Email */}
            <div className="bg-white shadow-lg rounded-xl p-6 col-span-2">
              <p className="text-gray-500">Email</p>
              <h2 className="text-xl font-semibold">
                {student.email}
              </h2>
            </div>

          </div>

        ) : (

          <p className="text-gray-600">Loading student data...</p>

        )}

      </div>
          <ChatWidget  isPopup={true} />
    </div>
  );
}