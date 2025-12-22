import React from "react";

import {
  List,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
  Avatar,
} from "@mui/joy";

import BoxComponent from "@Components/Common/Card/BoxComponent";

import PeopleIcon from "../../../../../../assets/responsible_people/People.svg";
import { PeopleAltOutlined } from "@mui/icons-material";
import { deepPurple, purple } from "@mui/material/colors";

const PeopleList = ({ responsiblePeople, peopleCount }) => {
  return (
    <>
      <BoxComponent>
        <ListItemContent
          sx={{
            padding: 2,
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} gap={2}>
              <Avatar size="lg" sx={{ bgcolor: deepPurple[50] }}>
                <PeopleAltOutlined sx={{ color: deepPurple[800] }} />
              </Avatar>
              <Stack>
                <Typography level="title-md">Assigned Persons</Typography>
                <Typography level="body-xs">
                  Specific individuals responsible for this activity
                </Typography>
              </Stack>
            </Stack>

            <Avatar variant="soft" sx={{ bgcolor: deepPurple[50] }} size="lg">
              <Typography level="body-md" sx={{ color: deepPurple[800] }}>
                {peopleCount}
              </Typography>
            </Avatar>
          </Stack>
        </ListItemContent>

        <List
          sx={{
            padding: 2,
          }}
        >
          {responsiblePeople?.map(({ id, user, designation }) => {
            const { name: employeeName, designation_name } = user || "";
            const { name: jobPosition } = designation || "";

            return (
              <ListItem key={id}>
                <Stack>
                  <Typography level="title-sm">
                    {employeeName ? employeeName : jobPosition}
                  </Typography>
                  <Typography level="body-sm">
                    {employeeName ? designation_name : "Position"}
                  </Typography>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      </BoxComponent>
    </>
  );
};

export default PeopleList;
