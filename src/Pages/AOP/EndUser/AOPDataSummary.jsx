import React from "react";
import { Box } from "@mui/joy";

// Status Cards
import ObjectivesCard from "./Status/ObjectivesCard";
import ActivitiesCard from "./Status/ActivitiesCard";
import ResourcesCard from "./Status/ResourcesCard";
import ResponsiblePersonCard from "./Status/ResponsiblePersonCard";

const AOPDataSummary = ({ aop, handleNavigateObjectives }) => {
  const {
    objectives_count,
    activities_count,
    resources_count,
    responsible_people_count,
    unified_success_indicators_count,
    gad_activities_count,
    non_gad_activities_count,
    total_cost,
    users_only,
    designations_only,
  } = aop?.counts || {};

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 2,
        width: "100%",
        height: "100%",
      }}
    >
      {/* 1 */}
      <ObjectivesCard
        hasFunction
        handleNavigate={handleNavigateObjectives}
        successIndicatorCount={unified_success_indicators_count}
        objectiveCount={objectives_count}
      />

      {/* 2 */}
      <ActivitiesCard
        activitiesCount={activities_count}
        gadActivitiesCount={gad_activities_count}
        nonGadActivitiesCount={non_gad_activities_count}
      />

      {/* 3 */}
      <ResourcesCard
        totalCost={total_cost}
        resourcesCount={resources_count}
        aop={aop}
      />

      {/* 4 */}
      <ResponsiblePersonCard
        usersCount={users_only}
        designationCount={designations_only}
        PersonsCount={responsible_people_count}
      />
    </Box>
  );
};

export default AOPDataSummary;
