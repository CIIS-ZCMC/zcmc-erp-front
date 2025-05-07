import React from "react";

import { Box, Stack, Typography, Divider } from "@mui/joy";

const Header = ({ pageDetails, data }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack mt={3}>
          <Typography fontSize={30} fontWeight={600}>
            {pageDetails?.pageTitle
              ? pageDetails?.pageTitle
              : pageDetails.title}
          </Typography>
          <Typography
            level="body-sm"
            // sx={{ color: theme.palette.custom.fontReg }}
          >
            {pageDetails.description}
          </Typography>
        </Stack>
      </Box>
    </>
  );
};

export default Header;
