// import API from "./axios";

// export const createReport = (data) => API.post("/reports", data);

// export const getReports = () => API.get("/reports");

// export const getStats = () => API.get("/reports/stats");

import API from "./axios";

export const createReport = (data) => {
  // For FormData, don't set any headers - let axios and browser handle it
  return API.post("/reports", data);
};

export const getReports = () => API.get("/reports");
export const getStats = () => API.get("/reports/stats");