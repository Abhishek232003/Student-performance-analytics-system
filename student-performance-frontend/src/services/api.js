import axios from "axios";

/* ================================
   BASE API INSTANCE
================================ */
const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

/* ================================
   CALENDAR APIs
================================ */
export const getCalendarEvents = async (studentId) => {
  try {
    const res = await API.get(`/api/calendar/${studentId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
};

/* ================================
   TIMETABLE API (FIXED ✅)
================================ */
export const getTimetable = async (studentId) => {
  try {
    const res = await API.get(`/student/timetable/${studentId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return { timetable: [] };
  }
};

export const sendMessageToLLM = async (message, studentId) => {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/llm/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        student_id: studentId,   // 🔥 THIS IS THE FIX
      }),
    });

    const data = await res.json();

    console.log("LLM RESPONSE:", data);

    return data;

  } catch (error) {
    console.error("LLM error:", error);
    return { response: "Something went wrong" };
  }
};

export default API;