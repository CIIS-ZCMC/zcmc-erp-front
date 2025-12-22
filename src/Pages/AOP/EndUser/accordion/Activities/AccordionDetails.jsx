import React from "react";
import { Grid, Stack, Typography } from "@mui/joy";
import ResourcesList from "./Lists/ResourcesList";
import PeopleList from "./Lists/PeopleList";

const AccordionDetails = ({
  first_quarter,
  second_quarter,
  third_quarter,
  fourth_quarter,
  resources,
  responsiblePeople,
  resourcesCount,
  peopleCount,
}) => {
  const quarters = [
    { label: "Q1", value: first_quarter },
    { label: "Q2", value: second_quarter },
    { label: "Q3", value: third_quarter },
    { label: "Q4", value: fourth_quarter },
  ];

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        my={2}
      >
        <Typography level="body-xs" sx={{ fontWeight: 600 }}>
          Target (by quarter)
        </Typography>

        {quarters.map((q) => (
          <Stack
            key={q.label}
            direction="row"
            spacing={1}
            alignItems="center"
            bgcolor="#F2F2F2"
            padding={1}
            borderRadius={10}
          >
            <Typography level="body-sm">{q.label}</Typography>
            <Typography
              level="body-md"
              sx={{ fontWeight: 600, color: "black" }}
            >
              {q.value || "0"}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Grid container spacing={2}>
        <Grid xs={6}>
          <ResourcesList
            resources={resources}
            resourcesCount={resourcesCount}
          />
        </Grid>

        <Grid xs={6}>
          <PeopleList
            responsiblePeople={responsiblePeople}
            peopleCount={peopleCount}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default AccordionDetails;
