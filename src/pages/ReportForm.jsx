// without quindeessaa name
// import { useState, useRef, useEffect } from "react";
// import SignatureCanvas from "react-signature-canvas";
// import toast from "react-hot-toast";
// import { createReport } from "../api/reportApi";
// import Spinner from "../components/Spinner";
// import mammoth from "mammoth";
// import { ChevronDown } from "lucide-react";
// import axios from "axios"; // Add this import
// import "../styles/report.css";

// const API = "https://hr-report-backend.onrender.com/api"; // Add this constant

// const emptyRow = {
//   sector: "",
//   service: "",
//   resource: "",
//   peopleServed: "",
//   employee: "",
//   date: "",
//   remark: "",
// };

// // 12 Sectors (Seektara) options
// const SECTOR_OPTIONS = [
//   { value: "agriculture", label: "Qonnaa " },
//   { value: "education", label: "Barnoota " },
//   { value: "health", label: "Fayyaa " },
//   { value: "water", label: "Bishaan " },
//   { value: "road", label: "Daandii" },
//   { value: "electricity", label: "Elektirika" },
//   { value: "trade", label: "Daldalaa" },
//   { value: "finance", label: "Faayinaansi" },
//   { value: "youth", label: "Dargaggoota " },
//   { value: "women", label: "Dubartootaa " },
//   { value: "security", label: "Nageenya " },
//   { value: "administration", label: "Bulchiinsa" },
// ];

// export default function ReportForm() {
//   const [services, setServices] = useState(
//     Array.from({ length: 5 }, () => ({ ...emptyRow })),
//   );
//   const [extractedTotal, setExtractedTotal] = useState(null);
//   const [extractedPeopleCounts, setExtractedPeopleCounts] = useState([]);
//   const [coordinatorName, setCoordinatorName] = useState("");
//   const [coordinatorDate, setCoordinatorDate] = useState("");
//   const [signature, setSignature] = useState("");
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [parsingFile, setParsingFile] = useState(false);
//   const [foddaaNumber, setFoddaaNumber] = useState("");
//   const [employees, setEmployees] = useState([]);
//   const sigRef = useRef(null);

//   // Fetch employees on component mount
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         console.log("Fetching employees with token:", token); // Debug log

//         const response = await axios.get(`${API}/employees`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("Employees fetched:", response.data); // Debug log
//         setEmployees(response.data);
//       } catch (error) {
//         console.error("Error fetching employees:", error);
//         toast.error("Failed to load employees");
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // Get user's foddaa from localStorage and extract just the number
//   useEffect(() => {
//     const foddaa = localStorage.getItem("qindeessaa");
//     if (foddaa) {
//       const number = foddaa.replace("foddaa", "");
//       setFoddaaNumber(number);
//     }
//   }, []);

//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (coordinatorName || services[0].sector) {
//         e.preventDefault();
//         e.returnValue = "";
//       }
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, [coordinatorName, services]);

//   const extractBaayyinaValues = async (file) => {
//     setParsingFile(true);
//     try {
//       const arrayBuffer = await file.arrayBuffer();
//       const result = await mammoth.extractRawText({ arrayBuffer });
//       const text = result.value;

//       const baayyinaPattern = /Baayyina[:\s]*(\d+)/gi;
//       const matches = [...text.matchAll(baayyinaPattern)];

//       let extractedNumbers = [];

//       if (matches.length > 0) {
//         extractedNumbers = matches.map((m) => parseInt(m[1], 10));
//       } else {
//         const lines = text.split("\n");

//         for (const line of lines) {
//           const cells = line.split("\t");
//           if (cells.length >= 5) {
//             const possibleNumber = parseInt(cells[4]?.trim(), 10);
//             if (
//               !isNaN(possibleNumber) &&
//               possibleNumber > 0 &&
//               possibleNumber < 1000
//             ) {
//               extractedNumbers.push(possibleNumber);
//             }
//           }
//         }

//         if (extractedNumbers.length === 0) {
//           const allNumbers = text.match(/\b(\d+)\b/g) || [];
//           extractedNumbers = allNumbers
//             .map((num) => parseInt(num, 10))
//             .filter(
//               (num) =>
//                 num > 0 && num < 1000 && num !== new Date().getFullYear(),
//             );
//         }
//       }

//       const total = extractedNumbers.reduce((sum, num) => sum + num, 0);

//       setExtractedPeopleCounts(extractedNumbers);
//       setExtractedTotal(total);

//       if (extractedNumbers.length > 0) {
//         toast.success(
//           `Found ${extractedNumbers.length} entries, total: ${total} people`,
//         );
//       } else {
//         toast.warning("Could not find Baayyina values in the file");
//       }
//     } catch (error) {
//       console.error("Error parsing DOCX:", error);
//       toast.error("Failed to parse the DOCX file");
//       setExtractedTotal(null);
//       setExtractedPeopleCounts([]);
//     } finally {
//       setParsingFile(false);
//     }
//   };

//   const handleChange = (index, field, value) => {
//     const updated = [...services];
//     updated[index][field] = value;
//     const isLastRow = index === services.length - 1;
//     const rowHasData = Object.values(updated[index]).some((v) => v !== "");
//     if (isLastRow && rowHasData) {
//       updated.push({ ...emptyRow });
//     }
//     setServices(updated);
//   };

//   const handleFileChange = async (e) => {
//     if (e.target.files[0]) {
//       const file = e.target.files[0];
//       setUploadedFile(file);
//       await extractBaayyinaValues(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const role = localStorage.getItem("role")?.trim().toLowerCase();
//       const token = localStorage.getItem("token");

//       if (!token) {
//         toast.error("Please login first");
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("coordinatorName", coordinatorName);
//       formData.append("coordinatorDate", coordinatorDate);
//       formData.append("signature", signature);

//       if (uploadedFile) {
//         formData.append("uploadedFile", uploadedFile);

//         if (extractedTotal !== null) {
//           formData.append("extractedTotal", extractedTotal);
//           formData.append(
//             "extractedPeopleCounts",
//             JSON.stringify(extractedPeopleCounts),
//           );
//         }

//         formData.append("services", JSON.stringify([]));
//       } else {
//         const filtered = services.filter((s) =>
//           Object.values(s).some((v) => v !== ""),
//         );
//         if (filtered.length === 0) {
//           toast.error("Maaloo odeeffannoo gabaasaa guutaa!");
//           setLoading(false);
//           return;
//         }

//         const servicesWithFoddaa = filtered.map((service) => ({
//           ...service,
//           foddaa: foddaaNumber,
//         }));

//         formData.append("services", JSON.stringify(servicesWithFoddaa));
//       }

//       await createReport(formData);
//       toast.success("Gabaasni milkaa'inaan ergameera!");

//       setServices(Array.from({ length: 5 }, () => ({ ...emptyRow })));
//       setCoordinatorName("");
//       setCoordinatorDate("");
//       setSignature("");
//       setUploadedFile(null);
//       setExtractedTotal(null);
//       setExtractedPeopleCounts([]);
//       sigRef.current?.clear();
//       const fileInput = document.querySelector('input[type="file"]');
//       if (fileInput) fileInput.value = "";
//     } catch (error) {
//       console.error("Full error:", error);

//       if (error.response?.status === 401) {
//         toast.error("Authentication failed. Please login as Head user.");
//       } else if (error.response?.status === 403) {
//         toast.error("Access denied. Head role required.");
//       } else {
//         toast.error(
//           error.response?.data?.message ||
//             "Dogoggora: Gabaasa erguu hin dandeenye.",
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="report-container">
//       <h2 className="form-title">Formaatii Gabaasaa</h2>

//       <div className="upload-box">
//         <div className="upload-icon">📄</div>
//         <div className="upload-content">
//           <h3>Gabaasa Fayyadamu (DOCX)</h3>
//           <p>Gabaasa Wordi kanaan dura qabdan fayyadamaa</p>
//         </div>
//         <input
//           id="fileUpload"
//           type="file"
//           accept=".docx"
//           onChange={handleFileChange}
//           hidden
//         />
//         <label htmlFor="fileUpload" className="secondary-btn">
//           {uploadedFile ? "Faayila Jijjiri" : "Faayila Filadhu"}
//         </label>
//         {uploadedFile && (
//           <div className="file-info">
//             <span>✅ {uploadedFile.name}</span>
//             {parsingFile && <Spinner size={16} />}
//             {extractedTotal !== null && !parsingFile && (
//               <span className="extracted-badge">
//                 📊 Baay'ina waliigala: <strong>{extractedTotal}</strong>
//                 {extractedPeopleCounts.length > 0 && (
//                   <span className="extracted-detail">
//                     ({extractedPeopleCounts.join(" + ")})
//                   </span>
//                 )}
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Table - Hidden if file is selected */}
//       {!uploadedFile && (
//         <div className="table-wrapper">
//           <table className="report-table">
//             <thead>
//               <tr>
//                 <th style={{ width: "40px" }}>Lakk</th>
//                 <th>Seektara</th>
//                 <th>Tajaajila</th>
//                 <th>Foddaa</th>
//                 <th style={{ width: "80px" }}>Baayyina</th>
//                 <th>Hojjetaa</th>
//                 <th>Guyyaa</th>
//                 <th>Ibsa</th>
//               </tr>
//             </thead>
//             <tbody>
//               {services.map((row, i) => (
//                 <tr key={i}>
//                   <td className="row-number">{i + 1}</td>
//                   <td>
//                     <div className="select-wrapper">
//                       <select
//                         value={row.sector}
//                         onChange={(e) =>
//                           handleChange(i, "sector", e.target.value)
//                         }
//                         className="sector-select"
//                       >
//                         <option value="">Seektara Filadhu</option>
//                         {SECTOR_OPTIONS.map((option) => (
//                           <option key={option.value} value={option.value}>
//                             {option.label}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown className="select-icon" size={16} />
//                     </div>
//                   </td>
//                   <td>
//                     <input
//                       value={row.service}
//                       onChange={(e) =>
//                         handleChange(i, "service", e.target.value)
//                       }
//                       // placeholder="Tajaajila"
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="text"
//                       value={foddaaNumber || "1"}
//                       readOnly
//                       disabled
//                       className="foddaa-field"
//                     />
//                   </td>
//                   <td>
//                     <input
//                       type="number"
//                       value={row.peopleServed}
//                       onChange={(e) =>
//                         handleChange(i, "peopleServed", e.target.value)
//                       }
//                       // placeholder="0"
//                       min="0"
//                     />
//                   </td>
//                   <td>
//                     <div className="select-wrapper">
//                       <select
//                         value={row.employee}
//                         onChange={(e) =>
//                           handleChange(i, "employee", e.target.value)
//                         }
//                         className="employee-select"
//                       >
//                         <option value="">Hojjataa Filadhu</option>
//                         {employees.map((emp) => (
//                           <option key={emp._id} value={emp.name}>
//                             {emp.name}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown className="select-icon" size={16} />
//                     </div>
//                   </td>
//                   <td>
//                     <input
//                       type="date"
//                       value={row.date}
//                       onChange={(e) => handleChange(i, "date", e.target.value)}
//                     />
//                   </td>
//                   <td>
//                     <input
//                       value={row.remark}
//                       onChange={(e) =>
//                         handleChange(i, "remark", e.target.value)
//                       }
//                       // placeholder="Ibsa"
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <div className="footer-fields">
//         <div className="input-group">
//           <label>Maqaa Qindeessaa</label>
//           <input
//             value={coordinatorName}
//             onChange={(e) => setCoordinatorName(e.target.value)}
//             required
//             // placeholder="Maqaa guutaa"
//           />
//         </div>
//         <div className="input-group">
//           <label>Guyyaa</label>
//           <input
//             type="date"
//             value={coordinatorDate}
//             onChange={(e) => setCoordinatorDate(e.target.value)}
//             required
//           />
//         </div>
//         <div className="input-group signature-group">
//           <label>Mallattoo</label>
//           <div className="signature-box">
//             <SignatureCanvas
//               ref={sigRef}
//               penColor="black"
//               canvasProps={{ className: "sigCanvas" }}
//               onEnd={() => setSignature(sigRef.current.toDataURL("image/png"))}
//             />
//             <button
//               type="button"
//               className="clear-btn"
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

//       <button
//         type="submit"
//         className="submit-btn"
//         disabled={loading || parsingFile}
//       >
//         {loading ? <Spinner size={18} /> : "Gabaasa Ergi"}
//       </button>
//     </form>
//   );
// }

import { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import toast from "react-hot-toast";
import { createReport } from "../api/reportApi";
import Spinner from "../components/Spinner";
import mammoth from "mammoth";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import "../styles/report.css";

const API = "https://hr-report-backend.onrender.com/api";

// Updated emptyRow - removed resource field
const emptyRow = {
  sector: "",
  service: "",
  peopleServed: "",
  employee: "",
  date: "",
  remark: "",
};

// 12 Sectors (Seektara) options
const SECTOR_OPTIONS = [
  { value: "agriculture", label: "Qonnaa" },
  { value: "education", label: "Barnoota" },
  { value: "health", label: "Fayyaa" },
  { value: "water", label: "Bishaan" },
  { value: "road", label: "Daandii" },
  { value: "electricity", label: "Elektirika" },
  { value: "trade", label: "Daldalaa" },
  { value: "finance", label: "Faayinaansi" },
  { value: "youth", label: "Dargaggoota" },
  { value: "women", label: "Dubartootaa" },
  { value: "security", label: "Nageenya" },
  { value: "administration", label: "Bulchiinsa" },
];

export default function ReportForm() {
  const [services, setServices] = useState(
    Array.from({ length: 5 }, () => ({ ...emptyRow })),
  );
  const [extractedTotal, setExtractedTotal] = useState(null);
  const [extractedPeopleCounts, setExtractedPeopleCounts] = useState([]);
  const [coordinatorName, setCoordinatorName] = useState("");
  const [coordinatorDate, setCoordinatorDate] = useState("");
  const [signature, setSignature] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parsingFile, setParsingFile] = useState(false);
  const [foddaaNumber, setFoddaaNumber] = useState("");
  const [employees, setEmployees] = useState([]);
  const sigRef = useRef(null);
  
  // Auto-fill coordinator name with head's name from localStorage
  useEffect(() => {
    const headName = localStorage.getItem("name");
    if (headName) {
      setCoordinatorName(headName);
    }
  }, []);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API}/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees");
      }
    };

    fetchEmployees();
  }, []);

  // Get user's foddaa from localStorage and extract just the number
  useEffect(() => {
    const foddaa = localStorage.getItem("qindeessaa");
    if (foddaa) {
      const number = foddaa.replace("foddaa", "");
      setFoddaaNumber(number);
    }
  }, []);

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

  const extractBaayyinaValues = async (file) => {
    setParsingFile(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      const baayyinaPattern = /Baayyina[:\s]*(\d+)/gi;
      const matches = [...text.matchAll(baayyinaPattern)];

      let extractedNumbers = [];

      if (matches.length > 0) {
        extractedNumbers = matches.map((m) => parseInt(m[1], 10));
      } else {
        const lines = text.split("\n");

        for (const line of lines) {
          const cells = line.split("\t");
          if (cells.length >= 5) {
            const possibleNumber = parseInt(cells[4]?.trim(), 10);
            if (
              !isNaN(possibleNumber) &&
              possibleNumber > 0 &&
              possibleNumber < 1000
            ) {
              extractedNumbers.push(possibleNumber);
            }
          }
        }

        if (extractedNumbers.length === 0) {
          const allNumbers = text.match(/\b(\d+)\b/g) || [];
          extractedNumbers = allNumbers
            .map((num) => parseInt(num, 10))
            .filter(
              (num) =>
                num > 0 && num < 1000 && num !== new Date().getFullYear(),
            );
        }
      }

      const total = extractedNumbers.reduce((sum, num) => sum + num, 0);

      setExtractedPeopleCounts(extractedNumbers);
      setExtractedTotal(total);

      if (extractedNumbers.length > 0) {
        toast.success(
          `Found ${extractedNumbers.length} entries, total: ${total} people`,
        );
      } else {
        toast.warning("Could not find Baayyina values in the file");
      }
    } catch (error) {
      console.error("Error parsing DOCX:", error);
      toast.error("Failed to parse the DOCX file");
      setExtractedTotal(null);
      setExtractedPeopleCounts([]);
    } finally {
      setParsingFile(false);
    }
  };

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

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      await extractBaayyinaValues(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const role = localStorage.getItem("role")?.trim().toLowerCase();
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("coordinatorName", coordinatorName);
      formData.append("coordinatorDate", coordinatorDate);
      formData.append("signature", signature);

      if (uploadedFile) {
        formData.append("uploadedFile", uploadedFile);

        if (extractedTotal !== null) {
          formData.append("extractedTotal", extractedTotal);
          formData.append(
            "extractedPeopleCounts",
            JSON.stringify(extractedPeopleCounts),
          );
        }

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

        const servicesForDocx = filtered.map((service) => ({
          sector: service.sector,
          service: service.service,
          // resource: String(
          //   foddaaNumber || localStorage.getItem("qindeessaa") || "1",
          // ),
          resource: foddaaNumber || "1",
          peopleServed: service.peopleServed,
          employee: service.employee,
          date: service.date,
          remark: service.remark,
        }));

        console.log("Sending to backend:", servicesForDocx); // Debug

        formData.append("services", JSON.stringify(servicesForDocx));
      }

      await createReport(formData);
      toast.success("Gabaasni milkaa'inaan ergameera!");

      // Reset form
      setServices(Array.from({ length: 5 }, () => ({ ...emptyRow })));
      setCoordinatorName(localStorage.getItem("name") || "");
      setCoordinatorDate("");
      setSignature("");
      setUploadedFile(null);
      setExtractedTotal(null);
      setExtractedPeopleCounts([]);
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
          <div className="file-info">
            <span>✅ {uploadedFile.name}</span>
            {parsingFile && <Spinner size={16} />}
            {extractedTotal !== null && !parsingFile && (
              <span className="extracted-badge">
                📊 Baay'ina waliigala: <strong>{extractedTotal}</strong>
                {extractedPeopleCounts.length > 0 && (
                  <span className="extracted-detail">
                    ({extractedPeopleCounts.join(" + ")})
                  </span>
                )}
              </span>
            )}
          </div>
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

                  {/* Seektara - Select */}
                  <td>
                    <div className="select-wrapper">
                      <select
                        value={row.sector}
                        onChange={(e) =>
                          handleChange(i, "sector", e.target.value)
                        }
                        className="sector-select"
                      >
                        <option value="">Seektara Filadhu</option>
                        {SECTOR_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="select-icon" size={16} />
                    </div>
                  </td>

                  {/* Tajaajila - Input */}
                  <td>
                    <input
                      value={row.service}
                      onChange={(e) =>
                        handleChange(i, "service", e.target.value)
                      }
                      // placeholder="Tajaajila"
                    />
                  </td>

                  {/* Foddaa - Display only (auto-filled) */}
                  <td>
                    <div className="foddaa-display">{foddaaNumber || "1"}</div>
                  </td>

                  {/* Baayyina - Input */}
                  <td>
                    <input
                      type="number"
                      value={row.peopleServed}
                      onChange={(e) =>
                        handleChange(i, "peopleServed", e.target.value)
                      }
                      // placeholder="0"
                      min="0"
                    />
                  </td>

                  {/* Hojjetaa - Select */}
                  <td>
                    <div className="select-wrapper">
                      <select
                        value={row.employee}
                        onChange={(e) =>
                          handleChange(i, "employee", e.target.value)
                        }
                        className="employee-select"
                      >
                        <option value="">Hojjataa Filadhu</option>
                        {employees.map((emp) => (
                          <option key={emp._id} value={emp.name}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="select-icon" size={16} />
                    </div>
                  </td>

                  {/* Guyyaa - Input */}
                  <td>
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => handleChange(i, "date", e.target.value)}
                    />
                  </td>

                  {/* Ibsa - Input */}
                  <td>
                    <input
                      value={row.remark}
                      onChange={(e) =>
                        handleChange(i, "remark", e.target.value)
                      }
                      // placeholder="Ibsa"
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
            // placeholder="Maqaa guutaa"
            className="coordinator-field"
          />
          <small className="field-hint">Auto-filled with your name</small>
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

      <button
        type="submit"
        className="submit-btn"
        disabled={loading || parsingFile}
      >
        {loading ? <Spinner size={18} /> : "Gabaasa Ergi"}
      </button>
    </form>
  );
}
