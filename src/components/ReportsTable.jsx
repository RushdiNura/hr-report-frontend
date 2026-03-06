// import { Download } from "lucide-react";
// import toast from "react-hot-toast";
// import "../styles/table.css";
// export default function ReportsTable({ reports }) {
//   const base = "https://hr-report-backend.onrender.com/files/";

// const formatDate = (date) => {
//   if (!date) return "-";
//   const d = new Date(date);
//   const day = d.getDate().toString().padStart(2, "0");
//   const month = (d.getMonth() + 1).toString().padStart(2, "0");
//   const year = d.getFullYear().toString().slice(-2); // Gets last 2 digits of year
//   return `${day}/${month}/${year}`; // Returns DD/MM/YY
// };


//   const handleDownload = async (fileUrl, filename) => {
//     try {
//       // Fetch with authentication
//       const response = await fetch(fileUrl, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Download failed");
//       }

//       // Convert to blob
//       const blob = await response.blob();

//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();

//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);

//       toast.success("Download started!");
//     } catch (error) {
//       console.error("Download error:", error);
//       toast.error("Failed to download file");
//     }   
//   };

//   return (
//     <div className="table-container">
//       <table className="reports-table">
//         <thead>
//           <tr>
//             <th>Qindeessaa</th>
//             <th>Foddaa</th>
//             <th>Guyyaa</th>
//             <th>Tajaajila</th>
//             <th>Faayila</th>
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
//             reports.map((r) => {
//               const file = r.generatedFileName?.endsWith(".docx")
//                 ? r.generatedFileName
//                 : null;

//               return (
//                 <tr key={r._id}>
//                   <td className="coordinator-cell">
//                     <div className="coordinator-name">{r.coordinatorName}</div>
//                   </td>

//                   <td>
//                     <span className="badge-fooddaa">
//                       {r.qindeessaa || "N/A"}
//                     </span>
//                   </td>

//                   <td className="date-cell">{formatDate(r.coordinatorDate)}</td>

//                   <td className="text-center">
//                     {r.services?.length || <span className="no-file">—</span>}
//                   </td>

//                   <td>
//                     {file ? (
//                       <button
//                         onClick={() => handleDownload(`${base}${file}`, file)}
//                         className="icon-btn"
//                         title="Download"
//                       >
//                         <Download size={16} />
//                       </button>
//                     ) : (
//                       <span className="no-file">—</span>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { Download } from "lucide-react";
import toast from "react-hot-toast";
import "../styles/table.css";

export default function ReportsTable({ reports }) {
  const base = "https://hr-report-backend.onrender.com/files/";

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Calculate total people served for a report
  const calculateTotalPeopleServed = (services, extractedTotal) => {
    // If it's a file upload with extracted total, use that
    if (extractedTotal !== undefined && extractedTotal !== null) {
      return extractedTotal;
    }

    // Otherwise calculate from services array
    if (!services || !Array.isArray(services)) return 0;

    return services.reduce((total, service) => {
      const peopleServed = parseInt(service.peopleServed) || 0;
      return total + peopleServed;
    }, 0);
  };

 const handleDownload = async (filename) => {
   const token = localStorage.getItem("token");

   if (!token) {
     toast.error("Your session has expired. Please login again.");
     setTimeout(() => navigate("/"), 2000);
     return;
   }

   const loadingToast = toast.loading("Downloading...");

   try {
     const downloadUrl = `https://hr-report-backend.onrender.com/api/download/${filename}`;

     const response = await fetch(downloadUrl, {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

     // Handle specific HTTP status codes
     if (response.status === 401) {
       toast.dismiss(loadingToast);
       toast.error("Your session has expired. Please login again.");
       localStorage.clear();
       setTimeout(() => navigate("/"), 2000);
       return;
     }

     if (response.status === 403) {
       toast.dismiss(loadingToast);
       toast.error("You don't have permission to download this file.");
       return;
     }

     if (response.status === 404) {
       toast.dismiss(loadingToast);
       toast.error("File not found on server.");
       return;
     }

     if (!response.ok) {
       throw new Error(`Download failed (${response.status})`);
     }

     const blob = await response.blob();

     // Check if blob is valid
     if (blob.size === 0) {
       throw new Error("Downloaded file is empty");
     }

     const blobUrl = window.URL.createObjectURL(blob);
     const link = document.createElement("a");
     link.href = blobUrl;
     link.download = filename;
     document.body.appendChild(link);
     link.click();

     setTimeout(() => {
       document.body.removeChild(link);
       window.URL.revokeObjectURL(blobUrl);
     }, 100);

     toast.dismiss(loadingToast);
     toast.success("Download started!");
   } catch (error) {
     console.error("Download error:", error);
     toast.dismiss(loadingToast);

     // Give user specific error message
     if (error.message.includes("Failed to fetch")) {
       toast.error("Network error. Please check your connection.");
     } else {
       toast.error(error.message || "Failed to download file");
     }
   }
 };

  return (
    <div className="table-container">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Qindeessaa</th>
            <th>Foddaa</th>
            <th>Guyyaa</th>
            <th>Baay'ina Namoota</th>
            <th>Faayila</th>
          </tr>
        </thead>

        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-state">
                No reports available
              </td>
            </tr>
          ) : (
            reports.map((r) => {
              const file = r.generatedFileName?.endsWith(".docx")
                ? r.generatedFileName
                : null;

              // Pass both services and extractedTotal to the calculation function
              const totalPeople = calculateTotalPeopleServed(
                r.services,
                r.extractedTotal,
              );

              return (
                <tr key={r._id}>
                  <td className="coordinator-cell">
                    <div className="coordinator-name">{r.coordinatorName}</div>
                  </td>

                  <td>
                    <span className="badge-fooddaa">
                      {r.qindeessaa || "N/A"}
                    </span>
                  </td>

                  <td className="date-cell">{formatDate(r.coordinatorDate)}</td>

                  <td className="text-center">
                    <span className="people-count-badge">
                      {totalPeople > 0 ? (
                        totalPeople
                      ) : (
                        <span className="no-file">—</span>
                      )}
                      {r.extractedTotal && (
                        <span
                          className="extracted-indicator"
                          title="Extracted from uploaded file"
                        >
                          📄
                        </span>
                      )}
                    </span>
                  </td>

                  <td>
                    {file ? (
                      <button
                        onClick={() => handleDownload(`${base}${file}`, file)}
                        className="icon-btn"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                    ) : (
                      <span className="no-file">—</span>
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
