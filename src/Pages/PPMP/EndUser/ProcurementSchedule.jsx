import React, { Fragment, useState } from "react";
import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { TodayOutlined } from "@mui/icons-material";
import { green, grey, red } from "@mui/material/colors";

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

const monthKeyMap = {
  Jan: "january",
  Feb: "february",
  Mar: "march",
  Apr: "april",
  May: "may",
  Jun: "june",
  Jul: "july",
  Aug: "august",
  Sep: "september",
  Oct: "october",
  Nov: "november",
  Dec: "december",
};

export default function ProcurementSchedule({
  editing,
  initialData,
  onChange,
}) {
  const [schedule, setSchedule] = useState(
    initialData || {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    },
  );

  const handleMonthChange = (monthKey, value) => {
    const numeric = value.replace(/\D/g, ""); // digits only
    const updated = {
      ...schedule,
      [monthKey]: numeric === "" ? 0 : Number(numeric),
    };
    setSchedule(updated);
    if (onChange) onChange(updated); // propagate to parent
  };
  return (
    <Fragment>
      {/* Title */}
      <Stack mb={2} gap={1}>
        <Typography
          level="title-md"
          startDecorator={
            <TodayOutlined color="success" style={{ fontSize: 20 }} />
          }
        >
          Procurement Schedule by Month
        </Typography>
        <Typography level="body-sm" mt={1}>
          Distribution of procurement across the fiscal year
        </Typography>
      </Stack>

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
                  backgroundColor: editing
                    ? red[50]
                    : schedule[monthKeyMap[m]]
                      ? green[400]
                      : grey[400],
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 500,
                  color: "neutral.solidColor",

                  mx: "auto",
                }}
              >
                {editing ? (
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={schedule[monthKeyMap[m]] ?? 0}
                    onChange={(e) =>
                      handleMonthChange(monthKeyMap[m], e.target.value)
                    }
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
                    placeholder="-"
                  />
                ) : (
                  <Typography
                    level="body-sm"
                    sx={{
                      color: editing
                        ? red[100]
                        : schedule[monthKeyMap[m]]
                          ? "white"
                          : grey[800],
                    }}
                  >
                    {schedule[monthKeyMap[m]] ?? "-"}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Sheet>
    </Fragment>
  );
}
