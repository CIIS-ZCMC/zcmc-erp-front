export const getModeColorScheme = (type) => {
  let colorScheme = "";
  let color = "";
  let iconColor = "";

  // Success
  if (type === 200 || type === 201 || type === "success") {
    colorScheme = "success";
    color = "success.100";
    iconColor = "green";
  }
  // Warning
  else if (type === 199 || type === "warning") {
    colorScheme = "warning";
    color = "warning.100";
    iconColor = "orange";
  }
  // Error
  else if (type === 400 || type === "error") {
    colorScheme = "error";
    color = "error.100";
    iconColor = "error";
  }
  // Default error for unknown cases
  else {
    colorScheme = "error";
    color = "error.100";
    iconColor = "error";
  }

  return { colorScheme, color, iconColor };
};

// STATUS
export const getStatusColorScheme = (type) => {
  let color = "";

  switch (type) {
    case "pending":
      color = "neutral";
      break;
    case "received":
      color = "success";
      break;
    case "returned":
      color = "warning";
      break;
    case "cancelled":
      color = "danger";
      break;
    case "completed":
      color = "primary";
      break;
  }

  return color;
};
