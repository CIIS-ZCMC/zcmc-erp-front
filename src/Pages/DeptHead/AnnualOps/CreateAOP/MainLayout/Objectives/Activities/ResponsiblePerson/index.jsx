import React, { Fragment, useState, useEffect, act } from "react";
import { Stack, Grid } from "@mui/joy";
import { useNavigate, useLocation } from "react-router-dom";

import useAOPObjectivesHooks from "../../../../../../../../Hooks/AOP/AOPObjectivesHook";
import useResponsiblePeopleHook from "../../../../../../../../Hooks/ResponsiblePeopleHook";

//Custom Components
import ButtonComponent from "../../../../../../../../Components/Common/ButtonComponent";
import ContainerComponent from "../../../../../../../../Components/Common/ContainerComponent";

// Layouts
import PersonSection from "../../../../../../../../Layout/ResponsiblePerson/PersonSection";
import JobPositionsSection from "../../../../../../../../Layout/ResponsiblePerson/JobPositionsSection";
import AreasSection from "../../../../../../../../Layout/ResponsiblePerson/AreasSection";

//data related
import { AOP_CONSTANTS } from "../../../../../../../../Data/constants";

const ResponsiblePerson = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const objectiveId = location.state.objectiveId; //refers to grand parent id/objective id
  const activityId = location.state.parentId; //refers to parent id/activity id
  const rowId = location.state.activityrowId; //refers to activity row id

  const { responsible_people, resetValues, setAssignmentStatus } = useResponsiblePeopleHook();

  const activity = responsible_people?.find((item) => {
    return item.activityId === activityId;
  });

  // const isAssigned = activity && (
  //     activity.isAssigned
  // )

  // const isSaveEnabled = activity &&
  //     (
  //         activity.users.length > 0 ||
  //         activity.designations.length > 0 ||
  //         activity.areas.length > 0
  //     );

  const handleSaveAssignment = () => {
    if (!activity) {
      console.warn("No responsible person data found for this activity.");
      return;
    }

    // Check if at least one responsible entity exists
    const hasData =
      activity.users?.length > 0 ||
      activity.designations?.length > 0 ||
      activity.areas?.length > 0;

    if (!hasData) {
      console.warn("No users, designations, or areas selected.");
      return;
    }

    // const updatedResponsiblePeople = [
    //   {
    //     activityId: activityId,
    //     ...(activity.users || []).map((user) => ({
    //       userId: user.id,
    //       designationId: null,
    //       divisionId: null,
    //       departmentId: null,
    //       sectionId: null,
    //       unitId: null,
    //     })),
    //     ...(activity.designations || []).map((designation) => ({
    //       userId: null,
    //       designationId: designation.id,
    //       divisionId: null,
    //       departmentId: null,
    //       sectionId: null,
    //       unitId: null,
    //     })),
    //     ...(activity.areas || []).map((area) => ({
    //       userId: null,
    //       designationId: null,
    //       divisionId: area.type === "division" ? area.id : null,
    //       departmentId: area.type === "department" ? area.id : null,
    //       sectionId: area.type === "section" ? area.id : null,
    //       unitId: area.type === "unit" ? area.id : null,
    //     })),
    //   },
    // ];

    // console.log("Data to submit:", updatedResponsiblePeople);
    // Set assignment flag if needed
    setAssignmentStatus(activityId, true);

    // navigate(`/aop-create/activities/${rowId}`);
  };

  const handleCancel = (activityId) => {
    resetValues(activityId);
    navigate(`/aop-create/activities/${rowId}`);
  };
  // console.log(responsible_persons)

  return (
    <Fragment>
      <ContainerComponent
        title={AOP_CONSTANTS.TABLE_PERSON_HEADER}
        description={AOP_CONSTANTS.TABLE_PERSON_SUBHEADING}
      >
        <Grid
          container
          spacing={3}
          columns={{ xs: 12, sm: 12, md: 12 }}
          sx={{
            flexGrow: 1,
            width: "auto",
            p: 1,
          }}
        >
          <Grid item xs={12} sm={2} md={4}>
            <PersonSection />
          </Grid>

          <Grid item xs={12} sm={2} md={4}>
            <JobPositionsSection />
          </Grid>

          <Grid item xs={12} sm={2} md={4}>
            <AreasSection />
          </Grid>
        </Grid>

        <Stack
          mt={2}
          direction={"flex"}
          alignItems={"center"}
          justifyContent={"start"}
          gap={1}
        >
          {/* {isAssigned ? */}
          <ButtonComponent
            onClick={() => navigate(`/aop-create/activities/${rowId}`)}
            label={"Back to activities"}
            size={"md"}
            variant={"outlined"}
          />
          :
          <ButtonComponent
            onClick={() => handleCancel(activityId)}
            label={"Cancel Selection"}
            size={"md"}
            variant={"outlined"}
          // disabled={isAssigned}
          />
          {/* } */}
          <ButtonComponent
            label={"Save Assignment"}
            size={"md"}
            variant={"solid"}
            onClick={() => handleSaveAssignment()}
          // disabled={!isSaveEnabled}
          />
        </Stack>
      </ContainerComponent>
    </Fragment>
  );
};

export default ResponsiblePerson;
