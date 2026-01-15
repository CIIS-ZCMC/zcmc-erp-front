import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@Components": path.resolve(__dirname, "./src/Components"),
    },
  },
  // server: {
  //   host: "192.168.36.163", // alyans
  //   port: 5173,
  // },
});
