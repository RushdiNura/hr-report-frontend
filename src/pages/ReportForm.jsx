import { useState,useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import toast from "react-hot-toast";
import { createReport } from "../api/reportApi"; 
import Spinner from "../components/Spinner";
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
    Array.from({ length: 5 }, () => ({ ...emptyRow })),
  );

  const [coordinatorName, setCoordinatorName] = useState("");
  const [coordinatorDate, setCoordinatorDate] = useState("");
  const [signature, setSignature] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const sigRef = useRef(null);

 
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (coordinatorName || services[0].sector) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [coordinatorName, services]);

  const handleChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    const isLastRow = index === services.length - 1;
    const rowHasData = Object.values(updated[index]).some((v) => v !== "");
    if (isLastRow && rowHasData) {
      updated.push({ ...emptyRow });
    }
    setServices(updated);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      if (role !== "head") {
        toast.error(
          "Only Head users can submit reports. You are logged in as: " + role,
        );
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("coordinatorName", coordinatorName);
      formData.append("coordinatorDate", coordinatorDate);
      formData.append("signature", signature);

      if (uploadedFile) {
        formData.append("uploadedFile", uploadedFile);
        formData.append("services", JSON.stringify([]));
      } else {
        const filtered = services.filter((s) =>
          Object.values(s).some((v) => v !== ""),
        );
        if (filtered.length === 0) {
          toast.error("Maaloo odeeffannoo gabaasaa guutaa!");
          setLoading(false);
          return;
        }
        formData.append("services", JSON.stringify(filtered));
      }

      await createReport(formData);
      toast.success("Gabaasni milkaa'inaan ergameera!");

      // Reset form
      setServices(Array.from({ length: 5 }, () => ({ ...emptyRow })));
      setCoordinatorName("");
      setCoordinatorDate("");
      setSignature("");
      setUploadedFile(null);
      sigRef.current?.clear();
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Full error:", error);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login as Head user.");
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Head role required.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Dogoggora: Gabaasa erguu hin dandeenye.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="report-container">
      <h2 className="form-title">Formaatii Gabaasaa</h2>

      <div className="upload-box">
        <div className="upload-icon">📄</div>
        <div className="upload-content">
          <h3>Gabaasa Fayyadamu (DOCX)</h3>
          <p>Gabaasa Wordi kanaan dura qabdan fayyadamaa</p>
        </div>
        <input
          id="fileUpload"
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          hidden
        />
        <label htmlFor="fileUpload" className="secondary-btn">
          {uploadedFile ? "Faayila Jijjiri" : "Faayila Filadhu"}
        </label>
        {uploadedFile && (
          <div className="file-info">✅ {uploadedFile.name}</div>
        )}
      </div>

      {/* Table - Hidden if file is selected */}
      {!uploadedFile && (
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>Lakk</th>
                <th>Seektara</th>
                <th>Tajaajila</th>
                <th>Foddaa</th>
                <th style={{ width: "80px" }}>Baayyina</th>
                <th>Hojjetaa</th>
                <th>Guyyaa</th>
                <th>Ibsa</th>
              </tr>
            </thead>
            <tbody>
              {services.map((row, i) => (
                <tr key={i}>
                  <td className="row-number">{i + 1}</td>
                  <td>
                    <input
                      value={row.sector}
                      onChange={(e) =>
                        handleChange(i, "sector", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={row.service}
                      onChange={(e) =>
                        handleChange(i, "service", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={row.resource}
                      onChange={(e) =>
                        handleChange(i, "resource", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleChange(i, "employee", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleChange(i, "remark", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="footer-fields">
        <div className="input-group">
          <label>Maqaa Qindeessaa</label>
          <input
            value={coordinatorName}
            onChange={(e) => setCoordinatorName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Guyyaa</label>
          <input
            type="date"
            value={coordinatorDate}
            onChange={(e) => setCoordinatorDate(e.target.value)}
            required
          />
        </div>
        <div className="input-group signature-group">
          <label>Mallattoo</label>
          <div className="signature-box">
            <SignatureCanvas
              ref={sigRef}
              penColor="black"
              canvasProps={{ className: "sigCanvas" }}
              onEnd={() => setSignature(sigRef.current.toDataURL("image/png"))}
            />
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                sigRef.current.clear();
                setSignature("");
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? <Spinner size={18} /> : "Gabaasa Ergi"}
      </button>
    </form>
  );
}

// import { useState } from "react";
// import SignatureCanvas from "react-signature-canvas";
// import { useRef } from "react";
// import toast from "react-hot-toast";
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
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const sigRef = useRef(null);

//   // const handleChange = (index, field, value) => {
//   //   const updated = [...services];
//   //   updated[index][field] = value;
//   //   setServices(updated);
//   // };

//   const handleChange = (index, field, value) => {
//     const updated = [...services];
//     updated[index][field] = value;

//     // If user is editing the LAST row and it now has content → add new row
//     const isLastRow = index === services.length - 1;
//     const rowHasData =
//       updated[index].sector ||
//       updated[index].service ||
//       updated[index].resource ||
//       updated[index].peopleServed ||
//       updated[index].employee ||
//       updated[index].date ||
//       updated[index].remark;

//     if (isLastRow && rowHasData) {
//       updated.push({ ...emptyRow });
//     }

//     setServices(updated);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files[0]) {
//       setUploadedFile(e.target.files[0]);
//       console.log("File selected:", e.target.files[0].name);
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     try {
//       // const filtered = services.filter(
//       //   (s) => s.sector || s.service || s.employee,
//       // );

//       const filtered = services.filter(
//         (s) =>
//           s.sector ||
//           s.service ||
//           s.resource ||
//           s.peopleServed ||
//           s.employee ||
//           s.date ||
//           s.remark,
//       );

//       // Log the data before sending
//       console.log("Submitting with data:", {
//         coordinatorName,
//         coordinatorDate,
//         signature,
//         servicesCount: filtered.length,
//         hasFile: !!uploadedFile,
//         fileName: uploadedFile?.name,
//       });

//       // Create FormData
//       const formData = new FormData();

//       // IMPORTANT: These field names must match what backend expects
//       formData.append("coordinatorName", coordinatorName);
//       formData.append("coordinatorDate", coordinatorDate);
//       formData.append("signature", signature);
//       formData.append("services", JSON.stringify(filtered));

//       // IMPORTANT: This field name must match the one in multer upload.single()
//       // In your route, you have upload.single('uploadedFile')
//       if (uploadedFile) {
//         formData.append("uploadedFile", uploadedFile);
//         console.log("Appending file:", uploadedFile.name);
//       }

//       // Log FormData contents (for debugging)
//       for (let pair of formData.entries()) {
//         console.log(
//           pair[0] +
//             ": " +
//             (pair[0] === "uploadedFile" ? pair[1].name : pair[1]),
//         );
//       }

//       const response = await createReport(formData);
//       console.log("Success response:", response);

//       toast.success("Gabaasni ergameera!");

//       // Reset form
//       setServices(Array.from({ length: 7 }, () => ({ ...emptyRow })));
//       setCoordinatorName("");
//       setCoordinatorDate("");
//       setSignature("");
//       setUploadedFile(null);

//       // Reset file input
//       const fileInput = document.querySelector('input[type="file"]');
//       if (fileInput) fileInput.value = "";
//     } catch (error) {
//       console.error("Full error:", error);

//       if (error.response) {
//         console.error("Error data:", error.response.data);
//         console.error("Error status:", error.response.status);
//         toast.error(
//           `Error: ${error.response?.data?.message || error.response?.status}`,
//         );
//       } else if (error.request) {
//         console.error("No response:", error.request);
//         toast.error("No response from server");
//       } else {
//         toast.error(`Error: ${error.message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="report-container">
//       <h2>Formaatii Gabaasaa</h2>

//       {/* File upload section */}
//       <div className="upload-box">
//         {/* <div
//         style={{
//           margin: "20px 0",
//           padding: "20px",
//           border: "2px dashed #4CAF50",
//           borderRadius: "8px",
//           backgroundColor: "#f9f9f9",
//         }}
//       > */}
//         <h3 style={{ color: "#4CAF50", marginBottom: "10px" }}>
//           📄 Upload Word Report
//         </h3>
//         <p style={{ fontSize: "0.9em", color: "#666", marginBottom: "15px" }}>
//           Upload an existing Word (.docx) report or generate one automatically.
//         </p>
//         {/* <input
//           type="file"
//           accept=".docx"
//           onChange={handleFileChange}
//           style={{ padding: "10px" }}
//         /> */}

//         <input
//           id="fileUpload"
//           type="file"
//           accept=".docx"
//           onChange={handleFileChange}
//           hidden
//         />

//         <label htmlFor="fileUpload" className="primary-btn">
//           Upload DOCX
//         </label>

//         {/*
//         <h3 style={{ color: "#4CAF50", marginBottom: "10px" }}>
//           📁 Upload Your Excel File (Optional)
//         </h3>
//         <p style={{ fontSize: "0.9em", color: "#666", marginBottom: "15px" }}>
//           Upload an existing Excel file. The system will also generate one
//           automatically from your form data.
//         </p>
//       <input
//           type="file"
//           accept=".xlsx,.xls,.csv"
//           onChange={handleFileChange}
//           style={{ padding: "10px" }}
//         /> */}
//         {uploadedFile && (
//           <div
//             style={{
//               marginTop: "15px",
//               padding: "10px",
//               backgroundColor: "#e8f5e8",
//               borderRadius: "4px",
//               color: "#2e7d32",
//             }}
//           >
//             ✅ Selected: {uploadedFile.name} (
//             {(uploadedFile.size / 1024).toFixed(2)} KB)
//           </div>
//         )}
//       </div>

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
//             required
//           />
//         </div>

//         <div>
//           <label>Guyyaa</label>
//           <input
//             type="date"
//             value={coordinatorDate}
//             onChange={(e) => setCoordinatorDate(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>Mallattoo </label>

//           <div
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: "6px",
//               padding: "10px",
//               background: "#fff",
//               // width: "260px",
//               width: "100%",
//               maxWidth: "260px",
//             }}
//           >
//             <SignatureCanvas
//               ref={sigRef}
//               penColor="black"
//               canvasProps={{
//                 width: 240,
//                 height: 120,
//                 className: "sigCanvas",
//               }}
//               onEnd={() => {
//                 const dataURL = sigRef.current.toDataURL("image/png");
//                 setSignature(dataURL); // store base64 image
//               }}
//             />

//             {/* <button
//               type="button"
//               onClick={() => {
//                 sigRef.current.clear();
//                 setSignature("");
//               }}
//               style={{
//                 marginTop: "8px",
//                 padding: "4px 10px",
//                 fontSize: "12px",
//                 cursor: "pointer",
//               }}
//             >
//               Clear
//             </button> */}

//             <button
//               type="button"
//               className="primary-btn"
//               onClick={() => {
//                 sigRef.current.clear();
//                 setSignature("");
//               }}
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>

//       <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
//         {loading ? <Spinner size={18} /> : "Gabaasa Ergi"}
//       </button>
//     </div>
//   );
// }
