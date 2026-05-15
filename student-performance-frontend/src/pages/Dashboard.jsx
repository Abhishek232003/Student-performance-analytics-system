import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function Dashboard({ setLoading }) {

  const [teacher, setTeacher] = useState(null);

  const userId = localStorage.getItem("user_id");
  const teacherId = userId ? parseInt(userId) - 1000 : null;

  useEffect(() => {

    const fetchTeacher = async () => {

      setLoading(true);

      try {

        const res = await axios.get(
          `http://127.0.0.1:5000/teacher/dashboard/${teacherId}`
        );

        setTeacher(res.data);

      } catch (error) {

        console.error("Dashboard fetch error:", error);

      }

      setLoading(false);

    };

    if (teacherId) {
      fetchTeacher();
    }

  }, [teacherId]);

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-12 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-12 text-black">
          Teacher Dashboard
        </h1>

        {teacher ? (

          <div className="grid grid-cols-3 grid-rows-2 gap-10 h-[75vh]">

            {/* Photo */}
            <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center justify-center">

              <img
                src={`http://127.0.0.1:5000${teacher.photo_url}`}
                alt="Teacher"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
              />

              <p className="text-2xl font-bold text-black mt-4">
                Profile Photo
              </p>

            </div>

            {/* Teacher */}
            <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col justify-center">

              <p className="text-2xl font-bold text-black">
                Teacher
              </p>

              <h2 className="text-lg font-normal text-black mt-2">
                {teacher.name}
              </h2>

            </div>

            {/* Department */}
            <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col justify-center">

              <p className="text-2xl font-bold text-black">
                Department
              </p>

              <h2 className="text-lg font-normal text-black mt-2">
                {teacher.department_name}
              </h2>

            </div>

            {/* Section */}
            <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col justify-center">

              <p className="text-2xl font-bold text-black">
                Section
              </p>

              <h2 className="text-lg font-normal text-black mt-2">
                {teacher.section_name}
              </h2>

            </div>

            {/* Email */}
            <div className="bg-white shadow-lg rounded-2xl p-10 col-span-2 flex flex-col justify-center">

              <p className="text-2xl font-bold text-black mb-2">
                Email
              </p>

              <h2 className="text-lg font-normal text-black">
                {teacher.email}
              </h2>

            </div>

          </div>

        ) : (

          <p className="text-lg">Loading teacher data...</p>

        )}

      </div>

    </div>
  );
}