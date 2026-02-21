// import { useState } from "react";
// import { createReport } from "../api/reportApi";
// import "../styles/report.css";
// const emptyRow = {
//   sector: "",
//   service: "",
//   resource: "",
//   peopleServed: "",
//   employee: "",
//   date: "",
//   remark: "",
// };

// export default function ReportForm() {
//   const [services, setServices] = useState(
//     Array.from({ length: 7 }, () => ({ ...emptyRow })),
//   );

//   const [coordinatorName, setCoordinatorName] = useState("");
//   const [coordinatorDate, setCoordinatorDate] = useState("");
//   const [signature, setSignature] = useState("");

//   const handleChange = (index, field, value) => {
//     const updated = [...services];
//     updated[index][field] = value;
//     setServices(updated);
//   };

//   const handleSubmit = async () => {
//     const filtered = services.filter(
//       (s) => s.sector || s.service || s.employee,
//     );

//     await createReport({
//       coordinatorName,
//       coordinatorDate,
//       signature,
//       services: filtered,
//     });

//     alert("Gabaasaan galmaa'e");
//   };

//   return (
//     <div className="report-container">
//       <h2>Formatii Gabaasaa</h2>

//       <table className="report-table">
//         <thead>
//           <tr>
//             <th>Lakk</th>
//             <th>Sektara</th>
//             <th>Tajaajila</th>
//             <th>Fooda</th>
//             <th>Bayyina</th>
//             <th>Hojjeta</th>
//             <th>Guyyaa</th>
//             <th>Ibsa</th>
//           </tr>
//         </thead>

//         <tbody>
//           {services.map((row, i) => (
//             <tr key={i}>
//               <td>{i + 1}</td>

//               <td>
//                 <input
//                   value={row.sector}
//                   onChange={(e) => handleChange(i, "sector", e.target.value)}
//                 />
//               </td>

//               <td>
//                 <input
//                   value={row.service}
//                   onChange={(e) => handleChange(i, "service", e.target.value)}
//                 />
//               </td>

//               <td>
//                 <input
//                   value={row.resource}
//                   onChange={(e) => handleChange(i, "resource", e.target.value)}
//                 />
//               </td>

//               <td>
//                 <input
//                   type="number"
//                   value={row.peopleServed}
//                   onChange={(e) =>
//                     handleChange(i, "peopleServed", e.target.value)
//                   }
//                 />
//               </td>

//               <td>
//                 <input
//                   value={row.employee}
//                   onChange={(e) => handleChange(i, "employee", e.target.value)}
//                 />
//               </td>

//               <td>
//                 <input
//                   type="date"
//                   value={row.date}
//                   onChange={(e) => handleChange(i, "date", e.target.value)}
//                 />
//               </td>

//               <td>
//                 <input
//                   value={row.remark}
//                   onChange={(e) => handleChange(i, "remark", e.target.value)}
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="footer-fields">
//         <div>
//           <label>Maqaa Qindeessaa</label>
//           <input
//             value={coordinatorName}
//             onChange={(e) => setCoordinatorName(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Guyyaa</label>
//           <input
//             type="date"
//             value={coordinatorDate}
//             onChange={(e) => setCoordinatorDate(e.target.value)}
//           />
//         </div>

//         <div>
//           <label>Mallattoo</label>
//           <input
//             value={signature}
//             onChange={(e) => setSignature(e.target.value)}
//           />
//         </div>
//       </div>

//       <button className="submit-btn" onClick={handleSubmit}>
//         Gabaasaa Ergi
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import { createReport } from "../api/reportApi";
import "../styles/report.css";

const emptyRow = {
  sector: "",
  service: "",
  resource: "",
  peopleServed: "",
  employee: "",
  date: "",
  remark: "",
};

export default function ReportForm() {
  const [services, setServices] = useState(
    Array.from({ length: 7 }, () => ({ ...emptyRow })),
  );

  const [coordinatorName, setCoordinatorName] = useState("");
  const [coordinatorDate, setCoordinatorDate] = useState("");
  const [signature, setSignature] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0].name);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const filtered = services.filter(
        (s) => s.sector || s.service || s.employee,
      );

      // Log the data before sending
      console.log("Submitting with data:", {
        coordinatorName,
        coordinatorDate,
        signature,
        servicesCount: filtered.length,
        hasFile: !!uploadedFile,
        fileName: uploadedFile?.name,
      });

      // Create FormData
      const formData = new FormData();

      // IMPORTANT: These field names must match what backend expects
      formData.append("coordinatorName", coordinatorName);
      formData.append("coordinatorDate", coordinatorDate);
      formData.append("signature", signature);
      formData.append("services", JSON.stringify(filtered));

      // IMPORTANT: This field name must match the one in multer upload.single()
      // In your route, you have upload.single('uploadedFile')
      if (uploadedFile) {
        formData.append("uploadedFile", uploadedFile);
        console.log("Appending file:", uploadedFile.name);
      }

      // Log FormData contents (for debugging)
      for (let pair of formData.entries()) {
        console.log(
          pair[0] +
            ": " +
            (pair[0] === "uploadedFile" ? pair[1].name : pair[1]),
        );
      }

      const response = await createReport(formData);
      console.log("Success response:", response);

      alert("Gabaasaan galmaa'e");

      // Reset form
      setServices(Array.from({ length: 7 }, () => ({ ...emptyRow })));
      setCoordinatorName("");
      setCoordinatorDate("");
      setSignature("");
      setUploadedFile(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Full error:", error);

      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        alert(`Error: ${error.response.data.message || error.response.status}`);
      } else if (error.request) {
        console.error("No response:", error.request);
        alert("No response from server");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <h2>Formatii Gabaasaa</h2>

      {/* File upload section */}
      <div
        style={{
          margin: "20px 0",
          padding: "20px",
          border: "2px dashed #4CAF50",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 style={{ color: "#4CAF50", marginBottom: "10px" }}>
          📁 Upload Your Excel File (Optional)
        </h3>
        <p style={{ fontSize: "0.9em", color: "#666", marginBottom: "15px" }}>
          Upload an existing Excel file. The system will also generate one
          automatically from your form data.
        </p>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          style={{ padding: "10px" }}
        />
        {uploadedFile && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#e8f5e8",
              borderRadius: "4px",
              color: "#2e7d32",
            }}
          >
            ✅ Selected: {uploadedFile.name} (
            {(uploadedFile.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Lakk</th>
            <th>Sektara</th>
            <th>Tajaajila</th>
            <th>Fooda</th>
            <th>Bayyina</th>
            <th>Hojjeta</th>
            <th>Guyyaa</th>
            <th>Ibsa</th>
          </tr>
        </thead>

        <tbody>
          {services.map((row, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <input
                  value={row.sector}
                  onChange={(e) => handleChange(i, "sector", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={row.service}
                  onChange={(e) => handleChange(i, "service", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={row.resource}
                  onChange={(e) => handleChange(i, "resource", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.peopleServed}
                  onChange={(e) =>
                    handleChange(i, "peopleServed", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={row.employee}
                  onChange={(e) => handleChange(i, "employee", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => handleChange(i, "date", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={row.remark}
                  onChange={(e) => handleChange(i, "remark", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer-fields">
        <div>
          <label>Maqaa Qindeessaa</label>
          <input
            value={coordinatorName}
            onChange={(e) => setCoordinatorName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Guyyaa</label>
          <input
            type="date"
            value={coordinatorDate}
            onChange={(e) => setCoordinatorDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Mallattoo</label>
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
          />
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Gabaasaa Ergi"}
      </button>
    </div>
  );
}