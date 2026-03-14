// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getReports, getStats } from "../api/reportApi";
// import StatsCards from "../components/StatsCards";
// import ReportsTable from "../components/ReportsTable";
// import Spinner from "../components/Spinner";
// import { Search, Filter, Inbox } from "lucide-react";
// import "../styles/dashboard.css";

// export default function HRDashboard() {
//   const [stats, setStats] = useState({});
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   const intervalRef = useRef(null);

//   const loadData = async () => {
//     try {
//       const [statsRes, reportsRes] = await Promise.all([
//         getStats(),
//         getReports(),
//       ]);
//       setStats(statsRes.data);
//       setReports(reportsRes.data);
//       setLoading(false);
//     } catch (e) {
//       console.error(e);
//       setLoading(false);

//       if (e.response?.status === 401) {
//         if (intervalRef.current) {
//           clearInterval(intervalRef.current);
//           console.log("Stopped auto-refresh due to expired session.");
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     loadData();

//     intervalRef.current = setInterval(loadData, 15000);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   useEffect(() => {
//     const handleSearch = (event) => {
//       const value =
//         typeof event.detail === "string"
//           ? event.detail
//           : event.detail?.searchTerm;
//       setSearchTerm(value?.toLowerCase() || "");
//     };

//     window.addEventListener("search-reports", handleSearch);
//     return () => window.removeEventListener("search-reports", handleSearch);
//   }, []);

//   const filteredReports = reports.filter((report) => {
//     if (!searchTerm) return true;
//     return (
//       report.coordinatorName?.toLowerCase().includes(searchTerm) ||
//       report.qindeessaa?.toLowerCase().includes(searchTerm) ||
//       report.services?.some((s) => s.sector?.toLowerCase().includes(searchTerm))
//     );
//   });

//   if (loading) {
//     return (
//       <div className="fullscreen-loader">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-fade-in">
//       <StatsCards stats={stats} />

//       <div className="content-card">
//         <div className="card-header">
//           <div className="header-info">
//             <h3>All Submissions</h3>
//             <p>Monitor real-time operational updates</p>
//           </div>
//           <span className="count-badge">
//             {filteredReports.length} Report
//             {filteredReports.length !== 1 ? "s" : ""} Total
//           </span>
//         </div>

//         {filteredReports.length > 0 ? (
//           <ReportsTable reports={filteredReports} />
//         ) : (
//           <div className="empty-state">
//             <div className="empty-state-icon">
//               {searchTerm ? <Search size={48} /> : <Inbox size={48} />}
//             </div>
//             <h3 className="empty-state-title">
//               {searchTerm ? "No matches found" : "No reports yet"}
//             </h3>
//             <p className="empty-state-description">
//               {searchTerm
//                 ? `We couldn't find any reports matching "${searchTerm}"`
//                 : "Reports will appear here once they are submitted"}
//             </p>
//             {searchTerm && (
//               <div className="empty-state-hint">
//                 <Filter size={14} />
//                 <span>Try adjusting your search terms</span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReports, getStats } from "../api/reportApi";
import StatsCards from "../components/StatsCards";
import ReportsTable from "../components/ReportsTable";
import Spinner from "../components/Spinner";
import { Search, Filter, Inbox } from "lucide-react";
import { connectSocket, disconnectSocket } from "../services/socket";
import toast from "react-hot-toast";
import "../styles/dashboard.css";

export default function HRDashboard() {
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

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
      console.error("Error loading data:", e);
      if (e.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  };

  useEffect(() => {
    loadData();

    // Connect to socket
    const socket = connectSocket();

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to real-time server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Disconnected from real-time server");
    });

    // Handle new report
    socket.on("newReport", (newReport) => {
      console.log("📢 New report received:", newReport);
      setReports((prevReports) => [newReport, ...prevReports]);

      // Show notification
      toast.success(`📄 New report from ${newReport.coordinatorName}`, {
        duration: 4000,
        position: "top-right",
      });
    });

    // Handle stats update
    socket.on("statsUpdated", (newStats) => {
      console.log("📊 Stats updated:", newStats);
      setStats(newStats);
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newReport");
      socket.off("statsUpdated");
      disconnectSocket();
    };
  }, [navigate]);

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
      {isConnected && (
        <div className="connection-status">
          <span className="status-dot"></span>
          <span>Live Updates</span>
        </div>
      )}

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