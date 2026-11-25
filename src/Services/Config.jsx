/**
 * URLs of different site
 * landing_page site where user sign in




 * When building the site update all files that use development
 * use the production_landing_page for signing page
 * use the production for your system url
 */

export const SSO_SIGNING_PATH = "signing-in";
export const ROOT_PATH = "/dashboard";

const currentHost =
  typeof window !== "undefined" && window.location?.hostname
    ? window.location.hostname
    : "192.168.36.162";

export const BASE_URL = {
  development_landing_page: "http://192.168.9.243:8011/", // This will be the landing page
  production_landing_page: "https://zcmc.online", // This will be the production landing page url
  production: "https://api_name.zcmc.online/api/", // Change the sub domain name to your prefer name
  development: `http://${currentHost}:8000/api`, // Dynamically uses LAN IP when accessed from another PC
  socket_development: `http://${currentHost}:3025/`,
  test_landing_page: `http://${currentHost}:5173/`,
  umis_landing_page: `http://${currentHost}:8001/`,
};

export const TEST_MODE = false;
