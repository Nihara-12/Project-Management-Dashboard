import axios from "axios";

const API = axios.create({
  baseURL: "https://project-management-dashboard-fod3.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});

export default API;