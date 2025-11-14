import React from "react";
import { Box, Sheet, Typography } from "@mui/joy";
import { TodayOutlined } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ProcurementSchedule() {
  return (
    <Sheet>
      {/* Title */}
      <Box mb={2}>
        <Typography
          level="title-md"
          startDecorator={
            <TodayOutlined color="success" style={{ fontSize: 20 }} />
          }
        >
          Procurement Schedule by Month
        </Typography>
        <Typography level="body-sm">
          Distribution of procurement across the fiscal year
        </Typography>
      </Box>

      {/* Months Container */}
      <Sheet
        variant="plain"
        sx={{
          borderRadius: "sm",
          overflow: "hidden",
          border: `1px solid ${grey[100]}`,
        }}
      >
        {/* Header Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            backgroundColor: grey[100],
            borderBottom: `1px solid ${grey[100]}`,
          }}
        >
          {months.map((m) => (
            <Box
              key={m}
              sx={{
                py: 1.5,
                textAlign: "center",
                fontWeight: 600,
                borderRight: `1px solid ${grey[300]}`,
                "&:last-child": { borderRight: "none" },
              }}
            >
              {m}
            </Box>
          ))}
        </Box>

        {/* Values Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
          }}
        >
          {months.map((m) => (
            <Box
              key={m}
              sx={{
                py: 2,
                textAlign: "center",
                borderRight: `1px solid ${grey[300]}`,
                "&:last-child": { borderRight: "none" },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: grey[400],
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 600,
                  color: "neutral.solidColor",
                  border: `1px solid ${grey[400]}`,
                  mx: "auto",
                }}
              >
                –
              </Box>
            </Box>
          ))}
        </Box>
      </Sheet>
    </Sheet>
  );
}
