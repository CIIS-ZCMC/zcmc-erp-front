import React, { Fragment, useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { blue, grey } from "@mui/material/colors";
import { PlusIcon } from "lucide-react";

import BoxComponent from "@Components/Common/Card/BoxComponent";

import AccordionComponent from "@Components/Common/AccordionComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";

import UserAccordionSummary from "./accordion/user/AccordionSummary";
import UserAccordionDetails from "./accordion/user/AccordionDetails";

import PositionAccordionSummary from "./accordion/positions/AccordionSummary";
import PositionAccordionDetails from "./accordion/positions/AccordionDetails";

import { RESPONSIBLE } from "../../../../Data/constants";
import { Close, People, PersonPinCircle, X } from "@mui/icons-material";
import { isAopDisabled } from "../../../../Utils/AopStatus";

const ResponsibleList = ({
  positionsCount,
  usersCount,
  setSelectedId,
  handleDelete,
  openResponsibleModal,
  responsible_people,
  status,
}) => {
  const { EMPTY_STATE_TITLE, EMPTY_STATE_DESCRIPTION } = RESPONSIBLE;
  const theme = useTheme();
  const color = theme.palette;

  return (
    <>
      {responsible_people?.users?.length === 0 &&
      responsible_people?.designations?.length === 0 ? (
        <BoxComponent
          borderColor={grey[300]}
          height={"63vh"}
          borderRadius={10}
          justifyContent={"center"}
          alignItems={"center"}
          display={"flex"}
          flexDirection={"column"}
        >
          <Typography level="title-md">{EMPTY_STATE_TITLE}</Typography>
          <Typography level="body-sm" mb={1}>
            {EMPTY_STATE_DESCRIPTION}
          </Typography>

          <ButtonComponent
            startDecorator={<PlusIcon />}
            label={"Assign Responsible Person"}
            onClick={openResponsibleModal}
          />
        </BoxComponent>
      ) : (
        <Grid container spacing={1}>
          <Grid xs={6}>
            <BoxComponent>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Stack direction={"row"} spacing={1}>
                  <Avatar color="primary">
                    <People />
                  </Avatar>
                  <Stack>
                    <Typography level="title-md">Assigned Persons</Typography>
                    <Typography level="body-sm">
                      Specific individuals responsible for this activity
                    </Typography>
                  </Stack>
                </Stack>

                <Avatar color="primary">{usersCount}</Avatar>
              </Stack>

              <Stack
                spacing={1.5}
                sx={{ maxHeight: "50vh", overflowY: "auto" }}
              >
                {responsible_people?.users?.length === 0 ? (
                  <Typography p={2} textAlign="center" level="title-md">
                    Please assign a person
                  </Typography>
                ) : (
                  (() => {
                    const filteredPeople = responsible_people?.users || [];
                    const rows = [];

                    // Group people in pairs
                    for (let i = 0; i < filteredPeople?.length; i += 2) {
                      rows.push(filteredPeople.slice(i, i + 2));
                    }

                    return rows.map((pair, rowIndex) => (
                      <Stack
                        key={rowIndex}
                        direction="row"
                        spacing={2}
                        sx={{ width: "100%", pt: 3 }}
                      >
                        {pair.map(({ id, name, assignedArea }) => (
                          <Stack
                            key={id}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              flex: 1,
                              p: 1,
                              bgcolor: color.background.level1,
                              borderRadius: 10,
                            }}
                          >
                            <Stack direction="column">
                              <Typography level="title-sm">{name}</Typography>
                              <Typography level="body-sm">
                                {assignedArea?.name}
                              </Typography>
                            </Stack>
                            <IconButton
                              onClick={() => handleDelete(id)}
                              aria-label="Delete"
                              size="sm"
                              disabled={isAopDisabled(status)}
                            >
                              <Close />
                            </IconButton>
                          </Stack>
                        ))}
                      </Stack>
                    ));
                  })()
                )}
              </Stack>

              {/* <AccordionComponent
                defaultExpanded={true}
                accordionSummary={
                  <UserAccordionSummary usersCount={usersCount} />
                }
                accordionDetails={
                  <UserAccordionDetails
                    status={status}
                    setSelectedId={setSelectedId}
                    handleOpenDeleteModal={handleDelete}
                    responsible_people={responsible_people}
                  />
                }
              /> */}
            </BoxComponent>
          </Grid>

          <Grid xs={6}>
            <BoxComponent>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Stack direction={"row"} spacing={1}>
                  <Avatar sx={{ bgcolor: "#DDD6FF" }}>
                    <PersonPinCircle
                      sx={{ fontSize: 20, color: "#5D0EC0" }}
                    />{" "}
                  </Avatar>
                  <Stack>
                    <Typography level="title-md">Assigned Positions</Typography>
                    <Typography level="body-sm">
                      Specific positions responsible for this activity
                    </Typography>
                  </Stack>
                </Stack>

                <Avatar sx={{ bgcolor: "#DDD6FF", color: "#5D0EC0" }}>
                  {positionsCount}
                </Avatar>
              </Stack>

              <Stack
                spacing={1.5}
                pt={3}
                sx={{ maxHeight: "50vh", overflowY: "auto" }}
              >
                {responsible_people?.designations?.length === 0 ? (
                  <Typography p={2} textAlign="center" level="title-md">
                    Please assign a designation
                  </Typography>
                ) : (
                  responsible_people?.designations?.map(({ id, name }) => (
                    <Fragment key={id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          bgcolor: color.background.level1,
                          borderRadius: 10,
                        }}
                      >
                        <Typography level="title-sm">{name}</Typography>

                        <IconButton
                          onClick={() => handleDelete(id)}
                          aria-label="Delete"
                          size="sm"
                          disabled={isAopDisabled(status)}
                        >
                          <Close />
                        </IconButton>
                      </Box>
                    </Fragment>
                  ))
                )}
              </Stack>

              {/* <AccordionComponent
                defaultExpanded={true}
                accordionSummary={
                  <PositionAccordionSummary positionsCount={positionsCount} />
                }
                accordionDetails={
                  <PositionAccordionDetails
                    status={status}
                    setSelectedId={setSelectedId}
                    handleOpenDeleteModal={handleDelete}
                    responsible_people={responsible_people}
                  />
                }
              /> */}
            </BoxComponent>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ResponsibleList;
