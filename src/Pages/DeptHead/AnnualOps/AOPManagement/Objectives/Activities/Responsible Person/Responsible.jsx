import React, { Fragment, useState, useEffect, act } from "react";
import { Stack, Grid, Checkbox, Snackbar, Alert } from "@mui/joy";
import { useNavigate, useLocation } from "react-router-dom";

import useResponsiblePeopleHook from "../../../../../../../Hooks/ResponsiblePeopleHook";
import useModalHook from "../../../../../../../Hooks/ModalHook";

//Custom Components
import ButtonComponent from "@Components/Common/ButtonComponent";
import ContainerComponent from "@Components/Common/ContainerComponent";
import ConfirmationModalComponent from "@Components/Common/Dialog/ConfirmationModalComponent";
import AlertDialogComponent from "@Components/Common/Dialog/AlertDialogComponent";

import PersonSection from "./PersonSection";
import DesignationSection from "./DesignationSection";
// import AreasSection from "../../../../../../../../Layout/ResponsiblePerson/AreasSection";

//data related
import { AOP_CONSTANTS } from "../../../../../../../Data/constants";
import { localStorageGetter } from "../../../../../../../Utils/LocalStorage";
import { useAuth } from "../../../../../../../Store/AuthStore";
import { socket } from "../../../../../../../Services/Socket";
import useSocketEditing from "../../../../../../../Hooks/Socket/useSocketEditing";

const Responsible = () => {

    const APPLICATION_OBJECTIVE_ID = localStorageGetter('aop-app-id');
    const remarks = localStorageGetter("remarks");
    const comments = localStorageGetter("all_comments");
    const aopStatus = localStorage.getItem("aop-status");

    const navigate = useNavigate();
    const location = useLocation();

    const objectiveId = location.state.objectiveId; //refers to grand parent id/objective id
    const activityId = location.state.parentId; //refers to parent id/activity id
    const rowId = location.state.activityrowId; //refers to activity row id

    const { responsible_people, resetValues, setAssignmentStatus } =
        useResponsiblePeopleHook();

    const { setConfirmationModal, closeConfirmation } = useModalHook();

    const activity = responsible_people?.find((item) => {
        return item.activityId === activityId;
    });

    const [isLoading, setIsLoading] = useState(false);
    // const [isEnabledSave, setIsEnabledSave] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const { user } = useAuth();
    const { name, id, assignedArea } = user ?? {};

    const {
        openNotify,
        editor,
        disabled,
        show,
        editLoad,
        handleEditClick,
        disconnectSignal,
        closeNotify,
    } = useSocketEditing({ user, assignedArea })


    useEffect(() => {
        if (!assignedArea.name) return;
        socket.emit('register-user', {
            userId: id,
            name: name,
            area: assignedArea.name,
        })
    }, [])

    useEffect(() => {
        socket.on("editing", handleEditing);
        return () => {
            socket.off("editing"); // Clean up on unmount
        };
    }, [socket]);

    // AUTHENTICATE
    useEffect(() => {
        socket.emit("authenticate", {
            id: id,
            area: assignedArea?.name,
        });
    }, []);

    const handleEditing = ({ editable, showEdit, editorName, editorId }) => {
        setDisabled(!editable);
        setShow(showEdit);
        setOpenNotify(editable ? false : true);
        setEditor(() => {
            return { editorName: editorName, editorId: editorId };
        });

        if (!editable) {
            return notify();
        }
    };

    const handleClose = () => {
        close;
        closeAlertDialog();
        // setOpenReq(false);
        // setItemReq({});
        // setActivity({});
        // setExpenseClass({});
        // setPin("");
    };

    const notify = () => setOpenNotify(true);

    const handleCloseSnack = () => {
        setEditor(null);
        setOpenNotify(false);
    };

    const disabledEditMode = () => {

        if (!APPLICATION_OBJECTIVE_ID) return false

        // if (aopStatus === "draft") return false;

        // const noRemarks = !remarks || remarks.length === 0;
        // const noComments = !comments || comments.length === 0;

        // if (noRemarks && noComments) return true;

        return disabled;
    }

    const hasData =
        activity?.users?.length > 0 ||
        activity?.designations?.length > 0 ||
        activity?.areas?.length > 0;

    // alert for saving assignment
    const handleSaveAssignment = () => {
        if (!activity) {
            console.warn("No responsible person data found for this activity.");
            return;
        }

        if (!hasData) {
            console.warn("No users, designations, or areas selected.");
            return;
        }

        // setAssignmentStatus(activityId, true);
        // alert('saving responsible person');
        setOpenConfirmDialog(true);

        const data = {
            status: "warning",
            title: "Assigning selected responsible people",
            description:
                "This will redirect you back to AOP Objectives",
        };

        setConfirmationModal(data);
    };

    //proceed to objectives page/step 1
    const proceed = () => {
        setIsLoading(true);

        setTimeout(() => {
            navigate(`/aop-management/`);
            closeConfirmation();
        }, 1000);
    };

    const handleCancel = (activityId) => {
        resetValues(activityId);
        navigate(-1);
        // navigate(`/aop-create/activities/${rowId}`);
    };

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.TABLE_PERSON_HEADER}
                description={AOP_CONSTANTS.TABLE_PERSON_SUBHEADING}
                actions={
                    <>
                        <ButtonComponent
                            label={show ? "Exit Edit Mode" : "Edit Resources"}
                            onClick={() => (show ? disconnectSignal() : handleEditClick())}
                            isLoading={editLoad}
                            color={show ? "danger" : "primary"}
                            variant={'outlined'}
                            disabled={disabledEditMode()}
                        />

                    </>
                }
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
                    <Grid item={"true"} xs={12} md={6}>
                        <PersonSection
                            isEditing={show}
                        />
                    </Grid>

                    <Grid item={"true"} xs={12} md={6}>
                        <DesignationSection
                            isEditing={show}
                        />
                    </Grid>
                    {/* 
                    <Grid item={"true"} xs={12} sm={2} md={4}>
                        <AreasSection />
                    </Grid> */}
                </Grid>

                <Stack
                    mt={2}
                    direction={"flex"}
                    alignItems={"center"}
                    justifyContent={"start"}
                    gap={1}
                >
                    {/* {isAssigned ? */}

                    {/* <ButtonComponent
            onClick={() => navigate(-1)}
            label={"Back to activities"}
            size={"md"}
            variant={"outlined"}
          /> */}

                    {!APPLICATION_OBJECTIVE_ID ? (
                        <ButtonComponent
                            onClick={() => handleCancel(activityId)}
                            label={"Cancel Selection"}
                            size={"md"}
                            variant={"outlined"}
                        />
                    ) : (
                        <ButtonComponent
                            onClick={() => navigate(-1)}
                            label={"Back to activities"}
                            size={"md"}
                            variant={"outlined"}
                        />
                    )}

                    <ButtonComponent
                        label={"Save Assignment"}
                        size={"md"}
                        variant={"solid"}
                        onClick={() => handleSaveAssignment()}
                        disabled={!hasData}
                    />
                </Stack>
            </ContainerComponent>

            {/* Confirmation modal to proceed */}
            {
                openConfirmDialog && (
                    <ConfirmationModalComponent
                        leftButtonLabel={"Back"}
                        rightButtonAction={() => proceed(200)}
                        rightButtonLabel="Proceed"
                        isLoading={isLoading}
                    />
                )
            }

            <AlertDialogComponent
                leftButtonAction={() => handleClose()}
            />

            <Snackbar
                open={openNotify}
                // autoHideDuration={2000}
                onClose={handleCloseSnack}
                color="success"
            >
                <Alert
                    onClose={handleCloseSnack}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {editor?.editorName}
                    is currently editing
                </Alert>
            </Snackbar>
        </Fragment >
    );
};

export default Responsible;
