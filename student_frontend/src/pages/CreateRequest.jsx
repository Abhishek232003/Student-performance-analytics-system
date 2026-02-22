import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function CreateRequest() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.description.trim()
    ) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/api/requests/"


,   // 🔥 changed
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            student_name: "Ajai",
            title: formData.title,
            category: formData.category,
            risk: "Medium"
          })
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSuccess(true);
      setFormData({
        title: "",
        category: "",
        description: ""
      });

    } catch (err) {
      console.error("Fetch error:", err);
      setError("Backend not reachable or error creating request");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        📝 Create Support Request
      </h1>

      <div className="max-w-3xl bg-[#b7791f] p-6 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="title"
            placeholder="Request title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded text-black"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 rounded text-black"
          >
            <option value="">Select category</option>
            <option value="Academic">Academic</option>
            <option value="Attendance">Attendance</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="description"
            rows="4"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded text-black"
          />

          {error && <p className="text-red-200">{error}</p>}
          {success && <p className="text-green-200">✅ Request submitted</p>}

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black text-white rounded-full"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>

        </form>
      </div>
    </DashboardLayout>
  );
}

export default CreateRequest;
