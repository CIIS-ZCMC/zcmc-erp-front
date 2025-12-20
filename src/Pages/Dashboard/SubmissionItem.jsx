import { statusConfig, SUBMISSION_STATUS } from "../../Data/TestData";
import { Box, Stack, Typography } from "@mui/joy";
import { AlertTriangle, Pencil } from "lucide-react";

const StatusIcon = ({ status }) => {
  if (status === SUBMISSION_STATUS.NOT_STARTED) {
    return <AlertTriangle size={18} />;
  }
  return <Pencil size={18} />;
};

const SubmissionItem = ({ department, status }) => {
  const config = statusConfig[status];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 1.2,
        borderRadius: "8px",
        backgroundColor: config.bg,
        borderLeft: `4px solid ${config.border}`,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: config.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusIcon status={status} />
      </Box>

      <Stack spacing={0}>
        <Typography level="body-sm" fontWeight={600}>
          {department}
        </Typography>
        <Typography level="body-xs" textColor="neutral.500">
          {config.label}
        </Typography>
      </Stack>
    </Box>
  );
};

export default SubmissionItem;
