// export default function StatsCards({ stats }) {
//   return (
//     <div className="stats-row">
//       <div className="stat-card">
//         <div className="stat-label">Today</div>
//         <div className="stat-value">{stats.today || 0}</div>
//       </div>

//       <div className="stat-card">
//         <div className="stat-label">This Month</div>
//         <div className="stat-value">{stats.month || 0}</div>
//       </div>

//       <div className="stat-card">
//         <div className="stat-label">Total Reports</div>
//         <div className="stat-value">{stats.total || 0}</div>
//       </div>
//     </div>
//   );
// }

// import { motion } from "framer-motion";
// import { TrendingUp, Calendar, FileText } from "lucide-react";

// export default function StatsCards({ stats }) {
//   const cards = [
//     {
//       label: "Today's Reports",
//       value: stats.today || 0,
//       // icon: Calendar,
//       // trend: "+12%",
//       color: "#3b82f6",
//     },
//     {
//       label: "Monthly Reports",
//       value: stats.month || 0,
//       // icon: TrendingUp,
//       // trend: "+8%",
//       color: "#10b981",
//     },
//     {
//       label: "Total Reports",
//       value: stats.total || 0,
//       // icon: FileText,
//       // trend: "+25%",
//       color: "#8b5cf6",
//     },
//   ];

//   return (
//     <div className="stats-row">
//       {cards.map((card, index) => {
//         const Icon = card.icon;

//         return (
//           <motion.div
//             key={index}
//             className="stat-card"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             whileHover={{ scale: 1.02 }}
//           >
//             {/* <div
//               className="stat-icon-wrapper"
//               style={{ background: `${card.color}15` }}
//             > */}
//               {/* <Icon size={24} color={card.color} /> */}
//             {/* </div> */}

//             <div className="stat-content">
//               <div className="stat-label">{card.label}</div>
//               <div className="stat-value">{card.value.toLocaleString()}</div>
//               {/* <div className="stat-trend"> */}
//                 {/* <TrendingUp size={14} /> */}
//                 {/* <span>{card.trend}</span> */}
//               {/* </div> */}
//             </div>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// }

import { Calendar, Layers, FileCheck } from "lucide-react";

export default function StatsCards({ stats }) {
  const data = [
    {
      label: "Reports Today",
      value: stats.today || 0,
      icon: Calendar,
      color: "#3b82f6",
    },
    {
      label: "This Month",
      value: stats.month || 0,
      icon: Layers,
      color: "#8b5cf6",
    },
    {
      label: "Lifetime Total",
      value: stats.total || 0,
      icon: FileCheck,
      color: "#10b981",
    },
  ];

  return (
    <div className="stats-grid">
      {data.map((item, i) => (
        <div className="stat-card-new" key={i}>
          <div
            className="stat-icon"
            style={{ background: item.color + "15", color: item.color }}
          >
            <item.icon size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label-new">{item.label}</span>
            <span className="stat-value-new">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}