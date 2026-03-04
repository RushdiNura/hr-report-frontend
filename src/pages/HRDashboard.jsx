import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReports, getStats } from "../api/reportApi";
import StatsCards from "../components/StatsCards";
import ReportsTable from "../components/ReportsTable";
import Spinner from "../components/Spinner";
import { Search, Filter, Inbox } from "lucide-react"; // Add these icons
import "../styles/dashboard.css";

export default function HRDashboard() {
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const intervalRef = useRef(null);

  const loadData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        getStats(),
        getReports(),
      ]);
      setStats(statsRes.data);
      setReports(reportsRes.data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);

      if (e.response?.status === 401 || e.response?.status === 403) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          console.log("Stopped background auto-refresh due to auth error.");
        }
      }
    }
  };

  useEffect(() => {
    loadData();

    intervalRef.current = setInterval(loadData, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const handleSearch = (event) => {
      const value =
        typeof event.detail === "string"
          ? event.detail
          : event.detail?.searchTerm;
      setSearchTerm(value?.toLowerCase() || "");
    };

    window.addEventListener("search-reports", handleSearch);
    return () => window.removeEventListener("search-reports", handleSearch);
  }, []);

  const filteredReports = reports.filter((report) => {
    if (!searchTerm) return true;
    return (
      report.coordinatorName?.toLowerCase().includes(searchTerm) ||
      report.qindeessaa?.toLowerCase().includes(searchTerm) ||
      report.services?.some((s) => s.sector?.toLowerCase().includes(searchTerm))
    );
  });

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="dashboard-fade-in">
      <StatsCards stats={stats} />

      <div className="content-card">
        <div className="card-header">
          <div className="header-info">
            <h3>All Submissions</h3>
            <p>Monitor real-time operational updates</p>
          </div>
          <span className="count-badge">
            {filteredReports.length} Report
            {filteredReports.length !== 1 ? "s" : ""} Total
          </span>
        </div>

        {filteredReports.length > 0 ? (
          <ReportsTable reports={filteredReports} />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              {searchTerm ? <Search size={48} /> : <Inbox size={48} />}
            </div>
            <h3 className="empty-state-title">
              {searchTerm ? "No matches found" : "No reports yet"}
            </h3>
            <p className="empty-state-description">
              {searchTerm
                ? `We couldn't find any reports matching "${searchTerm}"`
                : "Reports will appear here once they are submitted"}
            </p>
            {searchTerm && (
              <div className="empty-state-hint">
                <Filter size={14} />
                <span>Try adjusting your search terms</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getReports, getStats } from "../api/reportApi";
// import StatsCards from "../components/StatsCards";
// import ReportsTable from "../components/ReportsTable";
// import Spinner from "../components/Spinner";
// import "../styles/dashboard.css";

// export default function HRDashboard() {
//   const [stats, setStats] = useState({});
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

// const loadData = async () => {
//   try {
//       const [statsRes, reportsRes] = await Promise.all([
//         getStats(),
//         getReports(),
//       ]);

//     // const reportsRes = await getReports();
//           setStats(statsRes.data);
//     const newReports = reportsRes.data;

//     // update only if changed
//     if (newReports.length !== reports.length) {
//       setReports(newReports);
//     }
//   } catch (e) {
//     console.log("HR refresh error", e);
//   }
// };

// useEffect(() => {
//   loadData();

//   const interval = setInterval(loadData, 3000);
//   return () => clearInterval(interval);
// }, [reports.length]);

//   return (
//     <div className="dashboard-page">
//       {/* HEADER */}
//       {/* <div className="page-header">
//         <div>
//           <h1>HR Dashboard</h1>
//           <p>Daily service reports overview</p>
//         </div>

//         <button className="primary-btn" onClick={() => navigate("/signup")}>
//           + Create User
//         </button>
//       </div> */}

//       {/* STATS */}
//       <StatsCards stats={stats} />

//       {/* REPORTS SECTION */}
//       {/* <div className="card-section">
//         <div className="section-header">
//           <h3>Submitted Reports</h3>
//           <span>{reports.length} total</span>
//         </div>

//         {loading ? (
//           <div className="table-loading">
//             <Spinner size={26} />
//           </div>
//         ) : (
//           <ReportsTable reports={reports} />
//         )}
//       </div> */}
//       <div className="card-section">
//         <div className="section-header">
//           <h3>Submitted Reports</h3>
//           <span>{reports.length}</span>
//         </div>

//         <ReportsTable reports={reports} />
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { getReports, getStats } from "../api/reportApi";
// import StatsCards from "../components/StatsCards";
// import ReportsTable from "../components/ReportsTable";
// import Spinner from "../components/Spinner";
// import { FileText, PlusCircle, ChevronDown, RefreshCw } from "lucide-react";
// import "../styles/dashboard.css";

// export default function HRDashboard() {
//   const [stats, setStats] = useState({});
//   const [allReports, setAllReports] = useState([]);
//   const [displayedReports, setDisplayedReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [displayCount, setDisplayCount] = useState(8);

//   const navigate = useNavigate();
//   const initialLoadDone = useRef(false);

//   // Check if user is HR
//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     if (role !== "hr") {
//       navigate("/form");
//     }
//   }, [navigate]);

//   // Load initial data
//   const loadData = useCallback(
//     async (showRefresh = false) => {
//       if (showRefresh) setRefreshing(true);

//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/");
//           return;
//         }

//         const [statsRes, reportsRes] = await Promise.all([
//           getStats(),
//           getReports(),
//         ]);

//         setStats(statsRes.data);
//         setAllReports(reportsRes.data);
//       } catch (e) {
//         console.log("Dashboard error", e);
//         if (e.response?.status === 401) {
//           localStorage.clear();
//           navigate("/");
//         }
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [navigate],
//   );

//   // Run only once on mount
//   useEffect(() => {
//     if (!initialLoadDone.current) {
//       loadData();
//       initialLoadDone.current = true;
//     }
//   }, [loadData]);

//   // Listen for search events from Layout
//   useEffect(() => {
//     const handleSearch = (e) => {
//       setSearchTerm(e.detail.toLowerCase());
//     };

//     window.addEventListener("search", handleSearch);
//     return () => window.removeEventListener("search", handleSearch);
//   }, []);

//   // Filter reports based on search
//   const filteredReports = allReports.filter((report) => {
//     if (!searchTerm) return true;

//     return (
//       report.coordinatorName?.toLowerCase().includes(searchTerm) ||
//       report.qindeessaa?.toLowerCase().includes(searchTerm) ||
//       report.services?.some((s) => s.sector?.toLowerCase().includes(searchTerm))
//     );
//   });

//   // Update displayed reports when filters change
//   useEffect(() => {
//     setDisplayedReports(filteredReports.slice(0, displayCount));
//   }, [filteredReports, displayCount]);

//   const loadMore = () => {
//     setLoadingMore(true);
//     setTimeout(() => {
//       setDisplayCount((prev) => prev + 5);
//       setLoadingMore(false);
//     }, 500);
//   };

//   const handleRefresh = () => {
//     loadData(true);
//     setDisplayCount(8);
//   };

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 18) return "Good Afternoon";
//     return "Good Evening";
//   };

//   const userName = localStorage.getItem("name") || "User";

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <Spinner size={48} />
//         <p>Loading dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className="dashboard"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.3 }}
//     >
//       {/* Welcome Header */}
//       <div className="welcome-header">
//         <div>
//           <h1 className="welcome-title">
//             {getGreeting()}, <span className="welcome-name">{userName}</span>
//           </h1>
//           <p className="welcome-subtitle">
//             Here's what's happening with your reports today.
//           </p>
//         </div>

//         <div className="welcome-actions">
//           <button
//             className="btn-outline"
//             onClick={handleRefresh}
//             disabled={refreshing}
//           >
//             <RefreshCw size={18} className={refreshing ? "spin" : ""} />
//             Refresh
//           </button>

//           <button className="btn-primary" onClick={() => navigate("/signup")}>
//             <PlusCircle size={18} />
//             Create User
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <StatsCards stats={stats} />

//       {/* Reports Section */}
//       <div className="reports-section">
//         <div className="reports-header">
//           <div className="reports-title">
//             <FileText size={22} />
//             <div>
//               <h2>All Reports</h2>
//               <span className="reports-subtitle">
//                 {filteredReports.length} total • Last updated{" "}
//                 {new Date().toLocaleTimeString()}
//               </span>
//             </div>
//           </div>

//           {searchTerm && (
//             <span className="search-indicator">Searching: "{searchTerm}"</span>
//           )}
//         </div>

//         <ReportsTable reports={displayedReports} />

//         {displayedReports.length < filteredReports.length && (
//           <div className="load-more-container">
//             <button
//               className="load-more-btn"
//               onClick={loadMore}
//               disabled={loadingMore}
//             >
//               {loadingMore ? (
//                 <Spinner size={18} />
//               ) : (
//                 <>
//                   <ChevronDown size={18} />
//                   Load More ({filteredReports.length -
//                     displayedReports.length}{" "}
//                   remaining)
//                 </>
//               )}
//             </button>
//           </div>
//         )}

//         {displayedReports.length === 0 && !loading && (
//           <div className="empty-state">
//             <div className="empty-icon">📊</div>
//             <h3>No reports found</h3>
//             <p>
//               {searchTerm
//                 ? `No results matching "${searchTerm}"`
//                 : "No reports have been submitted yet"}
//             </p>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// }

// ... imports stay the same
