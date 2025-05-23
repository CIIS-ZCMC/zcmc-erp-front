import React, { Fragment, useState, useEffect, act } from "react";
import { Stack, Grid } from "@mui/joy";
import { useNavigate, useLocation } from "react-router-dom";

import useResponsiblePeopleHook from "../../../../../../../../Hooks/ResponsiblePeopleHook";

//Custom Components
import ButtonComponent from "../../../../../../../../Components/Common/ButtonComponent";
import ContainerComponent from "../../../../../../../../Components/Common/ContainerComponent";
import AlertDialogComponent from "../../../../../../../../Components/Common/Dialog/AlertDialogComponent";
import ModalComponent from "../../../../../../../../Components/Common/Dialog/ModalComponent";

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // useEffect(() => {
  //   console.log(location.state)
  // }, [])

  // const isAssigned = activity && (
  //     activity.isAssigned
  // )


  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  }

  // Check if at least one responsible entity exists
  const hasData =
    activity?.users?.length > 0 ||
    activity?.designations?.length > 0 ||
    activity?.areas?.length > 0;

  const handleSaveAssignment = () => {
    if (!activity) {
      console.warn("No responsible person data found for this activity.");
      return;
    }

    if (!hasData) {
      console.warn("No users, designations, or areas selected.");
      return;
    }

    setAssignmentStatus(activityId, true);
    alert('saving responsible person');
    // handleDialogOpen()

    // navigate(`/aop-create/`);
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
          <Grid item={'true'} xs={12} sm={2} md={4}>
            <PersonSection />
          </Grid>

          <Grid item={'true'} xs={12} sm={2} md={4}>
            <JobPositionsSection />
          </Grid>

          <Grid item={'true'} xs={12} sm={2} md={4}>
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

          {!hasData ? <ButtonComponent
            onClick={() => handleCancel(activityId)}
            label={"Cancel Selection"}
            size={"md"}
            variant={"outlined"}
          />
            :
            <ButtonComponent
              onClick={() => navigate(-1)}
              label={"Back to activities"}
              size={"md"}
              variant={"outlined"}
            />
          }
          <ButtonComponent
            label={"Save Assignment"}
            size={"md"}
            variant={"solid"}
            onClick={() => handleSaveAssignment()}
            disabled={!hasData}
          />
        </Stack>
      </ContainerComponent>

      <AlertDialogComponent
        isOpen={isDialogOpen}
      />

      <ModalComponent
        isOpen={isDialogOpen}
      />
    </Fragment>
  );
};

export default ResponsiblePerson;
