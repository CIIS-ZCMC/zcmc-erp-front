import { useEffect, useState, useMemo } from "react";

import { Stack, Divider, Typography, Breadcrumbs, Grid } from "@mui/joy";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import ObjectivesModal from "./modal/ObjectivesModal";
import CardComponent from "@Components/Common/Card/CardComponent";
import ConfirmationModalComponent from "@Components/Common/Dialog/ConfirmationModalComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import NoResultComponent from "@Components/Common/Table/NoResultComponent";

import useModalHook from "../../../../Hooks/ModalHook";
import useSocket from "../../../../Hooks/Socket/SocketHook";

import CardHeader from "./card/CardHeader";
import CardBody from "./card/CardBody";
import CardActions from "./card/CardActions";

import { OBJECTIVES } from "../../../../Data/constants";

import {
  useAopApplication,
  useFunctionType,
  useObjective,
  useSuccessIndicator,
  useObjectivesActions,
  useApplicationObjectives,
  useApplicationObjective,
  useOtherObjective,
  useOtherSuccessIndicator,
  useIsLoading,
  useIsObjLoading,
  useIsIndicatorLoading,
  useIsShowLoading,
  useIsBtnLoading,
} from "../../../../Store/ObjectivesStore";

import useObjectivesHook from "../../../../Hooks/AOP/ObjectivesHook";
import PageTitle from "@Components/Common/PageTitle";
import useAOPBreadcrumbs from "../../../../Hooks/AOP/AOPBreadcrumbs";
import { Add, CheckCircle } from "@mui/icons-material";
import useSnackbarHook from "../../../../Hooks/SnackbarHook";
import { useAuth } from "../../../../Store/AuthStore";
import { socket } from "../../../../Services/Socket";
import SnackbarComponent from "@Components/Common/SnackbarComponent";
import { nextYear } from "../../../../Utils/Functions";
import PageLoader from "@Components/Loading/PageLoader";

const Objectives = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { aopId } = useParams();

  const aopApplication = useAopApplication();
  const functionType = useFunctionType();
  const objective = useObjective();
  const successIndicator = useSuccessIndicator();
  const otherObjective = useOtherObjective();
  const otherSuccessIndicator = useOtherSuccessIndicator();
  const applicationObjectives = useApplicationObjectives();
  const applicationObjective = useApplicationObjective();
  const isLoading = useIsLoading();
  const isObjLoading = useIsObjLoading();
  const isIndicatorLoading = useIsIndicatorLoading();
  const isBtnLoading = useIsBtnLoading();
  const isShowLoading = useIsShowLoading();
  const { clearFields } = useObjectivesActions();

  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const {
    getObjectivesBySector,
    showObjective,
    createObjective,
    updateObjective,
    removeObjective,
  } = useObjectivesHook();
  const { showSnack } = useSnackbarHook();
  const breadcrumbs = useAOPBreadcrumbs();

  // const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOpenObjectivesModal, setIsOpenObjectivesModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [editingState, setEditingState] = useState({
    editable: true,
    editorId: null,
    editorName: null,
  });

  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};
  const [lockedRows, setLockedRows] = useState({});
  const [isEditLoading, setIsEditLoading] = useState(false);

  useEffect(() => {
    getObjectivesBySector(search, (status, message) => {
      if (status < 200 || status >= 300) {
        // handle error (toast, snackbar, etc.)
        return;
      }
    });
  }, [search]);

  const { status_id } = aopApplication; //get status id on aop application object

  const {
    OBJECTIVES_EMPTY_STATE_TITLE,
    OBJECTIVES_CREATE_NEW,
    ADD_OBJECTIVE,
    EDIT_OBJECTIVE,
    ADD_OBJECTIVE_SUBHEADING,
    MANAGE_OBJECTIVES_HEADER,
    MANAGE_OBJECTIVES_SUBHEADER,
  } = OBJECTIVES;

  const handleSaveObjectives = async () => {
    const payload = {
      aop_application_id: aopId,
      objective_id: objective?.id,
      success_indicator_id: successIndicator?.id,
      other_objective_description: otherObjective,
      other_success_indicator_description: otherSuccessIndicator,
    };

    try {
      await createObjective(payload, (status, message) => {
        if (status === 201) {
          showSnack(200, message);
          handleCloseModal();
          clearFields();
        } else if (status === 409) {
          setAlertDialog({
            status: "error",
            title: "Duplicate Entry",
            description: message,
          });
        } else {
          setAlertDialog({
            status: "error",
            title: "Unexpected error",
            description: message,
          });
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

  const handleUpdateObjectives = async () => {
    const payload = {
      objective_id: objective?.id,
      success_indicator_id: successIndicator?.id,
      other_objective_description: otherObjective,
      other_success_indicator_description: otherSuccessIndicator,
    };

    const params = { id: selectedObjectiveId };

    try {
      await updateObjective(params, payload, (status, message) => {
        if (status === 200) {
          socket.emit("aop:stop-edit", {
            aopId,
            objectiveId: selectedObjectiveId,
            userId: id,
          });

          showSnack(200, message);
          handleCloseModal();
          clearFields();
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: "Please try again.",
          });
          console.error(" Failed to update objectives:", message);
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

  const handleOpenEditModal = async (objectiveId) => {
    setSelectedObjectiveId(objectiveId);
    setIsEditMode(true);
    setIsEditLoading(true);

    const params = { id: objectiveId };

    await showObjective(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        showSnack(500, message, "danger");
      }
    });

    setIsEditLoading(false);
    setIsOpenObjectivesModal(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedObjectiveId) return;

    // setIsLoading(true);

    const params = { id: selectedObjectiveId };

    await removeObjective(params, (status, message) => {
      const isSuccess = status === 200 || status === true;

      setAlertDialog({
        status: isSuccess ? "success" : "error",
        title: message,
        description: isSuccess ? "" : "Please try again.",
      });

      if (!isSuccess) {
        console.error("Failed to delete objective:", message);
      }
      setIsEditMode(false);
      // setIsLoading(false);
      setOpenDeleteModal(false);
      setSelectedObjectiveId(null);
    });
  };

  const handleOpenDeleteModal = (objectiveId) => {
    setIsEditMode(true);

    setOpenDeleteModal(true);
    setSelectedObjectiveId(objectiveId);

    const data = {
      status: "warning",
      title: ` Are you sure you want to delete this objective ? `,
      description: "The selected objective will be removed",
    };

    setConfirmationModal(data);
  };

  const handleOpenObjectivesModal = () => {
    setIsOpenObjectivesModal(true);
  };

  const handleCloseModal = () => {
    if (isEditMode && selectedObjectiveId) {
      socket.emit("aop:stop-edit", {
        aopId,
        objectiveId: selectedObjectiveId,
        userId: id,
      });
    }
    setIsOpenObjectivesModal(false);
    setIsEditMode(false);
    setSelectedObjectiveId(null);
    clearFields();
  };

  useEffect(() => {
    if (!socket || !aopId) return;

    // Register with the AOP
    socket.emit("aop:register", { aopId });

    // Helper to add a locked objective
    const addLock = ({ objectiveId, editorId, editorName }) => {
      setLockedRows((prev) => ({
        ...prev,
        [objectiveId]: { editorId, editorName },
      }));
    };

    // Helper to remove a lock
    const removeLock = ({ objectiveId }) => {
      setLockedRows((prev) => {
        const updated = { ...prev };
        delete updated[objectiveId];
        return updated;
      });
    };

    // 🔔 Notifications
    const handleEditing = ({ editorName, objectiveId }) => {
      showSnack(
        401,
        `${editorName} is editing Objective #${objectiveId}`,
        "soft",
      );
    };

    const handleEditingStopped = ({ objectiveId }) => {
      if (objectiveId) removeLock({ objectiveId });
      showSnack(200, "Editing finished", "soft");
    };

    // Event listeners
    socket.on("aop:editing", handleEditing);
    socket.on("aop:editing-stopped", handleEditingStopped);

    socket.on("aop:lock", addLock);
    socket.on("aop:unlock", removeLock);

    socket.on("aop:locked", (data) => {
      addLock(data);
      showSnack(
        401,
        `Objective #${data.objectiveId} is currently being edited by ${data.editorName}`,
        "soft",
      );
    });

    // Cleanup on unmount
    return () => {
      socket.off("aop:editing", handleEditing);
      socket.off("aop:editing-stopped", handleEditingStopped);
      socket.off("aop:lock", addLock);
      socket.off("aop:unlock", removeLock);
      socket.off("aop:locked");
    };
  }, [socket, aopId]);

  return (
    <div>
      <PageTitle
        title={`AOP for Fiscal Year ${nextYear}`}
        description={
          "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
        items={breadcrumbs}
        withArrowBack
        onClickArrow={() => navigate("/aop")}
      />

      <BoxComponent p={2} bgColor={"#F9FAFB"} boxShadow="xs" mt={2}>
        <Stack direction={"column"}>
          <Typography fontWeight={600}>{MANAGE_OBJECTIVES_HEADER}</Typography>

          <Typography level="body-xs" fontWeight={400}>
            {MANAGE_OBJECTIVES_SUBHEADER}
          </Typography>
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          paddingTop={2}
        >
          <SearchBarComponentv2
            value={search}
            setValue={setSearch}
            placeholder="Search objectives..."
            fullWidth
          />
          <ButtonComponent
            onClick={() => handleOpenObjectivesModal()}
            label={"Add an Objective"}
            disabled={status_id === 4 || status_id === 2}
            startDecorator={<Add />}
            // endDecorator={<Plus size={16} />}
            // disabled={
            //   isApproved
            //   // !show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled) for socket
            // }
          />
        </Stack>
      </BoxComponent>
      {isEditLoading ? (
        <Stack>
          <PageLoader isLoading={isEditLoading} />
        </Stack>
      ) : isLoading ? (
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          my={2}
          height={"65vh"}
        >
          <ThreeDotsLoader />
        </Stack>
      ) : applicationObjectives.length === 0 ? (
        <BoxComponent mt={2}>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            textAlign={"center"}
            height={"64vh"}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
              {OBJECTIVES_EMPTY_STATE_TITLE}
            </Typography>

            <Typography mb={2} sx={{ fontSize: 20, fontWeight: 400 }}>
              {OBJECTIVES_CREATE_NEW}
            </Typography>

            <ButtonComponent
              onClick={() => handleOpenObjectivesModal()}
              label={"Add an Objective"}
              startDecorator={<Add />}
              // endDecorator={<Plus size={16} />}
            />
          </Stack>
        </BoxComponent>
      ) : (
        <>
          {applicationObjectives.length === 0 ? (
            <NoResultComponent />
          ) : (
            <Grid
              mt={2}
              container
              direction="row"
              spacing={2}
              sx={{ flexGrow: 1 }}
            >
              {applicationObjectives.map((obj) => {
                const {
                  id,
                  aop_application_id,
                  success_indicator,
                  objective,
                  activities_count,
                  other_success_indicator,
                  other_objective,
                  type_of_function,
                } = obj;

                const lock = lockedRows[id];
                const isLockedByOther = lock && lock.editorId !== user.id;

                return (
                  <Grid key={id} size={4} lg={4} md={6} sm={12}>
                    <CardComponent
                      statusColor={null}
                      bgcolor={"#F9FAFB"}
                      boxShadow="sm"
                      sx={{
                        opacity: isLockedByOther ? 0.7 : 1,
                        backgroundColor: isLockedByOther ? "#f5f5f5" : "#fff",
                      }}
                      cardHeader={
                        <CardHeader
                          status={status_id}
                          handleEdit={() => {
                            if (isLockedByOther) return;

                            socket.emit("aop:start-edit", {
                              aopId,
                              objectiveId: id,
                              userId: user.id,
                              name: user.name,
                            });

                            handleOpenEditModal(id);
                          }}
                          handleDelete={() => {
                            if (isLockedByOther) return;

                            socket.emit("aop:start-edit", {
                              aopId,
                              objectiveId: id,
                              userId: user.id,
                              name: user.name,
                            });
                            handleOpenDeleteModal(id);
                          }}
                          isLocked={isLockedByOther}
                          lockedBy={lock?.editorName}
                        />
                      }
                      cardBody={
                        <CardBody
                          success_indicator={success_indicator}
                          objective={objective}
                          other_success_indicator={other_success_indicator}
                          other_objective={other_objective}
                          status={false}
                          type_of_function={type_of_function}
                        />
                      }
                      cardActions={
                        <CardActions
                          count={activities_count}
                          handleActivities={() =>
                            navigate(`/aop/activities/${id}`, {
                              state: {
                                objectiveId: id,
                                aopId: aop_application_id,
                                objective:
                                  objective?.description ||
                                  other_objective?.description,
                              },
                            })
                          }
                        />
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}

      {/* edit and add objectives modal */}
      {isOpenObjectivesModal && (
        <ModalComponent
          isOpen={isOpenObjectivesModal}
          handleClose={handleCloseModal}
          title={
            isEditMode
              ? EDIT_OBJECTIVE + " #" + selectedObjectiveId
              : ADD_OBJECTIVE
          }
          description={ADD_OBJECTIVE_SUBHEADING}
          maxWidth={500}
          minWidth={500}
          content={
            <ObjectivesModal
              isLoading={isShowLoading}
              isEditMode={isEditMode}
              functionType={functionType}
              objective={objective}
              successIndicator={successIndicator}
              otherObjective={otherObjective}
              otherSuccessIndicator={otherSuccessIndicator}
              applicationObjective={applicationObjective}
            />
          }
          hasActionButtons={true}
          rightButtonLabel={`${isEditMode ? "Update" : "Save"} Objective`}
          rightButtonAction={() =>
            isEditMode ? handleUpdateObjectives() : handleSaveObjectives()
          }
          isLoading={isBtnLoading}
        />
      )}

      {/* Delete Objectives Modal */}
      {openDeleteModal && (
        <ConfirmationModalComponent
          btnColor={"danger"}
          leftButtonLabel="Cancel"
          leftButtonAction={() => {
            if (isEditMode && selectedObjectiveId) {
              socket.emit("aop:stop-edit", {
                aopId,
                objectiveId: selectedObjectiveId,
                userId: id,
              });
            }
            setOpenDeleteModal(false);
            closeConfirmation();
          }}
          rightButtonLabel="Delete"
          rightButtonAction={() => handleConfirmDelete()}
          isLoading={isBtnLoading}
        />
      )}
    </div>
  );
};

export default Objectives;
