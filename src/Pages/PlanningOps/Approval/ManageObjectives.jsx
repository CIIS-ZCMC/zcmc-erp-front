import React from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { useParams } from "react-router-dom";
import { AOP_CONSTANTS } from "../../../Data/constants";
import { Box, Grid, Link, Stack, Typography } from "@mui/joy";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import AccordionComponent from "../../../Components/Common/Accordion/CustomAccordionComponent";
import { Expand, ExternalLink } from "lucide-react";

export default function ManageObjectives() {
  const { id } = useParams();
  return (
    <div>
      <PageTitle
        title={
          <Typography>
            Manage AOP <Typography textColor={"success.500"}>#{id} </Typography>
            for Fiscal year 2026
          </Typography>
        }
        description={AOP_CONSTANTS?.AOP_SUBHEADING}
      />

      {/* CONTENT */}
      <Box
        sx={{
          mt: 5,
          backgroundColor: "white",
          borderRadius: 12,
          width: "100%",
          border: 1,
          borderColor: "neutral.200",
          // bgcolor: "red",
          // boxShadow: "md",
        }}
        pr={2}
      >
        <Grid container columns={12} columnSpacing={3}>
          {/* OBJECTIVES  */}
          <Grid xs={4} height={"100%"}>
            <ContainerComponent
              title={"List of objectives and activities"}
              description={"This is a subtitle"}
              footer={
                <Stack direction={"row"} spacing={2}>
                  <ButtonComponent label={"Process request"} />

                  <Link gap={0.5} fontSize={13}>
                    See all comments <ExternalLink size={14} />
                  </Link>
                </Stack>
              }
            >
              Objectives
            </ContainerComponent>
          </Grid>

          {/* ACTIVITY DETAILS  */}
          <Grid xs={4} height={"80%"}>
            <ContainerComponent
              title={"List of objectives and activities"}
              description={"This is a subtitle"}
            >
              Content
            </ContainerComponent>
          </Grid>

          {/* ACTIVITY DETAILS  */}
          <Grid xs={4} height={"80%"}>
            <ContainerComponent
              title={"List of objectives and activities"}
              description={"This is a subtitle"}
              footer={<Stack direction={"row"}>Buttons here</Stack>}
            >
              Content
            </ContainerComponent>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
