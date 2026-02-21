// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://hr-report-backend.onrender.com/api",
// });

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) req.headers.Authorization = `Bearer ${token}`;
//   return req;
// });

// export default API;

// axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://hr-report-backend.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  // IMPORTANT: Don't set Content-Type for FormData
  // Let the browser set it automatically with the correct boundary
  if (req.data instanceof FormData) {
    delete req.headers["Content-Type"];
  } else {
    // For JSON data, set content type
    req.headers["Content-Type"] = "application/json";
  }

  console.log("Request:", {
    url: req.url,
    method: req.method,
    headers: req.headers,
    data: req.data instanceof FormData ? "FormData" : req.data,
  });

  return req;
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("403 Forbidden - Check user role and token");
      // Maybe redirect to login if token expired
      if (error.response.data?.message === "Forbidden") {
        localStorage.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default API;