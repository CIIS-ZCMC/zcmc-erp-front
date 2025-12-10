import React, { useEffect, useState, useMemo } from "react";

import { Stack, Typography, Breadcrumbs, Divider, Grid, Tooltip } from "@mui/joy";

import { useParams, useLocation } from "react-router-dom";

import useModalHook from "../../../../Hooks/ModalHook";
import useActivitiesHook from "../../../../Hooks/ActivitiesHook";

import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import InputComponent from "@Components/Form/InputComponent";
import SearchBarComponent from "@Components/SearchBarComponent";
import ConfirmationModalComponent from "@Components/Common/Dialog/ConfirmationModalComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";

import ActivitiesModal from "./modal/ActivitiesModal";
import ActivitiesList from "./ActivitiesList";

import useActivitiesStore, {
  useActivitiesActions,
} from "../../../../Store/ActivitiesStore";

import { ACTIVITIES } from "../../../../Data/constants";
import PageTitle from "@Components/Common/PageTitle";
import useAOPBreadcrumbs from "../../../../Hooks/AOP/AOPBreadcrumbs";
import ChipComponent from "@Components/Common/ChipComponent";

const centeredStyle = {
  direction: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  height: "65vh",
  my: 2,
};

const Activities = () => {
  const { objectiveId } = useParams();
  const location = useLocation();

  const { state } = location;

  const {
    applicationActivities,
    applicationActivity,
    activity,
    cost,
    startMonth,
    endMonth,
    isGadRelated,
    target,
  } = useActivitiesStore();

  const { clearFields } = useActivitiesActions();

  const {
    getActivities,
    createActivity,
    updateActivity,
    removeActivity,
    showActivity,
  } = useActivitiesHook();

  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const breadcrumbs = useAOPBreadcrumbs();

  const {
    MANAGE_ACTIVITIES_HEADER,
    MANAGE_ACTIVITIES_SUBHEADER,
    MODAL_TITLE,
    MODAL_DESCRIPTION,
    COUNT_LABEL,
    EMPTY_STATE_TITLE,
    ACTIVITY_CREATE_NEW,
  } = ACTIVITIES;

  const [isLoading, setIsLoading] = useState(false);
  const [isCountModal, setIsCountModal] = useState(false);
  const [countActivities, setCountActivities] = useState(1);
  const [isOpenActivitiesModal, setIsOpenActivitiesModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [search, setSearch] = useState("");

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  useEffect(() => {
    setIsLoading(true);

    const params = { application_objective_id: objectiveId };

    getActivities(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    // console.log('current activity value:', activity)
    // console.log('current start month', startMonth)
    // console.log('current end month:', endMonth)
    // console.log('current is gad related', isGadRelated)
    // console.log('current is gad target', target)
    // console.log('from location:', state.objective)
    // console.log('from application activities:', applicationActivities?.[0]?.objective_code)
  }, [
    activity,
    startMonth,
    endMonth,
    isGadRelated,
    target,
    applicationActivities,
  ]);

  const objectiveName = applicationActivities?.[0]?.objective_code || state.objective

  const filteredActivities = useMemo(() => {
    if (!search) return applicationActivities;
    return applicationActivities.filter((act) =>
      act.activity_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, applicationActivities]);

  const handleOpenActivitiesModal = () => {
    setIsOpenActivitiesModal(true);
  };

  const handleCloseActivitiesModal = () => {
    setIsOpenActivitiesModal(false);
  };

  const handleCloseModal = () => {
    setIsOpenActivitiesModal(false);
    setIsEditMode(false);
    clearFields();

    // console.log(applicationActivities);
  };

  const handleOpenEditModal = async (activityId) => {
    // console.log(activityId);
    setIsLoading(true);
    setIsEditMode(true);
    setSelectedActivityId(activityId);
    setIsOpenActivitiesModal(true);

    const params = { id: activityId };

    await showActivity(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      setIsLoading(false);
    });
  };

  const handleOpenCountModal = () => {
    setIsCountModal(true);
  };

  const handleSaveActivity = async () => {
    setIsLoading(true);

    const params = { id: selectedActivityId };

    const payload = {
      name: activity,
      start_month: startMonth,
      end_month: endMonth,
      is_gad_related: isGadRelated,
      target: {
        first_quarter: target.firstQuarter,
        second_quarter: target.secondQuarter,
        third_quarter: target.thirdQuarter,
        fourth_quarter: target.fourthQuarter,
      },
    };

    try {
      await updateActivity(params, payload, (status, message) => {
        if (status === 200) {
          setAlertDialog({
            status: "success",
            title: `${message}`,
            description: "",
          });
          setIsLoading(false);
          handleCloseModal();
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: "Please try again later",
          });
          setIsLoading(false);
          console.error(" Failed to update activity:", message);
        }
      });
    } catch (error) {
      console.error("Error creating objective:", error);
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedActivityId) return;

    setIsLoading(true);

    const params = { id: selectedActivityId };

    await removeActivity(params, (status, message) => {
      const isSuccess = status === 200 || status === true;

      setAlertDialog({
        status: isSuccess ? "success" : "error",
        title: message,
        description: isSuccess ? "" : "Please try again later.",
      });

      if (!isSuccess) {
        console.error("Failed to delete objective:", message);
      }

      setIsLoading(false);
      setOpenDeleteModal(false);
      setSelectedActivityId(null);
    });

    setTimeout(() => {
      setIsLoading(false);
      setOpenDeleteModal(false);
    }, 2000);
  };

  const handleOpenDeleteModal = (activityId) => {
    setOpenDeleteModal(true);
    setSelectedActivityId(activityId);

    const data = {
      status: "warning",
      title: ` Are you sure you want to delete this activity ? `,
      description: "The selected activity will be removed",
    };
    setConfirmationModal(data);
  };

  const handleCountActivities = async () => {
    setIsLoading(true);

    const payload = {
      application_objective_id: objectiveId,
      count: countActivities,
    };

    try {
      await createActivity(payload, (status, message) => {
        if (status === 201) {
          setAlertDialog({
            status: "success",
            title: `${message}`,
            description: "",
          });
          setIsLoading(false);
          // handleCloseModal()
          setIsCountModal(false);
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: "Please try again later",
          });
          setIsLoading(false);
          console.error(" Failed to update objectives:", message);
        }
      });
    } catch (error) {
      console.error(error);
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <>
      <PageTitle
        title={`AOP for Fiscal Year ${currentFiscalYear}`}
        description={
          "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
        items={breadcrumbs}
      />
      <BoxComponent mt={2} p={2}>
        <Stack direction={"column"} spacing={1}>
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            <Typography fontWeight={600}>{MANAGE_ACTIVITIES_HEADER}</Typography>
            <ChipComponent
              //change this
              label={objectiveName}
              color={"success"}
              variant={"outlined"}
              fontSize={13}
              size={"lg"}
            />
          </Stack>

          <Typography level="body-xs" fontWeight={400}>
            {MANAGE_ACTIVITIES_SUBHEADER}
          </Typography>
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <SearchBarComponentv2
            value={search}
            setValue={setSearch}
            placeholder="search activities..."
            fullWidth
          />

          <ButtonComponent
            onClick={() => setIsCountModal(true)}
            label={"Add Activity"}
          // endDecorator={<Plus size={16} />}
          // disabled={!show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled)}
          />
        </Stack>
      </BoxComponent>

      {isLoading ? (
        <Stack sx={centeredStyle}>
          <ThreeDotsLoader />
        </Stack>
      ) : applicationActivities.length === 0 ? (
        <>
          <Stack sx={centeredStyle}>
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
              {EMPTY_STATE_TITLE}
            </Typography>

            <Typography mb={2} sx={{ fontSize: 20, fontWeight: 400 }}>
              {ACTIVITY_CREATE_NEW}
            </Typography>

            <ButtonComponent
              onClick={() => handleOpenCountModal()}
              label={"Add Activity"}
            // endDecorator={<Plus size={16} />}
            />
          </Stack>
        </>
      ) : (
        <Grid mt={2} container direction="row" spacing={2} sx={{ flexGrow: 1 }}>
          {filteredActivities.map((activity) => (
            <Grid key={activity.id} size={4} lg={4} md={6} sm={12}>
              <ActivitiesList
                isLoading={isLoading}
                activity={activity}
                handleAdd={() => handleOpenCountModal()}
                handleEdit={() => handleOpenEditModal(activity.id)}
                handleDelete={() => handleOpenDeleteModal(activity.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* set count empty activities */}
      <ModalComponent
        isOpen={isCountModal}
        handleClose={() => setIsCountModal(false)}
        title={MODAL_TITLE}
        description={MODAL_DESCRIPTION}
        minWidth={500}
        content={
          <>
            <Stack
              direction={"column"}
              alignItems={"start"}
              justifyContent={"center"}
            >
              {COUNT_LABEL}
              <InputComponent
                type={"number"}
                width={80}
                value={countActivities}
                setValue={(val) => setCountActivities(val)}
              />
            </Stack>
          </>
        }
        hasActionButtons={true}
        rightButtonLabel={`Save`}
        rightButtonAction={() => handleCountActivities()}
        isLoading={isLoading}
      />

      {/* Edit exisitng empty activities */}
      <ModalComponent
        isOpen={isOpenActivitiesModal}
        handleClose={handleCloseModal}
        title={"Edit Activity"}
        description={
          "Add or modify the details of this activity to align with its objective."
        }
        height={670}
        minWidth={550}
        content={
          <>
            <ActivitiesModal
              isEditMode={isEditMode}
              selectedActivity={applicationActivity}
            />
          </>
        }
        hasActionButtons={true}
        rightButtonLabel={`Save activity`}
        rightButtonAction={() => handleSaveActivity()}
        isLoading={isLoading}
      />

      {openDeleteModal && (
        <ConfirmationModalComponent
          leftButtonLabel="Cancel"
          leftButtonAction={() => {
            setOpenDeleteModal(false);
            closeConfirmation();
          }}
          rightButtonLabel="Delete"
          rightButtonAction={() => handleConfirmDelete()}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default Activities;
