import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import Requests from "./pages/Requests";
import Announcements from "./pages/Announcements";

import StudentDashboard from "./pages/StudentDashboard";
import StudentRequests from "./pages/StudentRequests";
import StudentAnnouncements from "./pages/StudentAnnouncements";

import Loader from "./components/Loader";
import Calendar from "./pages/Calendar";
import Timetable from "./pages/Timetable";
import Chatbot from "./pages/Chatbot";


function App() {

  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>

      {loading && <Loader />}

      <Routes>

        <Route path="/" element={<Login setLoading={setLoading} />} />

        <Route path="/dashboard" element={<Dashboard setLoading={setLoading} />} />
        <Route path="/analysis" element={<Analysis setLoading={setLoading} />} />
        <Route path="/requests" element={<Requests setLoading={setLoading} />} />
        <Route path="/announcements" element={<Announcements setLoading={setLoading} />} />

        <Route path="/student-dashboard" element={<StudentDashboard setLoading={setLoading} />} />
        <Route path="/student-requests" element={<StudentRequests setLoading={setLoading} />} />
        <Route path="/student-announcements" element={<StudentAnnouncements setLoading={setLoading} />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/student-timetable" element={<Timetable />} />
        <Route path="/student-learnings" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;