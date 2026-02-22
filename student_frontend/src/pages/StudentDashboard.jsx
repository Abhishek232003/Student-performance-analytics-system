import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

function StudentDashboard() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    attendance: "",
    internal_marks: "",
    assignment: "",
    behavior: ""
  });

  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!/^\d*$/.test(value)) return;

    let numericValue = value === "" ? "" : Number(value);

    if (name === "attendance" && numericValue > 100) return;
    if (name === "internal_marks" && numericValue > 100) return;
    if (name === "assignment" && numericValue > 10) return;
    if (name === "behavior" && numericValue > 10) return;

    setFormData({ ...formData, [name]: value });
    setRisk(null);
    setError("");
  };

  // Map backend string response to UI styling
  const mapRisk = (riskLevel) => {
    if (riskLevel === "Low")
      return { label: "Low Risk", color: "bg-green-600" };

    if (riskLevel === "Medium")
      return { label: "Medium Risk", color: "bg-orange-500" };

    return { label: "High Risk", color: "bg-red-600" };
  };

  const predictRisk = async () => {
    setError("");

    if (Object.values(formData).some((v) => v === "")) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/students/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attendance: Number(formData.attendance),
            internal_marks: Number(formData.internal_marks),
            assignment: Number(formData.assignment),
            behavior: Number(formData.behavior)
          })
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      const mapped = mapRisk(data.predicted_risk);

      setRisk(mapped);

    } catch (err) {
      console.error(err);
      setError("Backend not reachable");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        🎓 Student Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          className="card-blue cursor-pointer hover:opacity-90"
          onClick={() => navigate("/my-requests")}
        >
          <h2 className="text-xl font-semibold">My Requests</h2>
          <p className="text-gray-200 mt-2">
            Track your submitted issues
          </p>
        </div>

        <div
          className="card-green cursor-pointer hover:opacity-90"
          onClick={() => navigate("/create-request")}
        >
          <h2 className="text-xl font-semibold">Create Request</h2>
          <p className="text-gray-200 mt-2">
            Submit a new support request
          </p>
        </div>

        <div
          className="card-purple cursor-pointer hover:opacity-90"
          onClick={() => navigate("/notifications")}
        >
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="text-gray-200 mt-2">
            Updates from faculty
          </p>
        </div>

        {/* ML Prediction */}
        <div className="card-yellow md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">
            📊 Student Risk Prediction
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
            {["attendance", "internal_marks", "assignment", "behavior"].map((field) => (
              <div key={field}>
                <input
                  type="text"
                  name={field}
                  placeholder={field.replace("_", " ")}
                  value={formData[field]}
                  onChange={handleChange}
                  className="p-2 rounded text-black w-full"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="text-red-600 font-semibold mb-3">{error}</p>
          )}

          <button
            onClick={predictRisk}
            disabled={loading}
            className="
              px-8 py-3
              bg-black text-white
              rounded-full
              transition-all duration-200
              hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]
              active:scale-95
              disabled:opacity-50
            "
          >
            {loading ? "Predicting..." : "Predict Risk"}
          </button>

          {risk && (
            <div
              className={`mt-4 inline-block px-6 py-2 rounded-full text-white font-semibold ${risk.color}`}
            >
              {risk.label}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
