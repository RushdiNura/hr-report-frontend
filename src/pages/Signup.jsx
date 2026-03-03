// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "../styles/create.css";
// import toast from "react-hot-toast";

// const API = "https://hr-report-backend.onrender.com";

// export default function CreateUser() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "head",
//     qindeessaa: "foddaa1",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!form.name || !form.email || !form.password) {
//         toast.error("Please fill all fields");
//         return;
//       }

//       const userData = {
//         name: form.name,
//         email: form.email,
//         password: form.password,
//         role: form.role,
//         qindeessaa: form.qindeessaa,
//       };

//       console.log("Submitting user:", userData);

//       const response = await axios.post(`${API}/api/auth/register`, userData);
//       console.log("Response:", response.data);
//       toast.success("Qindessaa is created successfully");
//       navigate("/form");
//     } catch (err) {
//       console.error("Error creating user:", err);
//       toast.error(err.response?.data?.message || "Error creating user");
//     }
//   };

//   return (
//     <div className="create-user-container">
//       <h2>Create Department User</h2>

//       <input
//         name="name"
//         placeholder="Full Name"
//         value={form.name}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="email"
//         placeholder="Email"
//         type="email"
//         value={form.email}
//         onChange={handleChange}
//         required
//       />

//       <input
//         name="password"
//         type="password"
//         placeholder="Temporary Password"
//         value={form.password}
//         onChange={handleChange}
//         required
//       />

//       <label>Qindeessitoota:</label>
//       <select name="qindeessaa" value={form.qindeessaa} onChange={handleChange}>
//         <option value="foddaa1">Foddaa 1</option>
//         <option value="foddaa2">Foddaa 2</option>
//         <option value="foddaa3">Foddaa 3</option>
//         <option value="foddaa4">Foddaa 4</option>
//         <option value="foddaa5">Foddaa 5</option>
//         <option value="foddaa6">Foddaa 6</option>
//         <option value="foddaa7">Foddaa 7</option>
//         <option value="foddaa8">Foddaa 8</option>
//         <option value="foddaa9">Foddaa 9</option>
//         <option value="foddaa10">Foddaa 10</option>
//         <option value="foddaa11">Foddaa 11</option>
//         <option value="foddaa12">Foddaa 12</option>
//       </select>

//       <button onClick={handleSubmit}>Create User</button>
//     </div>
//   );
// }
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

      toast.success("User created successfully");
      navigate("/form");
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error(err.response?.data?.message || "Error creating user");
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
            <Spinner  /> // Only spinner, no text
          ) : (
            "Create User"
          )}
        </button>
      </form>
    </div>
  );
}