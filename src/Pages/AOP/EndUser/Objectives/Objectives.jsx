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
} from "../../../../Store/ObjectivesStore";

import useObjectivesHook from "../../../../Hooks/ObjectivesHook";
import PageTitle from "@Components/Common/PageTitle";
import useAOPBreadcrumbs from "../../../../Hooks/AOP/AOPBreadcrumbs";
import { CheckCircle } from "@mui/icons-material";
import useSnackbarHook from "../../../../Hooks/SnackbarHook";
import { useAuth } from "../../../../Store/AuthStore";
import { socket } from "../../../../Services/Socket";

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

  useEffect(() => {
    getObjectivesBySector();
  }, []);

  useEffect(() => {}, [
    aopApplication,
    functionType,
    objective,
    successIndicator,
    applicationObjectives,
    isLoading,
  ]);

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

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const filteredObjectives = useMemo(() => {
    if (!search) return applicationObjectives;

    const keyword = search.toLowerCase();

    return applicationObjectives.filter((obj) => {
      const textsToSearch = [
        obj.objective?.description,
        obj.other_objective?.description,
        obj.success_indicator?.description,
        obj.other_success_indicator?.description,
      ].filter(Boolean);

      return textsToSearch.some((text) => text.toLowerCase().includes(keyword));
    });
  }, [search, applicationObjectives]);

  const handleSaveObjectives = async () => {
    // setIsLoading(true);

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
          // setAlertDialog({
          //   status: "success",
          //   title: `${message}`,
          //   description: "",
          // });
          // setIsLoading(false);
          handleCloseModal();
        } else {
          setAlertDialog({
            status: "error",
            title: "Duplicate Entry",
            description: message,
          });
          // setIsLoading(false);
          console.error(" Failed to create objectives:", message);
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
    // setIsLoading(true);

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
          socket.emit("aop:row:stop-edit", {
            aopId,
            objectiveId: selectedObjectiveId,
            userId: id,
          });
          showSnack(200, message);
          // setAlertDialog({
          //   status: "success",
          //   title: `${message}`,
          //   description: "",
          // });
          // setIsLoading(false);
          handleCloseModal();
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: "Please try again later",
          });
          // setIsLoading(false);
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
    // setIsLoading(true)
    setSelectedObjectiveId(objectiveId);

    const params = { id: objectiveId };

    await showObjective(params, (status, message) => {
      if (!(status >= 200 && status < 300)) {
        // if status not success
        return; //Toast error
      }
      // setIsLoading(false);
    });

    setIsEditMode(true);
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
        description: isSuccess ? "" : "Please try again later.",
      });

      if (!isSuccess) {
        console.error("Failed to delete objective:", message);
      }

      // setIsLoading(false);
      setOpenDeleteModal(false);
      setSelectedObjectiveId(null);
    });
  };

  const handleOpenDeleteModal = (objectiveId) => {
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
    setIsOpenObjectivesModal(false);
    setIsEditMode(false);
    clearFields();
  };

  useEffect(() => {
    if (!socket || !aopId || !id) return;

    // Register user in AOP context
    socket.emit("aop:register", {
      userId: id,
      name,
      aopId,
    });

    // Receive row lock
    socket.on("aop:row:lock", ({ objectiveId, editorId, editorName }) => {
      setLockedRows((prev) => ({
        ...prev,
        [objectiveId]: {
          editorId,
          editorName,
        },
      }));
    });

    // Receive row unlock
    socket.on("aop:row:unlock", ({ objectiveId }) => {
      setLockedRows((prev) => {
        const updated = { ...prev };
        delete updated[objectiveId];
        return updated;
      });
    });

    return () => {
      socket.off("aop:row:lock");
      socket.off("aop:row:unlock");
    };
  }, [socket, aopId, id]);

  return (
    <div>
      <PageTitle
        title={`AOP for Fiscal Year ${currentFiscalYear}`}
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
            isLoading={isLoading}
            startDecorator={<CheckCircle />}
            // endDecorator={<Plus size={16} />}
            // disabled={
            //   isApproved
            //   // !show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled) for socket
            // }
          />
        </Stack>
      </BoxComponent>

      {isLoading && (
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
      )}

      {isLoading ? (
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
              // endDecorator={<Plus size={16} />}
            />
          </Stack>
        </BoxComponent>
      ) : (
        <>
          {filteredObjectives.length === 0 ? (
            <NoResultComponent />
          ) : (
            <Grid
              mt={2}
              container
              direction="row"
              spacing={2}
              sx={{ flexGrow: 1 }}
            >
              {filteredObjectives.map((obj) => {
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

                            socket.emit("aop:row:start-edit", {
                              aopId,
                              objectiveId: id,
                              userId: user.id,
                              name: user.name,
                            });

                            handleOpenEditModal(id);
                          }}
                          handleDelete={() => handleOpenDeleteModal(id)}
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
      <ModalComponent
        isOpen={isOpenObjectivesModal}
        handleClose={handleCloseModal}
        title={isEditMode ? EDIT_OBJECTIVE : ADD_OBJECTIVE}
        description={ADD_OBJECTIVE_SUBHEADING}
        maxWidth={500}
        minWidth={500}
        content={
          <ObjectivesModal
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
        isLoading={isLoading}
      />

      {/* Delete Objectives Modal */}
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
    </div>
  );
};

export default Objectives;
