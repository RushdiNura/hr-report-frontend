import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import "../styles/create.css";

const API = "https://hr-report-backend.onrender.com";

export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "head",
    qindeessaa: "foddaa1",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        qindeessaa: form.qindeessaa,
      };

      await axios.post(`${API}/api/auth/register`, payload);

      toast.success("Qindeessaa created successfully");
      navigate("/form");
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error(err.response?.data?.message || "Error creating qindeessaa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-wrapper">
      <form className="create-user-card" onSubmit={handleSubmit}>
        <div className="card-header">
          <h2>Create User</h2>
          <p>Register a new department head</p>
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

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

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
          {loading ? (
            <Spinner /> 
          ) : (
            "Create User"
          )}
        </button>
      </form>
    </div>
  );
}
