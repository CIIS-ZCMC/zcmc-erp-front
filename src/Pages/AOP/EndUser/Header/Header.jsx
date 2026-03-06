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
}) => {
  const { HEADER_TITLE, MISSION_LABEL } = AOP;

  return (
    <>
      <Stack width={"100%"} spacing={1}>
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
        <Box display={"flex"} alignItems={"flex-end"}>
          <Box width={"auto"}>
            <Typography
              level="body-sm"
              sx={{ color: "white" }}
              endDecorator={
                !isAopDisabled(status) && (
                  <ButtonComponent
                    size={"xs"}
                    label={
                      <Typography
                        fontStyle={"italic"}
                        sx={{ color: "white" }}
                        fontSize={13}
                      >
                        Edit
                      </Typography>
                    }
                    startDecorator={<Edit />}
                    onClick={() => handleEdit()}
                  />
                )
              }
            >
              {MISSION_LABEL}: {mission}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default Header;
