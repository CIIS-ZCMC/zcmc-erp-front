import React from "react";

import { Stack, Typography, Box } from "@mui/joy";

import ButtonComponent from "@Components/Common/ButtonComponent";

import no_result from "../../../assets/empty-state-icon-base.svg";

import { AOP } from "../../../Data/constants";

const AOPEmpty = ({ setOpenFiscalYearModal }) => {
  const {
    EMPTY_STATE_TITLE,
    EMPTY_STATE_SUBTITLE,
    EMPTY_STATE_DESCRIPTION,
    EMPTY_TITLE_PAGE,
    EMPTY_TITLE_DESC,
    PAGE_TITLE,
    PAGE_DESCRIPTION,
  } = AOP;

  return (
    <>
      <Stack>
        <Typography level="h2">{PAGE_TITLE}</Typography>

        <Typography level="body-xs">{PAGE_DESCRIPTION}</Typography>
      </Stack>

      <Stack
        height="85vh"
        sx={{
          border: "2px solid #003049",
          borderRadius: 10,
          bgcolor: "white",
        }}
        alignItems="center"
        justifyContent="center"
        mt={3}
        gap={2}
      >
        <img src={no_result} alt="not-found-img" width={300} />

        <Box>
          <Typography fontSize={24} textAlign="center">
            {EMPTY_STATE_TITLE}
          </Typography>
          <Typography
            sx={{ color: "#003049", fontSize: 24, fontWeight: "bold" }}
            textAlign="center"
          >
            {EMPTY_STATE_SUBTITLE}
          </Typography>
        </Box>

        <Typography width={"35%"} textAlign="center">
          {EMPTY_STATE_DESCRIPTION}
        </Typography>
        <Stack direction="row" gap={1}>
          <ButtonComponent label="Request new items" variant="outlined" />
          <ButtonComponent
            label="Create New AOP"
            variant="solid"
            onClick={() => setOpenFiscalYearModal(true)}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default AOPEmpty;
