import axios from "axios";
import { Store }from "../../store/store";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // required for refresh-token cookie
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config)=>{
  const token = Store.getState().adminAuth.accessToken;
  if(token)config.headers.Authorization = `Bearer ${token}`;
  return config
})

export default api;
