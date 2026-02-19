export default function StatsCards({ stats }) {
  return (
    <div className="stats">
      <div className="card">
        <h4>Har'a</h4>
        <p>{stats.today || 0}</p>
      </div>

      <div className="card">
        <h4>Ji'a kana</h4>
        <p>{stats.month || 0}</p>
      </div>

      <div className="card">
        <h4>Waliigala</h4>
        <p>{stats.total || 0}</p>
      </div>
    </div>
  );
}
