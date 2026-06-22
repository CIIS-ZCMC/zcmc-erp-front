import React from "react";
import { Grid } from "@mui/joy";

import ObjectivesCard from "../Status/ObjectivesCard";
import ActivitiesCard from "../Status/ActivitiesCard";
import ResourcesCard from "../Status/ResourcesCard";
import ResponsiblePersonCard from "../Status/ResponsiblePersonCard";
import CostCard from "../Status/CostCard";

const Summary = ({
  hasTotalCost = false,
  activitiesCount,
  objectivesCount,
  resourcesCount,
  gadActivitiesCount,
  nonGadActivitiesCount,
  responsiblePeopleCount,
  totalCost,
  successIndicatorCount,
  usersCount,
  designationCount,
}) => {
  const cardProps = { sx: { height: "100%", width: "100%" } };

  const cards = [
    <ObjectivesCard
      {...cardProps}
      objectiveCount={objectivesCount}
      successIndicatorCount={successIndicatorCount}
    />,
    <ActivitiesCard
      {...cardProps}
      activitiesCount={activitiesCount}
      gadActivitiesCount={gadActivitiesCount}
      nonGadActivitiesCount={nonGadActivitiesCount}
    />,
    <ResourcesCard
      {...cardProps}
      resourcesCount={resourcesCount}
      totalCost={totalCost}
    />,
    <ResponsiblePersonCard
      {...cardProps}
      PersonsCount={responsiblePeopleCount}
      usersCount={usersCount}
      designationCount={designationCount}
    />,
  ];

  if (hasTotalCost) {
    cards.push(<CostCard {...cardProps} totalCost={totalCost} />);
  }

  return (
    <Grid container spacing={1} pb={4} sx={{ alignItems: "stretch" }}>
      {cards.map((card, idx) => (
        <Grid key={idx} xs>
          {card}
        </Grid>
      ))}
    </Grid>
  );
};

export default Summary;
