import React from "react";
import {
  Stack,
  Typography,
  Divider,
  Card,
  CardContent,
  useTheme,
  Select,
} from "@mui/joy";

const StatusCard = ({
  logo,
  count,
  title,
  description,
  hasFunction = false,
  functionHandler,
}) => {
  const theme = useTheme();
  const color = theme.palette.custom;
  return (
    <Card
      variant="soft"
      sx={{
        border: "1px solid #F0F0F0",
        borderRadius: 20,
        bgcolor: "white",
        pt: 3,
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Stack spacing={hasFunction ? 1 : 2}>
          <img src={logo} alt="" width={60} />

          <Typography
            level="title-sm"
            textTransform="uppercase"
            sx={{ color: color.main }}
          >
            {title}
          </Typography>

          <Typography level="h2" fontWeight={600} sx={{ color: color.main }}>
            {count}
          </Typography>

          <Typography level="body-xs">{description}</Typography>

          {hasFunction && (
            <>
              <Divider sx={{ my: 1 }} />
              {functionHandler}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
