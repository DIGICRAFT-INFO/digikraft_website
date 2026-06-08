import axios from "axios";

const API = axios.create({
  baseURL: "https://aqua-pigeon-679923.hostingersite.com/api",
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