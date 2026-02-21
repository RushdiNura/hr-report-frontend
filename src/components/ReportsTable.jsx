import '../styles/table.css'
export default function ReportsTable({ reports }) {
  const base = "https://hr-report-backend.onrender.com/files/";

  return (
    <table className="reports-table">
      <thead>
        <tr>
          <th>Qindeessaa</th>
          <th>Guyyaa</th>
          <th>Tajaajila</th>
          <th>Faayila</th>
        </tr>
      </thead>

      <tbody>
        {reports.map((r) => {
          const file = r.uploadedFileName || r.generatedFileName;

          return (
            <tr key={r._id}>
              <td>{r.coordinatorName}</td>

              <td>
                {r.coordinatorDate
                  ? new Date(r.coordinatorDate).toLocaleDateString()
                  : "-"}
              </td>

              <td>{r.services?.length || 0}</td>

              <td>
                {file ? (
                  <a
                    className="download-btn"
                    href={`${base}${file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download XLSX
                  </a>
                ) : (
                  <span style={{ color: "#999" }}>No file</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
// export default function ReportsTable({ reports }) {
//   const base = "https://hr-report-backend.onrender.com/files/";

//   return (
//     <table className="reports-table">
//       <thead>
//         <tr>
//           <th>Qindeessaa</th>
//           <th>Guyyaa</th>
//           <th>Tajaajila</th>
//           <th>Generated File</th>
//           <th>Uploaded File</th>
//         </tr>
//       </thead>

//       <tbody>
//         {reports.map((r) => (
//           <tr key={r._id}>
//             <td>{r.coordinatorName}</td>
//             <td>
//               {r.coordinatorDate
//                 ? new Date(r.coordinatorDate).toLocaleDateString()
//                 : "-"}
//             </td>
//             <td>{r.services?.length || 0}</td>
//             <td>
//               {r.generatedFileName ? (
//                 <a
//                   href={`${base}${r.generatedFileName}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   style={{ color: "#4CAF50" }}
//                 >
//                   Download Generated
//                 </a>
//               ) : (
//                 <span style={{ color: "#999" }}>No file</span>
//               )}
//             </td>
//             <td>
//               {r.uploadedFileName ? (
//                 <a
//                   href={`${base}${r.uploadedFileName}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   style={{ color: "#2196F3" }}
//                 >
//                   Download Uploaded
//                 </a>
//               ) : (
//                 <span style={{ color: "#999" }}>No file</span>
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
