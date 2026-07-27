import React, { useEffect, useState, useMemo } from "react";
import { Stack, Typography, Grid, Box } from "@mui/joy";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useModalHook from "../../../../Hooks/ModalHook";
import useActivitiesHook from "../../../../Hooks/ActivitiesHook";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import InputComponent from "@Components/Form/InputComponent";
import ConfirmationModalComponent from "@Components/Common/Dialog/ConfirmationModalComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import ActivitiesModal from "./modal/ActivitiesModal";
import ActivitiesList from "./ActivitiesList";
import useActivitiesStore, {
  useActivitiesActions,
} from "../../../../Store/ActivitiesStore";
import useAOPStore from "../../../../Store/AOPStore";
import { ACTIVITIES } from "../../../../Data/constants";
import PageTitle from "@Components/Common/PageTitle";
import useAOPBreadcrumbs from "../../../../Hooks/AOP/AOPBreadcrumbs";
import ChipComponent from "@Components/Common/ChipComponent";
import { isAopDisabled } from "../../../../Utils/AopStatus";
import { Add, Circle } from "@mui/icons-material";
import useSnackbarHook from "../../../../Hooks/SnackbarHook";
import { useRowEditingLock } from "../../../../Hooks/Socket/useRowEditingLock";
import { getNextYearRange, nextYear } from "../../../../Utils/Functions";
import { useAuth } from "../../../../Store/AuthStore";
import PageLoader from "@Components/Loading/PageLoader";
import StatusSwitch from "@Components/StatusSwitchComponent";
import BasicTableComponent from "@Components/Common/Table/BasicTableComponent";
import { AOP_ACTIVITIES_COLUMNS } from "@Data/Columns";
import ServerPaginationComponent from "@Components/ServerPaginationComponent";
import useSwitchViewHook from "@Hooks/AOP/SwitchViewHook";
import usePageNumberHook from "@Hooks/PageNumberHook";
import { grey } from "@mui/material/colors";
import { useCommentActions } from "@Hooks/CommentHook";
import { FeedbackContent } from "@Pages/AOP/Approval/Contents/FeedbackContent";

const Activities = () => {
  const { objectiveId } = useParams();
  const navigate = useNavigate();
  const { aop } = useAOPStore();
  const { user } = useAuth();
  const {
    applicationActivities,
    applicationActivity,
    activity,
    cost,
    startMonth,
    endMonth,
    isGadRelated,
    target,
    isEditLoading,
    isCreateLoading,
    isUpdateLoading,
  } = useActivitiesStore();
  const { clearFields, clearApplicationActivities } = useActivitiesActions();
  const {
    getActivities,
    createActivity,
    updateActivity,
    removeActivity,
    showActivity,
  } = useActivitiesHook();
  const { getCommentsByActivity } = useCommentActions();

  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const { showSnack } = useSnackbarHook();
  const breadcrumbs = useAOPBreadcrumbs();
  const { min, max } = getNextYearRange();
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
  const [btnLoading, setIsBtnLoading] = useState(false);
  const [isCountModal, setIsCountModal] = useState(false);
  const [countActivities, setCountActivities] = useState(1);
  const [isOpenActivitiesModal, setIsOpenActivitiesModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const {
    lockedRows: lockedActivities,
    startEditLock,
    stopEditLock,
    getLockState: getActivityLockState,
  } = useRowEditingLock({
    room: {
      joinEvent: "aop:register",
      payload: { aopId: aop?.id },
    },
    events: {
      lock: "aop:activity-lock",
      unlock: "aop:activity-unlock",
      editing: "aop:activity-editing",
      editingStopped: "aop:activity-editing-stopped",
      locked: "aop:activity-locked",
    },
    idKey: "activityId",
    startEditEvent: "aop:activity:start-edit",
    stopEditEvent: "aop:activity:stop-edit",
    currentUserId: user?.id,
    currentUserName: user?.name,
    onNotify: (status, msg) => showSnack(status, msg, "soft"),
    getItemKey: (data) =>
      data.aopId && data.objectiveId && data.activityId
        ? `${data.aopId}:${data.objectiveId}:${data.activityId}`
        : data.activityId,
    enabled: Boolean(objectiveId && aop?.id),
  });

  const getActivityKey = (aopId, objectiveId, activityId) =>
    `${aopId}:${objectiveId}:${activityId}`;

  const status = aop.status.id;

  const objectiveName = applicationActivities?.objective;
  const successIndicator = applicationActivities?.success_indicator;

  const isCard = useSwitchViewHook((state) => state.isCard);
  const setIsCard = useSwitchViewHook((state) => state.setIsCard);

  const page =
    usePageNumberHook((state) => state.pages[`activities-${objectiveId}`]) || 1;

  const setPageStore = usePageNumberHook((state) => state.setPage);

  const setPage = (value) => setPageStore(`activities-${objectiveId}`, value);

  const perPage = isCard ? 9 : 10;

  const handleCloseModal = () => {
    if (selectedActivityId) {
      stopEditLock(selectedActivityId, { objectiveId });
    }
    setIsOpenActivitiesModal(false);
    setIsEditMode(false);
    setSelectedActivityId(null);
    clearFields();
  };

  const handleOpenEditModal = async (activityId) => {
    startEditLock(activityId, { objectiveId });
    setIsEditMode(true);
    setSelectedActivityId(activityId);

    const params = { id: activityId };

    await showActivity(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        return; //Toast error
      }
      setIsOpenActivitiesModal(true);
    });
  };

  const handleOpenCountModal = () => {
    setIsCountModal(true);
  };

  const handleUpdateActivity = async () => {
    setIsBtnLoading(true);

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
          stopEditLock(selectedActivityId, { objectiveId });
          showSnack(200, message);
          setIsBtnLoading(false);
          handleCloseModal();
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: "Please try again.",
          });
          setIsBtnLoading(false);
        }
      });
    } catch (error) {
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedActivityId) return;

    setIsBtnLoading(true);

    const params = { id: selectedActivityId };

    await removeActivity(
      params,
      (status, message) => {
        const isSuccess = status === 200;

        if (!isSuccess) {
          setAlertDialog({
            status: "error",
            title: "Error deleting",
            description: "Please try again.",
          });
        } else {
          showSnack(200, message, "soft");
        }

        setIsBtnLoading(false);
        setOpenDeleteModal(false);
        setSelectedActivityId(null);
      },
      {
        page,
        setPage,
        setPagination,
        search,
        perPage,
        application_objective_id: objectiveId,
      },
    );
  };

  const handleOpenDeleteModal = (activityId) => {
    startEditLock(activityId, { objectiveId });

    setOpenDeleteModal(true);
    setSelectedActivityId(activityId);

    const data = {
      status: "warning",
      title: ` Are you sure you want to delete this activity ? `,
      description: "The selected activity will be removed",
    };
    setConfirmationModal(data);
  };

  const handleSaveActivities = async () => {
    setIsBtnLoading(true);

    const payload = {
      application_objective_id: objectiveId,
      count: countActivities,
    };

    try {
      await createActivity(
        payload,
        (status, message) => {
          if (status === 201) {
            showSnack(200, message);
            setIsBtnLoading(false);
            setIsCountModal(false);
          } else {
            setAlertDialog({
              status: "error",
              title: message,
              description: "Please try again.",
            });
            setIsBtnLoading(false);
          }
        },
        {
          page,
          setPage,
          setPagination,
          search,
          perPage,
          application_objective_id: objectiveId,
        },
      );
    } catch (error) {
      setAlertDialog({
        status: "error",
        title: "Unexpected Error",
        description: error.message || "Something went wrong.",
      });
    }
  };

  const handleViewComments = (activityId) => {
    getCommentsByActivity(activityId, (status, message) => {
      if (status === 200) {
        setOpenFeedbackModal(true);
      } else {
        setAlertDialog({
          status: "error",
          title: message,
          description: "Please try again.",
        });
      }
    });
  };

  const activityHandlers = {
    add: () => {
      handleOpenCountModal();
    },

    edit: (row) => {
      const { isLockedByOther } = getActivityLockState(row.id);
      if (isLockedByOther) return;

      handleOpenEditModal(row.id);
    },

    delete: (row) => {
      const { isLockedByOther } = getActivityLockState(row.id);
      if (isLockedByOther) return;

      handleOpenDeleteModal(row.id);
    },

    resources: (row) => {
      navigate(`/aop/manage-resources/${row.id}`, {
        state: { activityId: row.id },
      });
    },

    resp_person: (row) => {
      navigate(`/aop/responsible-person/${row.id}`, {
        state: { activityId: row.id },
      });
    },
  };

  useEffect(() => {
    setIsLoading(true);

    getActivities(
      {
        page,
        search,
        per_page: perPage,
        application_objective_id: objectiveId,
      },
      (status, message, paginationData) => {
        if (status >= 200 && status < 300 && paginationData) {
          setPagination(paginationData);
        }

        setIsLoading(false);
      },
    );
  }, [objectiveId, page, search, perPage]);

  useEffect(() => {
    clearApplicationActivities();
    setPage(1);
  }, [objectiveId]);

  return (
    <>
      <PageTitle
        title={`AOP for Fiscal Year ${nextYear}`}
        description={
          "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
        items={breadcrumbs}
        withArrowBack
        backTo={`/aop/objectives/${aop?.id}`}
      />
      <BoxComponent mt={2} p={2} bgColor={"#F9FAFB"} boxShadow="xs">
        <Stack
          display={"flex"}
          flexDirection={"row"}
          gap={2}
          alignItems={"flex-end"}
          justifyContent={"space-between"}
        >
          <Stack gap={1}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Typography fontWeight={600}>
                {MANAGE_ACTIVITIES_HEADER}
              </Typography>
              <ChipComponent
                //change this
                label={"Objective: " + objectiveName}
                color={"success"}
                variant={"outlined"}
                fontSize={13}
                wrap
              />
            </Stack>

            <Typography level="body-sm" sx={{ color: grey[900] }}>
              Success Indicator: {successIndicator}
            </Typography>
          </Stack>

          <ButtonComponent
            onClick={() => setIsCountModal(true)}
            label={"Add Activity"}
            disabled={isAopDisabled(status)}
            startDecorator={<Add />}
            // endDecorator={<Plus size={16} />}
            // disabled={!show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled)}
          />
        </Stack>

        <Stack
          direction={"row"}
          spacing={1}
          alignItems={"flex-end"}
          justifyContent={"space-between"}
          marginTop={3}
        >
          <Stack direction={"row"} spacing={2}>
            <StatusSwitch
              activeLabel="Card"
              inactiveLabel="Table"
              activeColor="primary"
              inactiveColor="neutral"
              activeBg="#0086CC"
              inactiveBg="#0086CC"
              checked={isCard}
              onChange={(value) => {
                setIsCard(value);
                setPage(1);
              }}
              size="md"
            />
            <SearchBarComponentv2
              value={search}
              setValue={setSearch}
              placeholder="Search activities..."
              fullWidth
            />
          </Stack>

          <Stack display={"flex"} flexDirection={"col"} alignItems={"center"}>
            <Stack display={"flex"} flexDirection={"row"} gap={1}>
              <Circle size={12} color={"success"} />

              <Typography level="body-xs" fontWeight={400}>
                Completed Activity Details
              </Typography>
            </Stack>

            <Stack display={"flex"} flexDirection={"row"} gap={1}>
              <Circle size={12} color={"danger"} />

              <Typography level="body-xs" fontWeight={400}>
                Incomplete Activity Details
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </BoxComponent>
      <Stack
        sx={{
          minHeight: "calc(100vh - 250px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {isEditLoading ? (
            <Stack>
              <PageLoader isLoading={isEditLoading} />
            </Stack>
          ) : isLoading ? (
            <Stack height="60vh" alignItems="center" justifyContent="center">
              <ThreeDotsLoader />
            </Stack>
          ) : applicationActivities?.activities?.length === 0 ? (
            <>
              <BoxComponent mt={2}>
                <Stack
                  direction={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  textAlign={"center"}
                  height={"64vh"}
                >
                  <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                    {EMPTY_STATE_TITLE}
                  </Typography>

                  <Typography mb={2} sx={{ fontSize: 20, fontWeight: 400 }}>
                    {ACTIVITY_CREATE_NEW}
                  </Typography>

                  <ButtonComponent
                    onClick={() => handleOpenCountModal()}
                    label={"Add Activity"}
                    startDecorator={<Add />}
                    // endDecorator={<Plus size={16} />}
                  />
                </Stack>
              </BoxComponent>
            </>
          ) : isCard ? (
            <Grid
              mt={2}
              container
              direction="row"
              spacing={2}
              sx={{ flexGrow: 1 }}
            >
              {applicationActivities?.activities?.map((activity) => {
                const activityKey = getActivityKey(
                  aop.id,
                  objectiveId,
                  activity.id,
                );
                const lock = lockedActivities[activityKey];
                const isLockedByOther = lock && lock.editorId !== user.id;
                return (
                  <Grid key={activity.id} size={4} lg={4} md={6} sm={12}>
                    <ActivitiesList
                      status={status}
                      activity={activity}
                      handleAdd={activityHandlers.add}
                      handleEdit={() => activityHandlers.edit(activity)}
                      handleDelete={() => activityHandlers.delete(activity)}
                      handleViewComments={() => handleViewComments(activity.id)}
                      isLockedByOther={isLockedByOther}
                      lockedBy={lock?.editorName}
                    />
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Box sx={{ mt: 2, flexGrow: 1 }}>
              <BasicTableComponent
                columns={AOP_ACTIVITIES_COLUMNS(
                  status,
                  activityHandlers.resources,
                  activityHandlers.resp_person,
                  activityHandlers.edit,
                  activityHandlers.delete,
                  handleViewComments,
                  getActivityLockState,
                )}
                rows={applicationActivities?.activities}
                getRowIndicatorColor={(row) =>
                  row?.is_draft ? "#dc2626" : "#16a34a"
                }
              />
            </Box>
          )}
        </Box>
      </Stack>
      <Box
        sx={{
          width: "100%",
          mt: "auto",
          pt: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ServerPaginationComponent
          page={page}
          setPage={setPage}
          perPage={perPage}
          pagination={pagination}
        />
      </Box>
      {/* set count empty activities */}
      {isCountModal && (
        <ModalComponent
          isOpen={isCountModal}
          handleClose={() => setIsCountModal(false)}
          title={MODAL_TITLE}
          description={MODAL_DESCRIPTION}
          minWidth={500}
          maxWidth={512}
          content={
            <>
              <Stack
                direction={"column"}
                alignItems={"start"}
                justifyContent={"center"}
              >
                <Typography
                  level="body-sm"
                  fontWeight={500}
                  sx={{ color: "black" }}
                >
                  {COUNT_LABEL}
                </Typography>
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
          rightButtonAction={() => handleSaveActivities()}
          isLoading={btnLoading}
        />
      )}
      {/* Edit exisitng empty activities */}
      {isOpenActivitiesModal && (
        <ModalComponent
          isOpen={isOpenActivitiesModal}
          handleClose={handleCloseModal}
          title={"Edit Activity"}
          description={
            "Add or modify the details of this activity to align with its objective."
          }
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
          rightButtonAction={() => handleUpdateActivity()}
          isLoading={btnLoading}
        />
      )}
      {openDeleteModal && (
        <ConfirmationModalComponent
          btnColor={"danger"}
          leftButtonLabel="Cancel"
          leftButtonAction={() => {
            if (selectedActivityId) {
              stopEditLock(selectedActivityId, { objectiveId });
            }
            setOpenDeleteModal(false);
            closeConfirmation();
          }}
          rightButtonLabel="Delete"
          rightButtonAction={() => handleConfirmDelete()}
          isLoading={btnLoading}
        />
      )}
      {openFeedbackModal && (
        <FeedbackContent
          openFeedbackModal={openFeedbackModal}
          setOpenFeedbackModal={setOpenFeedbackModal}
          showRemarks={false}
        />
      )}{" "}
    </>
  );
};

export default Activities;
