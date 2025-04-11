import { Box, Grid, Stack, Typography } from "@mui/joy";
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import IconButtonComponent from "../../../Components/Common/IconButtonComponent";
import { ChevronDown, ChevronUp } from "lucide-react";
import SheetComponent from "../../../Components/Common/SheetComponent";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";

const activityData = [
  {
    value: 1,
    label: "#0001",
    description: "Sample description for activity 1",
  },
  {
    value: 2,
    label: "#0002",
    description: "Sample description for activity 2",
  },
  {
    value: 3,
    label: "#0003",
    description: "Sample description for activity 3",
  },
];

function AddItems(props) {
  const { activityId, expenseId } = useParams();

  const activity = activityData.find(
    (item) => item.value === Number(activityId)
  );

  const activityInfo = activity
    ? {
        code: activity.label,
        description: activity.description,
      }
    : null;

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseClick = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <Fragment>
      <ContainerComponent
        title={`You are managing resources for Activity: ${activityInfo?.code}`}
        description={
          "Collapse this card to view more information about the selected activity."
        }
        sx={{ mt: 2 }}
        actions={
          <Stack>
            <IconButtonComponent
              variant={"text"}
              icon={isCollapsed ? <ChevronUp /> : <ChevronDown />}
              onClick={(e) => {
                e.stopPropagation();
                handleCollapseClick();
              }}
            />
          </Stack>
        }
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {isCollapsed && (
            <Box>
              <Stack
                direction={"row"}
                gap={2}
                sx={{
                  justifyContent: "space-between",
                }}
              >
                <BoxComponent variant={"outlined"}>
                  <Typography fontSize={14} fontWeight={600}>
                    Activity code:
                  </Typography>
                  <Box width={"200px"} mt={1}>
                    <Typography fontSize={12} color="primary">
                      {activityInfo?.code}
                    </Typography>
                  </Box>
                </BoxComponent>

                <BoxComponent variant={"outlined"}>
                  <Typography fontSize={14} fontWeight={600}>
                    Activity:
                  </Typography>
                  <Box width={"80%"} mt={1}>
                    <Typography fontSize={12}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book.
                    </Typography>
                  </Box>
                </BoxComponent>

                <BoxComponent variant={"outlined"}>
                  <Typography fontSize={14} fontWeight={600}>
                    Activity:
                  </Typography>
                  <Box width={"200px"} mt={1}>
                    <Typography fontSize={12}>{expenseId}</Typography>
                  </Box>
                </BoxComponent>
              </Stack>
            </Box>
          )}
        </Box>
      </ContainerComponent>

      <ContainerComponent title={"Select items to add on PPMP"} sx={{ mt: 3 }}>
        <Grid
          container
          spacing={2}
          direction="row"
          columns={{ xs: 12, sm: 6, md: 12 }}
          sx={{ justifyContent: "space-between", flexGrow: 1, width: "auto" }}
        >
          <Grid size={6}>
            {Array(40)
              .fill(null)
              .map((_, index) => (
                <Grid
                  key={index}
                  item="true"
                  xs={12}
                  sm={2}
                  md={6}
                  lg={4}
                  xl={3}
                >
                  <Typography>ItemCard</Typography>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </ContainerComponent>
    </Fragment>
  );
}

export default AddItems;
