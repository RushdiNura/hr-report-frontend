import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { getReports, getStats } from "../api/reportApi";
import StatsCards from "../components/StatsCards";
import ReportsTable from "../components/ReportsTable";
import "../styles/dashboard.css";

export default function HRDashboard() {
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const navigate = useNavigate(); // Add this line

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
      <button onClick={() => navigate("/create-user")}>Create User</button>

      <StatsCards stats={stats} />

      <ReportsTable reports={reports} />
      
    </div>
  );
}
