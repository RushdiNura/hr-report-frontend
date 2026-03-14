import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trash2,
  Search,
  UserCog,
  Mail,
  Calendar,
  FileText,
  Users,
  Filter,
  AlertCircle,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import "../styles/head-management.css";

const API = "https://hr-report-backend.onrender.com/api";

export default function HeadManagement() {
  const [heads, setHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHead, setSelectedHead] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [headStats, setHeadStats] = useState({});

  const navigate = useNavigate();

  // Fetch all head users with their stats
  const fetchHeads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Get all head users
      const usersResponse = await axios.get(`${API}/auth/heads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const headsData = usersResponse.data;

      // Get all reports to calculate stats per head
      const reportsResponse = await axios.get(`${API}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reports = reportsResponse.data;

      // Calculate stats for each head
      const stats = {};
      headsData.forEach((head) => {
        const headReports = reports.filter(
          (r) => r.createdBy?._id === head._id || r.createdBy === head._id,
        );

        // Calculate total people served
        const totalPeople = headReports.reduce((sum, report) => {
          if (report.extractedTotal) {
            return sum + report.extractedTotal;
          }
          if (report.services && Array.isArray(report.services)) {
            const servicesTotal = report.services.reduce((s, service) => {
              return s + (parseInt(service.peopleServed) || 0);
            }, 0);
            return sum + servicesTotal;
          }
          return sum;
        }, 0);

        stats[head._id] = {
          reportCount: headReports.length,
          totalPeople: totalPeople,
          lastReport:
            headReports.length > 0
              ? new Date(
                  Math.max(...headReports.map((r) => new Date(r.createdAt))),
                )
              : null,
        };
      });

      setHeadStats(stats);
      setHeads(headsData);
    } catch (error) {
      console.error("Error fetching heads:", error);
      toast.error("Failed to load head users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeads();
  }, []);

const handleDeleteHead = async () => {
  if (!selectedHead) {
    toast.error("No head selected");
    return;
  }

  console.log("Deleting head:", selectedHead); 

  if (!selectedHead._id) {
    toast.error("Invalid head data - missing ID");
    console.error("Selected head missing _id:", selectedHead);
    setShowDeleteModal(false);
    setSelectedHead(null);
    return;
  }

  try {
    const token = localStorage.getItem("token");
    console.log("Deleting head with ID:", selectedHead._id); 

    const response = await axios.delete(
      `${API}/auth/heads/${selectedHead._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log("Delete response:", response.data); 
    toast.success("Head user deleted successfully");
    setShowDeleteModal(false);
    setSelectedHead(null);
    fetchHeads(); 
  } catch (error) {
    console.error("Error deleting head:", error);
    console.error("Error response:", error.response?.data); 

    if (error.response?.status === 401) {
      toast.error("Your session has expired. Please login again.");
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to delete this user.");
    } else if (error.response?.status === 404) {
      toast.error("User not found. It may have been already deleted.");
    } else {
      toast.error(
        error.response?.data?.message || "Failed to delete head user",
      );
    }
  }
};
 
  const filteredHeads = heads.filter((head) => {
    const matchesSearch =
      searchTerm === "" ||
      head.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      head.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "all" || head.qindeessaa === filterDepartment;

    return matchesSearch && matchesDepartment;
  });

  const getDepartmentColor = (dept) => {
    const colors = {
      foddaa1: "#3b82f6",
      foddaa2: "#10b981",
      foddaa3: "#f59e0b",
      foddaa4: "#ef4444",
      foddaa5: "#8b5cf6",
      foddaa6: "#ec4899",
      foddaa7: "#14b8a6",
      foddaa8: "#f97316",
      foddaa9: "#6366f1",
      foddaa10: "#a855f7",
      foddaa11: "#06b6d4",
      foddaa12: "#d946ef",
    };
    return colors[dept] || "#64748b";
  };

  const departments = [
    { value: "all", label: "All Foddaa" },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: `foddaa${i + 1}`,
      label: `Foddaa ${i + 1}`,
    })),
  ];

  const formatDate = (date) => {
    if (!date) return "Never";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="hm-loading-container">
        <Spinner size={48} />
        {/* <p>Loading head users...</p> */}
      </div>
    );
  }

  return (
    <div className="head-management">
      {/* Header */}
      <div className="hm-page-header">
        <div>
          <h1 className="hm-page-title">Qindeessaa Management</h1>
          {/* <p className="hm-page-subtitle">View and manage department heads</p> */}
        </div>
        <div className="hm-header-stats">
          <div className="hm-stat-item">
            <Users size={18} />
            <span>{heads.length} Total Qindeessaa</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="hm-filter-section">
        <div className="hm-search-wrapper">
          <Search size={18} className="hm-search-icon" />
          <input
            type="text"
            placeholder="Search qindeessaa by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hm-search-input"
          />
        </div>

        <div className="hm-filter-wrapper">
          <Filter size={18} className="hm-filter-icon" />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="hm-filter-select"
          >
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Heads Grid */}
      <div className="hm-heads-grid">
        {filteredHeads.length === 0 ? (
          <div className="hm-empty-state">
            <UserCog size={64} />
            <h3>No head users found</h3>
            <p>
              {searchTerm || filterDepartment !== "all"
                ? "Try adjusting your search or filter"
                : "No foddaa heads have been created yet"}
            </p>
            {(searchTerm || filterDepartment !== "all") && (
              <button
                className="hm-btn-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setFilterDepartment("all");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredHeads.map((head) => {
            const stats = headStats[head._id] || {
              reportCount: 0,
              totalPeople: 0,
              lastReport: null,
            };
            const deptColor = getDepartmentColor(head.qindeessaa);

            return (
              <motion.div
                key={head._id}
                className="hm-head-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="hm-head-card-header">
                  <div
                    className="hm-head-avatar"
                    style={{
                      background: `linear-gradient(135deg, ${deptColor}, ${deptColor}dd)`,
                    }}
                  >
                    {head.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hm-head-info">
                    <h3 className="hm-head-name">{head.name}</h3>
                    <p className="hm-head-email">
                      <Mail size={12} />
                      {head.email}
                    </p>
                  </div>
                  <button
                    className="hm-delete-btn"
                    onClick={() => {
                      setSelectedHead(head);
                      setShowDeleteModal(true);
                    }}
                    title="Delete Head"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="hm-head-card-body">
                  <div className="hm-detail-row">
                    <span className="hm-detail-label">Foddaa:</span>
                    <span
                      className="hm-department-badge"
                      style={{
                        background: `${deptColor}15`,
                        color: deptColor,
                      }}
                    >
                      {head.qindeessaa?.toUpperCase() || "N/A"}
                    </span>
                  </div>

                  <div className="hm-stats-grid">
                    <div className="hm-stat-box">
                      <FileText size={16} className="hm-stat-icon" />
                      <div className="hm-stat-content">
                        <span className="hm-stat-value">
                          {stats.reportCount}
                        </span>
                        <span className="hm-stat-label">Reports</span>
                      </div>
                    </div>

                    <div className="hm-stat-box">
                      <Users size={16} className="hm-stat-icon" />
                      <div className="hm-stat-content">
                        <span className="hm-stat-value">
                          {stats.totalPeople.toLocaleString()}
                        </span>
                        <span className="hm-stat-label">People Served</span>
                      </div>
                    </div>
                  </div>

                  <div className="hm-detail-row">
                    <Calendar size={14} className="hm-detail-icon" />
                    <span className="hm-detail-label">Last Report:</span>
                    <span className="hm-detail-value">
                      {formatDate(stats.lastReport)}
                    </span>
                  </div>
                </div>

                <div className="hm-head-card-footer">
                  <button
                    className="hm-view-reports-btn"
                    onClick={() => navigate(`/hr?head=${head._id}`)}
                  >
                    <Eye size={16} />
                    View Reports
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedHead(null);
        }}
        title="Delete Head User"
        size="sm"
      >
        {selectedHead && (
          <div className="hm-delete-modal-content">
            {" "}
            {/* Changed to hm-delete-modal-content */}
            <div className="hm-delete-icon">
              {" "}
              {/* Changed to hm-delete-icon */}
              <AlertCircle size={48} />
            </div>
            <h3 className="hm-delete-modal-title">Are you sure?</h3>{" "}
            {/* Changed to hm-delete-modal-title */}
            <p className="hm-delete-modal-text">
              {" "}
              {/* Changed to hm-delete-modal-text */}
              You are about to delete <strong>{selectedHead.name}</strong>. This
              will also remove all their reports and cannot be undone.
            </p>
            <div className="hm-modal-actions">
              {" "}
              {/* Changed to hm-modal-actions */}
              <button
                className="hm-btn-secondary" /* Changed to hm-btn-secondary */
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedHead(null);
                }}
              >
                Cancel
              </button>
              <button
                className="hm-btn-danger" /* Changed to hm-btn-danger */
                onClick={handleDeleteHead}
              >
                Delete Head
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
