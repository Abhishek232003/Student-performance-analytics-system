import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");

  const navigate = useNavigate();

  const handleLogin = () => {
    // save role (simulating backend auth response)
    localStorage.setItem("role", role);

    // 🔥 ROLE‑BASED DASHBOARD FIX
    if (role === "Student") {
      navigate("/student-dashboard");
    } else if (role === "Faculty") {
      navigate("/faculty-dashboard");
    } else if (role === "Admin") {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Student Support System
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
            >
              <option>Student</option>
              <option>Faculty</option>
              <option>Admin</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default Login;
