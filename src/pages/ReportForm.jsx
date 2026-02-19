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

  const handleChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleSubmit = async () => {
    const filtered = services.filter(
      (s) => s.sector || s.service || s.employee,
    );

    await createReport({
      coordinatorName,
      coordinatorDate,
      signature,
      services: filtered,
    });

    alert("Gabaasaan galmaa'e");
  };

  return (
    <div className="report-container">
      <h2>Formatii Gabaasaa</h2>

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
          />
        </div>

        <div>
          <label>Guyyaa</label>
          <input
            type="date"
            value={coordinatorDate}
            onChange={(e) => setCoordinatorDate(e.target.value)}
          />
        </div>

        <div>
          <label>Mallattoo</label>
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Gabaasaa Ergi
      </button>
    </div>
  );
}
