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
    info: "warning",
  };

  return colorSchemes[statusMap[type] || "danger"];
};

// STATUS
export const getStatusColorScheme = (status) => {
  if (!status) return "neutral";

  const normalizedStatus = status.toString().toLowerCase().trim();

  const colorMap = {
    approved: "success",
    "fully approved": "success",
    received: "success",
    submitted: "success",
    pending: "warning",
    cancelled: "danger",
    denied: "danger",
    returned: "danger",
    "awaiting your review": "primary",
    "awaiting review": "primary",
    awaiting_review: "primary",
  };

  return colorMap[normalizedStatus] || "neutral"; // Ensure it returns a string
};

// FULL AOP CARD COLOR SCHEME
export const getAOPCardColorScheme = (status) => {
  if (!status) {
    return {
      joyColor: "warning",
      statusColor: "#E69900",
      bgcolor: "#FFF0C2",
      avatarBg: "#FFE082",
      iconColor: "#B36B00",
      labelColor: "#B36B00",
      titleColor: "#995900",
      textColor: "#A65D00",
      defaultDescription: "Request is pending approval.",
    };
  }

  const s = status.toString().toLowerCase().trim();

  if (s.includes("returned")) {
    return {
      joyColor: "danger",
      statusColor: "#C62828",
      bgcolor: "#FCDCDD",
      avatarBg: "#F7C5C7",
      iconColor: "#990000",
      labelColor: "#A81B1E",
      titleColor: "#8B0000",
      textColor: "#9E2A2B",
      defaultDescription:
        "This request was returned for revision. The submitting department will address the feedback and resubmit.",
    };
  }

  if (s.includes("approved")) {
    return {
      joyColor: "success",
      statusColor: "#2E7D32",
      bgcolor: "#D7F7D8",
      avatarBg: "#BCEBBF",
      iconColor: "#1E6B22",
      labelColor: "#1E6B22",
      titleColor: "#145217",
      textColor: "#1E6B22",
      defaultDescription: "All approval steps completed",
    };
  }

  if (s.includes("awaiting")) {
    return {
      joyColor: "primary",
      statusColor: "#0077C8",
      bgcolor: "#D6F0FF",
      avatarBg: "#BCE5FF",
      iconColor: "#005596",
      labelColor: "#0066B2",
      titleColor: "#00487A",
      textColor: "#005596",
      defaultDescription:
        "This request is currently at your approval stage. Verify alignment with institutional priorities. Approve or return with remarks if revisions are needed.",
    };
  }

  // Pending (Amber/Yellow)
  return {
    joyColor: "warning",
    statusColor: "#E69900",
    bgcolor: "#FFF0C2",
    avatarBg: "#FFE082",
    iconColor: "#B36B00",
    labelColor: "#B36B00",
    titleColor: "#995900",
    textColor: "#A65D00",
    defaultDescription: "Request is pending approval.",
  };
};

// STATUS
export const getAlertColor = (statusCode) => {
  let color = "";

  switch (statusCode) {
    case 201:
      color = "success";
      break;
    case 200:
      color = "success";
      break;
    case 400:
      color = "danger";
      break;
    case 401:
      color = "danger";
      break;

    case 500:
      color = "danger";
      break;
    default:
      color = "primary";
      break;
  }

  return color;
};
