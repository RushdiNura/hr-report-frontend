// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import ReportForm from "./pages/ReportForm";
// import HRDashboard from "./pages/HRDashboard";
// import CreateUser from "./pages/Signup";
// import Signup from "./pages/Signup";
// import { Toaster } from "react-hot-toast";
// import Layout from "./layout/Layout";

// function PrivateRoute({ children, role }) {
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role");

//   if (!token) return <Navigate to="/" />;

//   if (role && role !== userRole) return <Navigate to="/" />;

//   return children;
// }

// export default function App() {
//   return (
//     <>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             borderRadius: "8px",
//             background: "#fff",
//             color: "#333",
//             fontWeight: "500",
//           },
//           success: {
//             style: { borderLeft: "5px solid #16a34a" },
//           },
//           error: {
//             style: { borderLeft: "5px solid #dc2626" },
//           },
//         }}
//       />
//       <Routes>
//         <Route path="/" element={<Login />} />
//         {/* <Route path="/signup" element={<Signup />} /> */}

//         <Route
//           path="/form"
//           element={
//             <PrivateRoute role="head">

//                 <ReportForm />

//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/hr"
//           element={
//             <PrivateRoute role="hr">
//               <Layout>
//                 <HRDashboard />
//               </Layout>
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/signup"
//           element={
//             <PrivateRoute role="hr">

//                 <Signup />

//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </>
//   );
// }

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import ReportForm from "./pages/ReportForm";
// import HRDashboard from "./pages/HRDashboard";
// import Signup from "./pages/Signup";
// import { Toaster } from "react-hot-toast";
// import Layout from "./layout/Layout";

// function PrivateRoute({ children, role }) {
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role");

//   if (!token) return <Navigate to="/" replace />;
//   if (role && role !== userRole) return <Navigate to="/" replace />;

//   return children;
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Toaster position="top-right" />
//       <Routes>
//         {/* Public Route */}
//         <Route path="/" element={<Login />} />

//         {/* HR Protected Routes - Shared Layout */}
//         <Route
//           element={
//             <PrivateRoute role="hr">
//               <Layout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="/dashboard" element={<HRDashboard />} />
//           <Route path="/signup" element={<Signup />} />
//         </Route>

//         {/* Head Protected Routes */}
//         <Route
//           element={
//             <PrivateRoute role="head">
//               <Layout />
//             </PrivateRoute>
//           }
//         >
//           <Route path="/form" element={<ReportForm />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

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

        {/* HR ROUTES - Shared Layout instance prevents reload bugs */}
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

        {/* HEAD ROUTES */}
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