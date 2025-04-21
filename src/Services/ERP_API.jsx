import axios from "axios";

const BASE_URL = {
  development_landing_page: "http://192.168.5.1:5170", // This will be the landing page
  production_landing_page: "https://zcmc.online", // This will be the production landing page url
  production: "https://api_name.zcmc.online/api/", // Change the sub domain name to your prefer name
  development: "http://192.168.36.161:8000/api", // You can change the port or ip here
  local: "http://localhost:8000/api",
};

const erp_api = new axios.create({
  baseURL: BASE_URL.local,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "content-type": "application/json",
  },
});

export default erp_api;
