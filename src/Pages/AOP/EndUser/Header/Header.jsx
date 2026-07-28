import React from "react";

import { Stack, Box, Typography } from "@mui/joy";

import SelectComponent from "@Components/Form/YearSelectComponent";

import { AOP } from "../../../../Data/constants";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { Edit } from "@mui/icons-material";
import { isAopDisabled } from "../../../../Utils/AopStatus";

const Header = ({
  yearsData,
  nextYearIncluded,
  mission,
  handleChange,
  handleEdit,
  status,
  fiscalYear,
}) => {
  const { HEADER_TITLE, MISSION_LABEL } = AOP;

  return (
    <>
      <Stack spacing={1} alignItems={"flex-start"} width={"100%"}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
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
            fiscalYear={fiscalYear}
          />
        </Box>
        <Stack direction={"row"} alignItems={"center"}>
          <Typography level="body-sm" sx={{ color: "white" }}>
            {MISSION_LABEL}: {mission}{" "}
            {!isAopDisabled(status) && (
              <ButtonComponent
                size="xs"
                label={
                  <Typography
                    fontStyle="italic"
                    fontSize={13}
                    sx={{ color: "white" }}
                  >
                    Edit
                  </Typography>
                }
                startDecorator={<Edit fontSize="small" />}
                onClick={handleEdit}
              />
            )}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default Header;
