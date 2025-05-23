// src/styles/globalStyles.js

const globalStyles = {
  "@keyframes errorFlashBounce": {
    "0%": {
      transform: "scale(1)",
      boxShadow: "0 0 0px rgba(239, 68, 68, 0.2)",
    },
    "20%": {
      transform: "scale(1.05)",
      boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)",
    },
    "40%": {
      transform: "scale(0.97)",
      boxShadow: "0 0 4px rgba(239, 68, 68, 0.3)",
    },
    "60%": {
      transform: "scale(1.02)",
      boxShadow: "0 0 6px rgba(239, 68, 68, 0.4)",
    },
    "80%": {
      transform: "scale(1)",
      boxShadow: "0 0 2px rgba(239, 68, 68, 0.2)",
    },
    "100%": {
      transform: "none",
      boxShadow: "0 0 0px rgba(239, 68, 68, 0.2)",
    },
  },
  "@keyframes errorIdleGlow": {
    "0%": { boxShadow: "0 0 0px rgba(239, 68, 68, 0.2)" },
    "50%": { boxShadow: "0 0 6px rgba(239, 68, 68, 0.4)" },
    "100%": { boxShadow: "0 0 0px rgba(239, 68, 68, 0.2)" },
  },
  "@keyframes spin": {
    to: { transform: "rotate(360deg)" },
  },
};

export default globalStyles;
