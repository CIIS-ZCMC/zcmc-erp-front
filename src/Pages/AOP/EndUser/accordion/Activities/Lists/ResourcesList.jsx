import React from "react";
import { Stack, Typography, Avatar } from "@mui/joy";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { Add, Handyman } from "@mui/icons-material";
import { SUMMARY_RESOURCES } from "../../../../../../Data/Columns";
import BasicTableComponent from "@Components/Common/Table/BasicTableComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { useNavigate } from "react-router-dom";

const ResourcesList = ({ resources, resourcesCount, activity_id }) => {
  const navigate = useNavigate();
  return (
    <>
      <BoxComponent>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          mb={2}
        >
          <Stack direction={"row"} gap={2}>
            <Avatar size="lg" color="primary">
              <Handyman />
            </Avatar>
            <Stack>
              <Typography level="title-md">Resources</Typography>
              <Typography level="body-xs">
                Resources used for this activity
              </Typography>
            </Stack>
          </Stack>

          <Avatar variant="soft" color="primary" size="md">
            <Typography level="body-md" color="violet">
              {/* {usersCount} */} {resourcesCount}
            </Typography>
          </Avatar>
        </Stack>
        <BasicTableComponent
          columns={SUMMARY_RESOURCES()}
          rows={resources}
          emptyMessage="No resources added yet. Resources are the items and material needed to carry out this activity."
          maxHeight="300px"
          emptyButton={
            <ButtonComponent
              label={"Add Resources"}
              startDecorator={<Add />}
              onClick={() =>
                navigate(`/aop/manage-resources/${activity_id}`, {
                  state: { activityId: activity_id },
                })
              }
            />
          }
          stickyHeader
        />
      </BoxComponent>
    </>
  );
};

export default ResourcesList;
