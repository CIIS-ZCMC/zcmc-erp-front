import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
  Avatar,
  Box,
} from "@mui/joy";

import BoxComponent from "@Components/Common/Card/BoxComponent";

import ResourcesIcon from "../../../../../../assets/dashboard/Resources.svg";

import formattedPrice from "../../../../../../Utils/formattedPrice";
import PeopleIcon from "@mui/icons-material/People";
import { Handyman } from "@mui/icons-material";
import TableComponent from "@Components/Common/Table/TableComponent";
import { SUMMARY_RESOURCES } from "../../../../../../Data/Columns";
import BasicTableComponent from "@Components/Common/Table/BasicTableComponent";
const ResourcesList = ({ resources, resourcesCount }) => {
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
          maxHeight="300px"
          stickyHeader
        />
      </BoxComponent>
    </>
  );
};

export default ResourcesList;
