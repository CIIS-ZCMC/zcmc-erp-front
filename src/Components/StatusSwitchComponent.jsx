import { Switch, Typography } from "@mui/joy";
import React from "react";

export default function StatusSwitch({
  checked,
  onChange,
  activeLabel = "Active",
  inactiveLabel = "Archived",
  disabled = false,
  size = "md",
}) {
  const isActive = checked;

  return (
    <Switch
      size={size}
      color={isActive ? "success" : "warning"}
      checked={isActive}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      slotProps={{
        track: {
          children: (
            <>
              <Typography
                component="span"
                level="body-sm"
                sx={{
                  position: "absolute",
                  left: 12,
                  color: "#FFFFFF",
                  opacity: isActive ? 1 : 0,
                }}
              >
                {activeLabel}
              </Typography>

              <Typography
                component="span"
                level="body-sm"
                sx={{
                  position: "absolute",
                  right: 12,
                  color: "#FFFFFF",
                  opacity: !isActive ? 1 : 0,
                }}
              >
                {inactiveLabel}
              </Typography>
            </>
          ),
        },
      }}
      sx={{
        "--Switch-thumbSize": "17px",
        "--Switch-trackWidth": "100px",
        "--Switch-trackHeight": "26px",

        // Smooth thumb + track motion
        "& .MuiSwitch-thumb": {
          transition: "transform 200ms ease",
        },
        "& .MuiSwitch-track": {
          transition: "background-color 200ms ease",
        },
      }}
    />
  );
}
