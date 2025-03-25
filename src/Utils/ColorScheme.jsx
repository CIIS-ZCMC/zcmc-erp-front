export const getModeColorScheme = (type) => {
  let color = "";

  switch (type) {
    case "competitive":
      color = "success";
      break;
    case "alternative":
      color = "primary";
      break;
  }

  return color;
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
