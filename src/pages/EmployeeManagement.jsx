import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Trash2,
  Search,
  Users,
  User,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import "../styles/employee-management.css";

const API = "https://hr-report-backend.onrender.com/api";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    if (!newEmployeeName.trim()) {
      toast.error("Please enter employee name");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/employees`,
        { name: newEmployeeName.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Employee created successfully");
      setShowAddModal(false);
      setNewEmployeeName("");
      fetchEmployees();
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error(error.response?.data?.message || "Failed to create employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/employees/${selectedEmployee._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Employee deleted successfully");
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(error.response?.data?.message || "Failed to delete employee");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="employee-loading">
        <Spinner size={48} />
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="employee-management">
      {/* Header */}
      <div className="employee-header">
        <div>
          <h1 className="employee-title">Hojjataa Management</h1>
          {/* <p className="employee-subtitle">Manage your department employees</p> */}
        </div>
        <button
          className="employee-btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={18} />
          Add Hojjataa
        </button>
      </div>

      {/* Stats */}
      <div className="employee-stats">
        <div className="stat-card">
          <Users size={20} />
          <div>
            <span className="stat-label">Total Hojjataa</span>
            <span className="stat-value">{employees.length}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="employee-search">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search employees by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Employees Grid */}
      <div className="employee-grid">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No employees found</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search"
                : "Add your first employee to get started"}
            </p>
            {!searchTerm && (
              <button
                className="employee-btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <UserPlus size={18} />
                Add First Employee
              </button>
            )}
          </div>
        ) : (
          filteredEmployees.map((emp) => (
            <motion.div
              key={emp._id}
              className="employee-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="employee-card-header">
                <div className="employee-avatar">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div className="employee-info">
                  <h3 className="employee-name">{emp.name}</h3>
                  <p className="employee-meta">
                    Added {new Date(emp.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="employee-delete-btn"
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setShowDeleteModal(true);
                  }}
                  title="Delete Employee"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewEmployeeName("");
        }}
        title="Add New Hojjataa"
        size="sm"
      >
        <form onSubmit={handleCreateEmployee} className="employee-modal-form">
          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="Enter employee name"
              autoFocus
              disabled={submitting}
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn-secondary"
              onClick={() => {
                setShowAddModal(false);
                setNewEmployeeName("");
              }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn-primary"
              disabled={submitting}
            >
              {submitting ? <Spinner size={18} /> : "Add Employee"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedEmployee(null);
        }}
        title="Delete Employee"
        size="sm"
      >
        <div className="delete-modal-content">
          <AlertCircle size={48} className="delete-icon" />
          <h3>Are you sure?</h3>
          <p>
            You are about to delete <strong>{selectedEmployee?.name}</strong>.
            This action cannot be undone.
          </p>
          <div className="modal-actions">
            <button
              className="modal-btn-secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedEmployee(null);
              }}
            >
              Cancel
            </button>
            <button className="modal-btn-danger" onClick={handleDeleteEmployee}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
