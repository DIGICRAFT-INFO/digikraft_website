import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend.digikraftsocial.com";

const API = axios.create({
  baseURL: `${BASE}/api`,
});

// Token Automatically Add
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;