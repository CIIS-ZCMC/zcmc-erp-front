import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@Components": path.resolve(__dirname, "./src/Components"),
      "@Hooks": path.resolve(__dirname, "src/Hooks"),
      "@Utils": path.resolve(__dirname, "src/Utils"),
      "@Data": path.resolve(__dirname, "src/Data"),
      "@Store": path.resolve(__dirname, "src/Store"),
      "@Pages": path.resolve(__dirname, "src/Pages"),
      "@Services": path.resolve(__dirname, "src/Services"),
    },
  },
  // server: {
  //   host: "192.168.36.163", // alyans
  //   port: 5173,
  // },
});
