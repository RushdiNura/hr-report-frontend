// export default function Spinner({ size = 28 }) {
//   return (
//     <div
//       style={{
//         width: size,
//         height: size,
//         border: "3px solid #e5e7eb",
//         borderTop: "3px solid #2563eb",
//         borderRadius: "50%",
//         animation: "spin 0.8s linear infinite",
//       }}
//     />
//   );
// }

import { motion } from "framer-motion";
import "../styles/spinner.css";

// export default function Spinner({ size = 24, color = "#3b82f6" }) {
//   return (
//     <motion.div
//       className="spinner"
//       style={{
//         width: size,
//         height: size,
//         borderColor: `${color}20`,
//         borderTopColor: color,
//       }}
//       animate={{ rotate: 360 }}
//       transition={{
//         duration: 1,
//         repeat: Infinity,
//         ease: "linear",
//       }}
//     />
//   );
// }

export default function Spinner() {
  return (
    <div className="orbit-spinner-container">
      <div className="orbit-spinner">
        <div className="orbit"></div>
        <div className="orbit"></div>
        <div className="orbit"></div>
      </div>
      <p className="loading-text">Synchronizing Data...</p>
    </div>
  );
}