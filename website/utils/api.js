import axios from "axios";

const API = axios.create({
  baseURL: "https://backend.digikraftsocial.com/api",
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