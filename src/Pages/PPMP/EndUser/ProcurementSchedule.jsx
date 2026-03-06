import React from "react";
import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { TodayOutlined } from "@mui/icons-material";
import { green, grey, red } from "@mui/material/colors";

const months = [
  { label: "Jan", key: "january" },
  { label: "Feb", key: "february" },
  { label: "Mar", key: "march" },
  { label: "Apr", key: "april" },
  { label: "May", key: "may" },
  { label: "Jun", key: "june" },
  { label: "Jul", key: "july" },
  { label: "Aug", key: "august" },
  { label: "Sep", key: "september" },
  { label: "Oct", key: "october" },
  { label: "Nov", key: "november" },
  { label: "Dec", key: "december" },
];

const defaultSchedule = months.reduce((acc, m) => {
  acc[m.key] = 0;
  return acc;
}, {});

export default function ProcurementSchedule({ editing, value, onChange }) {
  const schedule = value || defaultSchedule;

  const handleMonthChange = (key, raw) => {
    const numeric = raw.replace(/\D/g, "");
    const updated = {
      ...schedule,
      [key]: numeric === "" ? 0 : Number(numeric),
    };

    onChange?.(updated);
  };

  return (
    <>
      {/* Title */}
      <Stack mb={2} gap={1}>
        <Typography
          level="title-md"
          startDecorator={<TodayOutlined color="success" />}
        >
          Procurement Schedule by Month
        </Typography>
        <Typography level="body-sm">
          Distribution of procurement across the fiscal year
        </Typography>
      </Stack>

      <Sheet
        sx={{
          borderRadius: "sm",
          overflow: "hidden",
          border: `1px solid ${grey[200]}`,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
            backgroundColor: grey[100],
            borderBottom: `1px solid ${grey[200]}`,
          }}
        >
          {months.map((m) => (
            <Box
              key={m.key}
              sx={{
                py: 1.5,
                textAlign: "center",
                fontWeight: 600,
                borderRight: `1px solid ${grey[300]}`,
                "&:last-child": { borderRight: "none" },
              }}
            >
              {m.label}
            </Box>
          ))}
        </Box>

        {/* Values */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12,1fr)",
          }}
        >
          {months.map((m) => {
            const val = schedule[m.key] ?? 0;

            return (
              <Box
                key={m.key}
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
                    backgroundColor: editing
                      ? red[50]
                      : val
                        ? green[400]
                        : grey[400],
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 600,
                    mx: "auto",
                  }}
                >
                  {editing ? (
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={val}
                      onChange={(e) => handleMonthChange(m.key, e.target.value)}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    />
                  ) : (
                    <Typography
                      level="body-sm"
                      sx={{
                        color: val ? "white" : grey[800],
                      }}
                    >
                      {val || "-"}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Sheet>
    </>
  );
}
