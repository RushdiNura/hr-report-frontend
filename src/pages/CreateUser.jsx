import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import "../styles/create-user.css";

const API = "https://hr-report-backend.onrender.com";

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "head",
    qindeessaa: "foddaa1",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/register`, form);
      toast.success("User created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-page">
      <div className="create-user-card">
        <div className="create-user-header">
          <div className="header-icon">
            <UserPlus size={32} />
          </div>
          <h1>Create Department User</h1>
          <p>Add a new user to the system</p>
        </div>

        <div className="create-user-form">
          <div className="form-group">
            <label>
              <User size={16} />
              Full Name
            </label>
            <input
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              <Mail size={16} />
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="user@organization.gov"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={16} />
              Temporary Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              name="qindeessaa"
              value={form.qindeessaa}
              onChange={handleChange}
            >
              <option value="foddaa1">Foddaa 1</option>
              <option value="foddaa2">Foddaa 2</option>
              <option value="foddaa3">Foddaa 3</option>
              <option value="foddaa4">Foddaa 4</option>
              <option value="foddaa5">Foddaa 5</option>
              <option value="foddaa6">Foddaa 6</option>
              <option value="foddaa7">Foddaa 7</option>
              <option value="foddaa8">Foddaa 8</option>
              <option value="foddaa9">Foddaa 9</option>
              <option value="foddaa10">Foddaa 10</option>
              <option value="foddaa11">Foddaa 11</option>
              <option value="foddaa12">Foddaa 12</option>
            </select>
          </div>
        </div>

        <div className="create-user-actions">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Spinner size={18} /> : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
