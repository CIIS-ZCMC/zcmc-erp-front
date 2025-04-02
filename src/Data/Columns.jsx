import { Stack, Typography } from "@mui/joy";

export const objHeaders = [
  { field: "id", name: "Row #", width: "5%", align: "center" },
  { field: "function", name: "Function", width: "30%", align: "left" },
  {
    field: "objective",
    name: "Objective",
    width: "30%",
    align: "left",
    render: (params) => {
      return (
        <Stack>
          <Typography fontWeight={600} fontSize={13}>
            {params?.objective}
          </Typography>
          <Typography
            level="body-xs"
            sx={{ alignItems: "center", display: "flex", gap: 0.4 }}
          >
            {params?.objective}
          </Typography>
        </Stack>
      );
    },
  },
  {
    field: "success_indicators",
    name: "Success Indicators",
    width: "20%",
    align: "center",
  },
  { field: "created_at", name: "Created on", width: "10%", align: "center" },
  { field: "updated_at", name: "Updated on", width: "10%", align: "center" },
];
