import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getCalendarEvents } from "../services/api";
import ChatWidget from "../components/ChatWidget";
export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const studentId = user?.id;

      if (!studentId) {
        console.log("No student ID found");
        return;
      }

      const data = await getCalendarEvents(studentId);
      console.log("EVENTS:", data); // 🔥 debug
      setEvents(data);
    };

    fetchEvents();
  }, []);

  // 🔴 Show dot on calendar dates with events
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const hasEvent = events.some(
        (e) =>
          new Date(e.event_date).toDateString() === date.toDateString()
      );

      return hasEvent ? (
        <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mt-1"></div>
      ) : null;
    }
  };

  // 📅 Events for selected date
  const selectedEvents = events.filter(
    (e) =>
      new Date(e.event_date).toDateString() === date.toDateString()
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6">📅 Calendar</h2>

      {/* Calendar */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          className="rounded-lg"
        />
      </div>

      {/* Events */}
      <div className="mt-6 w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-2">
          Events on {date.toDateString()}
        </h3>

        {selectedEvents.length === 0 ? (
          <p className="text-gray-500">No events</p>
        ) : (
          selectedEvents.map((event, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md mb-3"
            >
              <p className="font-bold">{event.title}</p>
              {event.description && (
                <p className="text-sm text-gray-600">
                  {event.description}
                </p>
              )}
              <p className="text-sm">⏰ {event.event_time}</p>
              <p className="text-xs text-indigo-500">
                {event.event_type}
              </p>
            </div>
          ))
        )}
      </div>
      <ChatWidget />
    </div>
  );
}