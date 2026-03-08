import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { Eye, EyeOff } from "lucide-react"; // Import Icons
import "../styles/create.css";

const API = "https://hr-report-backend.onrender.com";

export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "head",
    qindeessaa: "foddaa1",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.name || e.target.name]: e.value || e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/register`, form);
      toast.success("Qindeessaa created successfully");
      navigate("/form");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating qindeessaa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-wrapper">
      <form className="create-user-card" onSubmit={handleSubmit}>
        <div className="card-header">
          <h2>Create Head</h2>
          <p>Register a new Qindeessaa</p>
        </div>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Professional Password Field */}
        <div className="password-input-wrapper">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="select-group">
          <label>Qindeessitoota:</label>
          <select
            name="qindeessaa"
            value={form.qindeessaa}
            onChange={handleChange}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={`foddaa${i + 1}`}>
                Foddaa {i + 1}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? <Spinner /> : "Create User"}
        </button>
      </form>
    </div>
  );
}
