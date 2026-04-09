import { useEffect, useState } from "react";
import { getTimetable } from "../services/api";
import ChatWidget from "../components/ChatWidget";
export default function Timetable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const studentId = localStorage.getItem("student_id");
      const res = await getTimetable(studentId);
      setData(res.timetable);
    };

    fetchData();
  }, []);

  // Extract days
  const days = data.map((d) => d.day);

  // Find max periods
  const maxPeriods = Math.max(
    ...data.map((d) => d.periods.length),
    0
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">📅 Timetable</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">

          {/* HEADER */}
          <thead className="bg-indigo-500 text-white">
  <tr>
    <th className="p-3">Day</th>
    {[...Array(maxPeriods)].map((_, i) => (
      <th key={i} className="p-3">P{i + 1}</th>
    ))}
  </tr>
</thead>

          {/* BODY */}
         <tbody>
  {data.map((day, i) => (
    <tr key={i} className="border-b text-center">

      {/* DAY NAME */}
      <td className="p-3 font-semibold bg-gray-100">
        {day.day}
      </td>

      {/* PERIODS */}
      {day.periods.map((subject, j) => (
        <td key={j} className="p-3">
          <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-lg shadow flex items-center justify-center h-12 w-32">
            {subject || "-"}
          </div>
        </td>
      ))}

    </tr>
  ))}
</tbody>

        </table>
      </div>
      <ChatWidget />
    </div>
  );
}