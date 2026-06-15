import React from "react";
import { Stack, Typography, Avatar } from "@mui/joy";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { PeopleAltOutlined } from "@mui/icons-material";
import { deepPurple, purple } from "@mui/material/colors";
import { SUMMARY_PEOPLE } from "../../../../../../Data/Columns";
import BasicTableComponent from "@Components/Common/Table/BasicTableComponent";

const PeopleList = ({ responsiblePeople, peopleCount }) => {
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

          <Avatar variant="soft" sx={{ bgcolor: deepPurple[50] }} size="md">
            <Typography level="body-md" sx={{ color: deepPurple[800] }}>
              {peopleCount}
            </Typography>
          </Avatar>
        </Stack>
        <BasicTableComponent
          columns={SUMMARY_PEOPLE()}
          rows={responsiblePeople}
          maxHeight="300px"
          stickyHeader
        />
      </BoxComponent>
    </>
  );
};

export default PeopleList;
