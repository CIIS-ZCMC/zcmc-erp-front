import { Create, Warning, WarningAmberOutlined } from "@mui/icons-material";
import { statusConfig, SUBMISSION_STATUS } from "../../Data/TestData";
import { Avatar, Box, Stack, Typography } from "@mui/joy";
import { AlertTriangle, Pencil } from "lucide-react";

const StatusIcon = ({ status }) => {
  if (status === SUBMISSION_STATUS.NOT_STARTED) {
    return <Warning sx={{ fontSize: 20 }} color="danger" />;
  }
  return <Create sx={{ fontSize: 20 }} color="warning" />;
};

const SubmissionItem = ({ name, status }) => {
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
      <Avatar sx={{ bgcolor: config.iconBg }}>
        <StatusIcon status={status} />
      </Avatar>

      <Stack spacing={0}>
        <Typography level="body-sm" fontWeight={400} sx={{ color: "black" }}>
          {name}
        </Typography>
        <Typography level="body-xs" fontWeight={400} textColor="neutral.500">
          {config.label}
        </Typography>
      </Stack>
    </Box>
  );
};

export default SubmissionItem;
