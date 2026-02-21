import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ReportForm from "./pages/ReportForm";
import HRDashboard from "./pages/HRDashboard";
import CreateUser from "./pages/Create";

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;

  if (role && role !== userRole) return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create" element={<CreateUser />} />
        <Route
          path="/form"
          element={
            <PrivateRoute role="head">
              <ReportForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/hr"
          element={
            <PrivateRoute role="hr">
              <HRDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
