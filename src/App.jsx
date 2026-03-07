import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import ReportForm from "./pages/ReportForm";
import HRDashboard from "./pages/HRDashboard";
import Signup from "./pages/Signup";
import Layout from "./layout/Layout";

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  if (!token) return <Navigate to="/" replace />;
  if (role && role !== userRole) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          element={
            <PrivateRoute role="hr">
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/hr" element={<HRDashboard />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route
          element={
            <PrivateRoute role="head">
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/form" element={<ReportForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
