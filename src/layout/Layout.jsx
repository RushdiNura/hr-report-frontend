// import { Link, useLocation } from "react-router-dom";
// import "./layout.css";
// import { LogOut } from "lucide-react";

// export default function Layout({ children }) {
//   const { pathname } = useLocation();

//   return (
//     <div className="app-shell">
//       <aside className="sidebar">
//         <div className="logo">
//           <div className="logo-title">HR Report</div>
//           {/* <div className="logo-sub">Reporting System</div> */}
//         </div>

//         <nav className="nav">
//           <Link
//             to="/hr"
//             className={pathname === "/hr" ? "nav-item active" : "nav-item"}
//           >
//             Dashboard
//           </Link>

//           {/* <Link
//             to="/form"
//             className={pathname === "/form" ? "nav-item active" : "nav-item"}
//           >
//             Submit Report
//           </Link> */}

//           <Link
//             to="/signup"
//             className={pathname === "/signup" ? "nav-item active" : "nav-item"}
//           >
//             Create User
//           </Link>
//         </nav>

//         <div className="sidebar-footer">
//           <button
//             className="logout-btn"
//             onClick={() => {
//               localStorage.clear();
//               window.location.href = "/";
//             }}
//           >
//             <LogOut size={18} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       <div className="main">
//         {/*<header className="topbar">
//           <div className="div">HR Reporting System</div>
//            <button
//             className="logout-btn"
//             onClick={() => {
//               localStorage.clear();
//               window.location.href = "/";
//             }}
//           >
//             Logout
//           </button>
//         </header>*/}

//         <div className="content">{children}</div>
//       </div>
//     </div>
//   );
// }

// import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
// import { useState, useEffect } from "react";
// import {
//   LayoutDashboard,
//   FileText,
//   PlusCircle,
//   LogOut,
//   Menu,
//   X,
//   Search,
// } from "lucide-react"; // Removed UserPlus
// import { motion, AnimatePresence } from "framer-motion";
// import "./layout.css";
// import mesob from "../assets/mesob.jpg";

// export default function Layout() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();

//   const userRole = localStorage.getItem("role");
//   const userName = localStorage.getItem("name") || "User";

//   // Close mobile sidebar on route change
//   useEffect(() => {
//     setMobileOpen(false);
//   }, [location]);

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/", { replace: true });
//   };

//   // Real-time search as you type (only for HR dashboard)
//   useEffect(() => {
//     if (location.pathname === "/dashboard") {
//       const timer = setTimeout(() => {
//         window.dispatchEvent(
//           new CustomEvent("search", { detail: searchQuery }),
//         );
//       }, 300);
//       return () => clearTimeout(timer);
//     }
//   }, [searchQuery, location.pathname]);

//   // Navigation items based on role
//   const getNavItems = () => {
//     if (userRole === "head") {
//       return [
//         {
//           path: "/form",
//           name: "Send Report",
//           icon: PlusCircle,
//         },
//       ];
//     } else {
//       // HR role
//       return [
//         {
//           path: "/dashboard",
//           name: "Dashboard",
//           icon: LayoutDashboard,
//         },
//         {
//           path: "/signup",
//           name: "Create User",
//           icon: FileText, // Using FileText instead of UserPlus
//         },
//       ];
//     }
//   };

//   const navItems = getNavItems();

//   return (
//     <div className="app-shell">
//       {/* Mobile overlay */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="mobile-overlay"
//             onClick={() => setMobileOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Sidebar */}
//       <aside
//         className={`sidebar ${sidebarOpen ? "open" : "closed"} ${mobileOpen ? "mobile-open" : ""}`}
//       >
//         <div className="sidebar-header">
//           <div className="logo">
//             <div className="logo-icon-wrapper">
//               <img src={mesob} alt="HR Report Logo" className="logo-icon" />
//             </div>
//             {sidebarOpen && (
//               <div className="logo-text">
//                 <span className="logo-title">HR Report</span>
//               </div>
//             )}
//           </div>

//           <button
//             className="sidebar-toggle"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             <Menu size={18} />
//           </button>

//           <button className="mobile-close" onClick={() => setMobileOpen(false)}>
//             <X size={20} />
//           </button>
//         </div>

//         <nav className="sidebar-nav">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;

//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`nav-item ${isActive ? "active" : ""}`}
//                 onClick={() => setMobileOpen(false)}
//               >
//                 <Icon size={20} />
//                 {sidebarOpen && <span className="nav-label">{item.name}</span>}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="sidebar-footer">
//           {sidebarOpen && (
//             <div className="user-info">
//               <div className="user-avatar">
//                 {userName.charAt(0).toUpperCase()}
//               </div>
//               <div className="user-details">
//                 <span className="user-name">{userName}</span>
//                 <span className="user-role">{userRole}</span>
//               </div>
//             </div>
//           )}

//           <button className="logout-btn" onClick={handleLogout}>
//             <LogOut size={18} />
//             {sidebarOpen && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div
//         className={`main-wrapper ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
//       >
//         <header className="topbar">
//           <button className="menu-btn" onClick={() => setMobileOpen(true)}>
//             <Menu size={20} />
//           </button>

//           <div className="topbar-title">
//             <span className="current-page">
//               {location.pathname === "/dashboard" && "Dashboard"}
//               {location.pathname === "/form" && "Send Report"}
//               {location.pathname === "/signup" && "Create User"}
//             </span>
//           </div>

//           <div className="topbar-actions">
//             {/* Search Bar - only show on HR dashboard */}
//             {userRole === "hr" && location.pathname === "/dashboard" && (
//               <div className="search-container">
//                 <Search size={16} className="search-icon" />
//                 <input
//                   type="text"
//                   placeholder="Search reports..."
//                   className="search-input"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             )}

//             <div className="user-greeting">
//               <span className="greeting-text">Welcome,</span>
//               <span className="user-name-display">{userName}</span>
//             </div>
//           </div>
//         </header>

//         <div className="content-wrapper">
//           <div
//             className="background-container"
//             style={{
//               backgroundImage: `url(${mesob})`,
//             }}
//           >
//             <div className="background-overlay" />
//           </div>

//           <main className="content">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  PlusCircle,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Search,
  User as UserIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import "./layout.css";
import mesob from "../assets/mesob.jpg";
import { logout } from "../api/authApi";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role") || "Staff";
  const userName = localStorage.getItem("name") || "User";

  
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("search-reports", { detail: searchQuery }),
      );
    }, 150); 
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      localStorage.clear();
      setLoggingOut(false);
      setShowLogoutModal(false);
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    }
  };

  const menuItems =
    userRole === "hr"
      ? [
          { path: "/hr", label: "Dashboard", icon: LayoutDashboard },
          { path: "/signup", label: "User Management", icon: UserPlus },
        ]
      : [{ path: "/form", label: "New Report", icon: PlusCircle }];

  return (
    <div className="app-shell">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`sidebar ${sidebarOpen ? "desktop-open" : "desktop-closed"} ${mobileOpen ? "mobile-show" : ""}`}
      >
        <div className="sidebar-header">
          <div className="brand-box">
            <div className="logo-container">
              <img src={mesob} alt="Logo" />
            </div>
            {(sidebarOpen || mobileOpen) && (
              <div className="brand-details">
                <span className="brand-main">HR Core</span>
                <span className="brand-sub">Reporting</span>
              </div>
            )}
          </div>
          <button
            className="close-mobile-btn"
            onClick={() => setMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item-link ${location.pathname === item.path ? "is-active" : ""}`}
            >
              <item.icon size={22} />
              {(sidebarOpen || mobileOpen) && (
                <span className="nav-text">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {(sidebarOpen || mobileOpen) && (
            <div className="profile-snippet">
              <div className="profile-avatar">{userName[0].toUpperCase()}</div>
              <div className="profile-info">
                <p className="p-name">{userName}</p>
                <p className="p-role">{userRole}</p>
              </div>
            </div>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={20} />{" "}
            {(sidebarOpen || mobileOpen) && <span>Logout</span>}
          </button>
        </div>

        {/* Professional Desktop Toggle (Hidden on Mobile) */}
        {!mobileOpen && (
          <button
            className="sidebar-trigger-pro"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronRight size={14} className={sidebarOpen ? "flip" : ""} />
          </button>
        )}
      </aside>

      <main className="main-viewport">
        <header className="main-header">
          <div className="header-left">
            <button
              className="btn-hamburger"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="header-title">HR System</h1>
          </div>

          {/* Unified Action Bar (Search & User Side-by-Side) */}
          <div className="header-right-actions">
            {location.pathname === "/hr" && (
              <div className="search-pill">
                <Search size={16} className="search-icon-ui" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <div className="header-user-pill">
              <UserIcon size={16} />
              <span>{userName}</span>
            </div>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}