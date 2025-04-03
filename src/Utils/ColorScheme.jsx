export const getModeColorScheme = (type) => {
  const colorSchemes = {
    success: {
      colorScheme: "success",
      color: "success.100",
      iconColor: "green",
    },
    warning: {
      colorScheme: "warning",
      color: "warning.100",
      iconColor: "orange",
    },
    danger: { colorScheme: "danger", color: "danger.100", iconColor: "red" },
  };

  const statusMap = {
    200: "success",
    201: "success",
    success: "success",
    199: "warning",
    warning: "warning",
    400: "danger",
    error: "danger",
  };

  return colorSchemes[statusMap[type] || "danger"];
};

// STATUS

export const getStatusColorScheme = (status) => {
  const colorMap = {
    approved: "success",
    pending: "success",
    cancelled: "error",
    returned: "warning",
  };
  return colorMap[status] || "neutral"; // Ensure it returns a string
};
