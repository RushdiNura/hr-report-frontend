import { Download } from "lucide-react";
import "../styles/table.css";

export default function ReportsTable({ reports }) {
  const base = "https://hr-report-backend.onrender.com/files/";

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="table-container">
      <table className="reports-table">
        <thead>
          <tr>
            {/* <th>#</th> */}
            <th>Qindeessaa</th>
            <th>Fooddaa</th>
            <th>Guyyaa</th>
            <th>Tajaajila</th>
            <th>Faayila</th>
          </tr>
        </thead>

        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-state">
                No reports available
              </td>
            </tr>
          ) : (
            reports.map((r) => {
              const file = r.generatedFileName?.endsWith(".docx")
                ? r.generatedFileName
                : null;

              return (
                <tr key={r._id}>
                  {/* <td>{i + 1}</td> */}

                  <td className="coordinator-cell">
                    <div className="coordinator-name">{r.coordinatorName}</div>
                  </td>

                  <td>
                    <span className="badge-fooddaa">
                      {r.qindeessaa || "N/A"}
                    </span>
                  </td>

                  <td>{formatDate(r.coordinatorDate)}</td>

                  <td className="text-center">{r.services?.length || 0}</td>

                  <td>
                    {file ? (
                      <a
                        href={`${base}${file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-btn"
                        title="Download"
                      >
                        <Download size={16} />
                      </a>
                    ) : (
                      <span className="no-file">No file</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// import { Download } from "lucide-react";
// import { motion } from "framer-motion";
// import "../styles/table.css";

// export default function ReportsTable({ reports }) {
//   const base = "https://hr-report-backend.onrender.com/files/";

//   const formatDate = (date) => {
//     if (!date) return "-";
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const getDepartmentColor = (dept) => {
//     const colors = {
//       foddaa1: "#3b82f6",
//       foddaa2: "#10b981",
//       foddaa3: "#f59e0b",
//       foddaa4: "#ef4444",
//       default: "#64748b",
//     };
//     return colors[dept] || colors.default;
//   };

//   return (
//     <div className="table-container">
//       <table className="reports-table">
//         <thead>
//           <tr>
//             <th>Qindeessaa</th>
//             <th>Fooddaa</th>
//             <th>Guyyaa</th>
//             <th>Tajaajila</th>
//             <th>Faayila</th> {/* Empty header for download column */}
//           </tr>
//         </thead>

//         <tbody>
//           {reports.length === 0 ? (
//             <tr>
//               <td colSpan="5" className="empty-state">
//                 No reports available
//               </td>
//             </tr>
//           ) : (
//             reports.map((r, index) => {
//               const file = r.generatedFileName?.endsWith(".docx")
//                 ? r.generatedFileName
//                 : null;

//               return (
//                 <motion.tr
//                   key={r._id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.03 }}
//                 >
//                   <td className="coordinator-cell">
//                     <div className="coordinator-avatar">
//                       {r.coordinatorName?.charAt(0) || "U"}
//                     </div>
//                     <div className="coordinator-info">
//                       <div className="coordinator-name">
//                         {r.coordinatorName}
//                       </div>
//                     </div>
//                   </td>

//                   <td>
//                     <span
//                       className="department-badge"
//                       style={{
//                         background: `${getDepartmentColor(r.qindeessaa)}15`,
//                         color: getDepartmentColor(r.qindeessaa),
//                       }}
//                     >
//                       {r.qindeessaa?.toUpperCase() || "N/A"}
//                     </span>
//                   </td>

//                   <td className="date-cell">{formatDate(r.coordinatorDate)}</td>

//                   <td className="text-center">
//                     <span className="service-count">
//                       {r.services?.length || 0}
//                     </span>
//                   </td>

//                   <td className="download-cell">
//                     {file ? (
//                       <a
//                         href={`${base}${file}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="download-link"
//                         title="Download"
//                       >
//                         <Download size={18} />
//                       </a>
//                     ) : (
//                       <span className="no-file">—</span>
//                     )}
//                   </td>
//                 </motion.tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }