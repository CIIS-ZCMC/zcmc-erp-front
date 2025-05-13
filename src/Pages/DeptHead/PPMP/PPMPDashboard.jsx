import { Typography } from "@mui/material";
import React, { Fragment } from "react";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import { Box, Stack } from "@mui/joy";
import { TargetIcon } from "lucide-react";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { useNavigate } from "react-router-dom";

function PPMPDashboard(props) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <BoxComponent mt={3}>
        <Stack>
          <Box
            bgcolor="#108977"
            padding={3}
            sx={{ borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
          >
            <Typography sx={{ color: "white", fontSize: 32, fontWeight: 600 }}>
              PPMP #2023-0031 for Fiscal year 2026
            </Typography>
            <Typography sx={{ color: "white", fontSize: 14 }}>
              Mission: This is a sample mission written by the requesting body.
              This could be as short as a single sentence but could be as long
              as two sentences if necessary.
            </Typography>
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="stretch"
            bgcolor="#FAFAFA"
            padding={3}
            sx={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
            gap={2}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <BoxComponent width="100%" padding={2}>
                <Typography fontWeight={600} pb={2} fontSize={20}>
                  Plan summary
                </Typography>
                <Stack direction={"row"} spacing={2}>
                  <BoxComponent width="100%">
                    <Typography fontSize={16} fontWeight={600} py={1}>
                      1,200 items
                    </Typography>
                    <Typography alignItems="center" display="flex" gap={1}>
                      {" "}
                      <TargetIcon style={{ fontSize: 10 }} /> ₱ 1,000,000.00
                    </Typography>
                  </BoxComponent>
                  <BoxComponent width="100%">
                    <Typography fontSize={16} fontWeight={600} py={1}>
                      14,000 total item quantity
                    </Typography>
                    <Typography>
                      With (₱22,000,000.00) total allocated budget
                    </Typography>
                  </BoxComponent>
                </Stack>
              </BoxComponent>
            </Box>
            <BoxComponent width="100%">
              <Typography fontWeight={600} fontSize={20}>
                About your PPMP
              </Typography>
              <Typography pb={4}>
                This is a draft PPMP request that we’ve generated based from the
                AOP you’ve just created recently. Update the draft so you can
                submit it for approval.
              </Typography>
              <ButtonComponent
                label={"Update PPMP"}
                onClick={() => navigate("ppmp-items")}
              />
            </BoxComponent>
          </Stack>
        </Stack>
      </BoxComponent>
    </Fragment>
  );
}

export default PPMPDashboard;
