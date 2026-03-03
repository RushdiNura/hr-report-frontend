import { useState } from "react";
import toast from "react-hot-toast";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner"; 
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      toast.success("Welcome back!");

      if (res.data.role === "hr") navigate("/hr");
      else navigate("/form");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-header">
          <div className="login-logo">HR Report System</div>
          {/* <h2>Sign in</h2> */}
          <p>Enter your credentials to access the system</p>
        </div>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? <Spinner size={20} /> : "Sign in"}
        </button>
      </form>
    </div>
  );
}

// import { useState } from "react";
// import toast from "react-hot-toast";
// import { loginUser } from "../api/authApi";
// import { useNavigate } from "react-router-dom";
// import "../styles/login.css";
// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const handleLogin = async () => {
//     try {
//       const res = await loginUser({ email, password });
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("role", res.data.role);
//       localStorage.setItem("name", res.data.name);
//       if (res.data.role === "hr") navigate("/hr");
//       else navigate("/form");
//     } catch (err) {
//       toast.error("Login failed");
//     }
//   };
//   return (
//     <div className="login-container">
//       {" "}
//       <h2>HR Report System</h2>{" "}
//       <input
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />{" "}
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />{" "}
//       <button onClick={handleLogin}>Login</button>{" "}
//     </div>
//   );
// }
