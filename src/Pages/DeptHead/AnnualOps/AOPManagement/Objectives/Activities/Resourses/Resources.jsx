import React, { Fragment, useEffect, useState } from "react";

import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { Stack, Snackbar, Alert } from "@mui/joy";
import { Plus } from "lucide-react";

import EditableTableComponent from "@Components/Common/Table/EditableTableComponent";
import ContainerComponent from "../../../../../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../../../../../Components/Common/ButtonComponent";
import BoxComponent from "../../../../../../../Components/Common/Card/BoxComponent";
import { ThreeDotsLoader } from "../../../../../../../Components/Common/Loading/ThreeDotsLoader";
import AlertDialogComponent from "../../../../../../../Components/Common/Dialog/AlertDialogComponent";

import ResourcesTable from './ResourcesTable';

import { AOP_CONSTANTS } from "../../../../../../../Data/constants";
import { AOP_RESOURCE_HEADER } from "../../../../../../../Data/Columns";

import useResourceHook from "../../../../../../../Hooks/ResourceHook";
import useItemsHook from "../../../../../../../Hooks/ItemsHook";
import usePurchaseTypeHook from "../../../../../../../Hooks/PurchaseTypeHook";
import useSocketEditing from "../../../../../../../Hooks/Socket/useSocketEditing";

import { useAuth } from "../../../../../../../Store/AuthStore";
import { socket } from "../../../../../../../Services/Socket";

import { localStorageGetter } from "../../../../../../../Utils/LocalStorage";

import { disabledEditMode } from "../../../../../../../Utils/aopUtils";

const Resources = () => {

    const APPLICATION_OBJECTIVE_ID = localStorageGetter('aop-app-id');
    const remarks = localStorageGetter("remarks");
    const comments = localStorageGetter("all_comments");
    const aopStatus = localStorage.getItem("aop-status");

    const { resources, addResource } = useResourceHook();
    const { items, getItems } = useItemsHook();
    const { purchase_types, getPurchaseType } = usePurchaseTypeHook();

    const navigate = useNavigate();
    const location = useLocation();
    const parentId = location.state?.parentId; // refers to objectiveId as parent
    const objectiveRowId = location.state?.objectiveRowId;

    const { user } = useAuth();
    const { name, id, assignedArea } = user ?? {};

    const [isLoading, setIsLoading] = useState(false);

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
        console.log('aop status', aopStatus)
        console.log('disabled', disabled)
    }, [disabled, aopStatus])

    useEffect(() => {
        if (!assignedArea?.name) return;
        socket.emit("register-user", {
            userId: id,
            name: name,
            area: assignedArea.name,
        });
    }, [assignedArea]);

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

    useEffect(() => {
        getItems((status, message, data) => {
            if (status !== 200) {
                console.error("Failed to fetch items:", message);
            }
        });
    }, []);

    useEffect(() => {
        // console.log(resources)
        setIsLoading(true)
        getPurchaseType((status, message) => {
            setIsLoading(false);
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
        });
    }, [resources]);

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.TABLE_RESOURCES_HEADER}
                description={AOP_CONSTANTS.TABLE_RESOURCES_SUBHEADING}
                sx={{ mt: 3 }}
                actions={
                    <Stack
                        direction={'row'}
                        spacing={1}
                    >
                        <ButtonComponent
                            onClick={() => navigate(`/aop-management/activities/${location.state.objectiveRowId}/items/${location.state.activityRowId}`, { state: { ...location.state } })}
                            label={"Add Resource"}
                            endDecorator={<Plus size={16} />}
                            disabled={!show || disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled, comments, disabled)}
                        />
                        <ButtonComponent
                            // onClick={() => }
                            label={show ? "Exit Edit Mode" : "Edit Resources"}
                            onClick={() => (show ? disconnectSignal() : handleEditClick())}
                            isLoading={editLoad}
                            color={show ? "danger" : "primary"}
                            variant="outlined"
                            disabled={disabledEditMode(APPLICATION_OBJECTIVE_ID, remarks, comments, disabled, comments, disabled)}
                        />

                    </Stack>
                }
            >
                {/* {isLoading ?
                    <BoxComponent
                        mt={3}
                        height={"65vh"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignContent={"center"}
                    >
                        <ThreeDotsLoader />
                    </BoxComponent>
                    :
                    <EditableTableComponent
                        columns={AOP_RESOURCE_HEADER}
                        stripe={"odd"}
                        haverRow
                        tableRow={
                            <ResourcesTable
                                rows={resources.filter((item) => item.parentId === parentId)}
                                parentId={parentId}
                                resources={items}
                                purchase_types={purchase_types}
                            />
                        }
                    />
                } */}

                <EditableTableComponent
                    columns={AOP_RESOURCE_HEADER}
                    stripe={"odd"}
                    haverRow
                    tableRow={
                        <ResourcesTable
                            isEditing={show}
                            editLoad={editLoad}
                            rows={resources.filter((item) => item.parentId === parentId)}
                            parentId={parentId}
                            resources={items}
                            purchase_types={purchase_types}
                        />
                    }
                />

                <Stack
                    mt={2}
                    direction={"flex"}
                    alignItems={"center"}
                    justifyContent={"start"}
                    gap={1}
                >
                    <ButtonComponent
                        label={"Back"}
                        size={"md"}
                        variant={"outlined"}
                        onClick={() => navigate(`/aop-management/activities/${objectiveRowId}`)}
                    />
                </Stack>
            </ContainerComponent>

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

            <Outlet />
        </Fragment >
    );
};

export default Resources;
