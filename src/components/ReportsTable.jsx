export default function ReportsTable({ reports }) {
  const base = "https://hr-report-backend.onrender.com/files/";

  return (
    <table className="reports-table">
      <thead>
        <tr>
          <th>Qindeessaa</th>
          <th>Guyyaa</th>
          <th>Tajaajila</th>
          <th>Download</th>
        </tr>
      </thead>

      <tbody>
        {reports.map((r) => {
          const file = r.xlsxFile?.split("uploads/")[1];

          return (
            <tr key={r._id}>
              <td>{r.coordinatorName}</td>
              <td>{new Date(r.coordinatorDate).toLocaleDateString()}</td>
              <td>{r.services.length}</td>

              <td>
                <a href={`${base}${file}`} target="_blank" rel="noreferrer">
                  XLSX
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
