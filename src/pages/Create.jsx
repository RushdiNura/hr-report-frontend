import { useState } from "react";
import axios from "axios";
import "../styles/create.css";

const API = "https://hr-report-backend.onrender.com";

export default function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "head",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API}/auth/register`, form);
      alert("User created successfully");
      setForm({ name: "", email: "", password: "", role: "head" });
    } catch (err) {
      alert("Error creating user");
    }
  };

  return (
    <div className="create-user-container">
      <h2>Create Department User</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Temporary Password"
        value={form.password}
        onChange={handleChange}
      />

      <select name="role" value={form.role} onChange={handleChange}>
        <option value="head">Department Head</option>
        <option value="hr">HR</option>
      </select>

      <button onClick={handleSubmit}>Create User</button>
    </div>
  );
}
