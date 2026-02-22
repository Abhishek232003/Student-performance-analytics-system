import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Risk inputs
  const [attendance, setAttendance] = useState("");
  const [internalMarks, setInternalMarks] = useState("");
  const [assignment, setAssignment] = useState("");
  const [behavior, setBehavior] = useState("");

  const [riskResult, setRiskResult] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/announcements/")
      .then((res) => res.json())
      .then((data) => {
        const lastOpened =
          localStorage.getItem("lastNotificationOpen");

        if (!lastOpened) {
          setUnreadCount(data.length);
          return;
        }

        const unread = data.filter(
          (a) => new Date(a.created_at) > new Date(lastOpened)
        );

        setUnreadCount(unread.length);
      })
      .catch((err) => console.error(err));
  }, []);

  // number-only input + limit 0–100
  const handleLimitedInput = (value, setter) => {
    if (value === "") return setter("");

    const num = Number(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setter(value);
    }
  };

  const handlePredictRisk = () => {
    const a = Number(attendance);
    const i = Number(internalMarks);
    const as = Number(assignment);
    const b = Number(behavior);

    if (
      attendance === "" ||
      internalMarks === "" ||
      assignment === "" ||
      behavior === ""
    ) {
      setRiskResult("Please fill all fields");
      return;
    }

    const avg = (a + i + as + b) / 4;

    if (avg >= 75) {
      setRiskResult("Low Risk");
    } else if (avg >= 50) {
      setRiskResult("Medium Risk");
    } else {
      setRiskResult("High Risk");
    }
  };

  const riskBadgeColor = () => {
    if (riskResult === "Low Risk") return "bg-green-600 text-white";
    if (riskResult === "Medium Risk") return "bg-yellow-500 text-black";
    if (riskResult === "High Risk") return "bg-red-600 text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold mb-8">
        🎓 Student Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        <div
          onClick={() => navigate("/my-requests")}
          className="cursor-pointer bg-blue-600 p-6 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          <h2 className="text-2xl font-semibold text-white">
            My Requests
          </h2>
          <p className="text-white mt-2">
            Track your submitted issues
          </p>
        </div>

        <div
          onClick={() => navigate("/create-request")}
          className="cursor-pointer bg-green-700 p-6 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          <h2 className="text-2xl font-semibold text-white">
            Create Request
          </h2>
          <p className="text-white mt-2">
            Submit a new support request
          </p>
        </div>

        <div
          onClick={() => navigate("/notifications")}
          className="relative cursor-pointer bg-purple-600 p-6 rounded-xl shadow-lg hover:opacity-90 transition"
        >
          <h2 className="text-2xl font-semibold text-white">
            Notifications
          </h2>
          <p className="text-white mt-2">
            Updates from faculty
          </p>

          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Risk Prediction */}
      <div className="mt-8 bg-[#b7791f] p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6">
          📊 Student Risk Prediction
        </h2>

        <div className="grid md:grid-cols-4 gap-4 mb-4">

          {/* 🔥 type=number restores increment/decrement arrows */}
          <input
            type="number"
            placeholder="Attendance"
            value={attendance}
            onChange={(e) =>
              handleLimitedInput(e.target.value, setAttendance)
            }
            className="w-full p-3 rounded-full text-black"
          />

          <input
            type="number"
            placeholder="Internal marks"
            value={internalMarks}
            onChange={(e) =>
              handleLimitedInput(e.target.value, setInternalMarks)
            }
            className="w-full p-3 rounded-full text-black"
          />

          <input
            type="number"
            placeholder="Assignment"
            value={assignment}
            onChange={(e) =>
              handleLimitedInput(e.target.value, setAssignment)
            }
            className="w-full p-3 rounded-full text-black"
          />

          <input
            type="number"
            placeholder="Behavior"
            value={behavior}
            onChange={(e) =>
              handleLimitedInput(e.target.value, setBehavior)
            }
            className="w-full p-3 rounded-full text-black"
          />
        </div>

        {/* Button + Risk Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePredictRisk}
            className="
              px-8 py-3
              bg-black text-white
              rounded-full
              transition-all duration-200
              hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]
              active:scale-95
            "
          >
            Predict Risk
          </button>

          {riskResult &&
            riskResult !== "Please fill all fields" && (
              <span
                className={`px-4 py-2 rounded-full font-semibold ${riskBadgeColor()}`}
              >
                {riskResult}
              </span>
            )}
        </div>

        {riskResult === "Please fill all fields" && (
          <p className="mt-4 text-white-400 font-semibold">
            Please fill all fields!!
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
