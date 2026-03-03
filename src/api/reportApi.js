import API from "./axios";

export const createReport = (data) => {

  return API.post("/reports", data);
};

export const getReports = () => API.get("/reports");
export const getStats = () => API.get("/reports/stats");

