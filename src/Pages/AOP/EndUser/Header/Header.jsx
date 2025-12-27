import React from "react";

import { Stack, Box, Typography } from "@mui/joy";

import SelectComponent from "@Components/Form/YearSelectComponent";

import { AOP } from "../../../../Data/constants";

const Header = ({ yearsData, nextYearIncluded, mission, handleChange }) => {
  const { HEADER_TITLE, MISSION_LABEL } = AOP;

  return (
    <>
      <Stack width={"100%"}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography sx={{ color: "white", fontSize: 28, fontWeight: 600 }}>
            {HEADER_TITLE}
          </Typography>
          <SelectComponent
            years={yearsData}
            onChange={(e) => handleChange(e)}
            startYear={nextYearIncluded}
            width="120px"
            bgcolor="#004366"
            txtcolor="white"
          />
        </Box>
        <Typography level="body-sm" sx={{ color: "white" }}>
          {MISSION_LABEL}: {mission}
        </Typography>
      </Stack>
    </>
  );
};

export default Header;
