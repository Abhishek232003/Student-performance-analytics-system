import { BrowserRouter, Routes, Route } from "react-router-dom";

// Dashboards
import Dashboard from "./pages/Dashboard"; // Student
import FacultyDashboard from "./pages/FacultyDashboard"; // Teacher
import AdminDashboard from "./pages/AdminDashboard"; // Admin

// Other Pages
import Login from "./pages/Login";
import CreateRequest from "./pages/CreateRequest";
import MyRequests from "./pages/MyRequests";
import Notifications from "./pages/Notifications";
import FacultyRequests from "./pages/FacultyRequests";
import Announcements from "./pages/Announcements";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARDS (SEPARATED CORRECTLY) */}
        <Route path="/student-dashboard" element={<Dashboard />} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Student Pages */}
        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* Faculty Pages */}
        <Route path="/faculty-requests/pending" element={<FacultyRequests />} />
        <Route path="/faculty-requests/resolved" element={<FacultyRequests />} />
        <Route path="/announcements" element={<Announcements />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
