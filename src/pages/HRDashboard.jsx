import { useEffect, useState } from "react";
import { getReports, getStats } from "../api/reportApi";
import StatsCards from "../components/StatsCards";
import ReportsTable from "../components/ReportsTable";
import "../styles/dashboard.css";
import { Navigate } from "react-router-dom";
export default function HRDashboard() {
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const statsRes = await getStats();
    const reportsRes = await getReports();

    setStats(statsRes.data);
    setReports(reportsRes.data);
  };

  return (
    <div className="dashboard">
      <h2>HR Dashboard</h2>
      <button onClick={() => Navigate("/create-user")}>Create User</button>

      <StatsCards stats={stats} />

      <ReportsTable reports={reports} />
    </div>
  );
}
