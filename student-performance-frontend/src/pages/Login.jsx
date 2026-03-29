import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {

  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Faculty");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://127.0.0.1:5000/api/auth/login",
        {
          user_id: userId,
          password: password,
          role: role   // send role to backend
        }
      );

      const data = res.data;

      // Store common login info
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("role", data.role);

      // TEACHER LOGIN
      if (data.role === "teacher") {

        localStorage.setItem("teacher_id", data.teacher_id);

        navigate("/dashboard");
        return;
      }

      // STUDENT LOGIN
      if (data.role === "student") {

        localStorage.setItem("student_id", data.student_id);
        localStorage.setItem("user", JSON.stringify({ id: data.user_id }));
        navigate("/student-dashboard");
        return;
      }

      // fallback safety
      alert("Invalid credentials");

    } catch (error) {

      alert("Invalid credentials");

    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">

        <h1 className="text-3xl font-bold mb-2">
          Welcome
        </h1>

        <p className="text-gray-500 mb-6">
          Login to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="text"
            placeholder="Enter User ID"
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full p-3 border rounded-lg bg-gray-100"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Faculty</option>
            <option>Student</option>
          </select>

          <button
            type="submit"
            className="w-full p-3 rounded-lg text-white font-medium bg-gradient-to-r from-purple-500 to-indigo-600"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}