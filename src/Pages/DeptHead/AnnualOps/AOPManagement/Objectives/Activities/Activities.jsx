import { useState, Fragment, useEffect } from "react";

import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";

import { Box, Stack, Typography, Snackbar, Alert } from "@mui/joy";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

import ButtonComponent from "../../../../../../Components/Common/ButtonComponent";
import SheetComponent from "../../../../../../Components/Common/SheetComponent";
import IconButtonComponent from "../../../../../../Components/Common/IconButtonComponent";
import ContainerComponent from "../../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../../Components/Common/Table/EditableTableComponent";
import AlertDialogComponent from "../../../../../../Components/Common/Dialog/AlertDialogComponent";;

import ActivitiesTable from "./ActivitiesTable";

import { AOP_CONSTANTS } from "../../../../../../Data/constants";
import { AOP_ACTIVITIES_HEADER } from "../../../../../../Data/Columns";

import useActivitiesHook from "../../../../../../Hooks/ActivitiesHook";
import useObjectivesHook from "../../../../../../Hooks/ObjectivesHook";

import { useAuth } from "../../../../../../Store/AuthStore";
import { socket } from "../../../../../../Services/Socket";
import { localStorageGetter } from "../../../../../../Utils/LocalStorage";

const Activities = () => {

    const APPLICATION_OBJECTIVE_ID = localStorageGetter('aop-app-id');
    const remarks = localStorageGetter("remarks");
    const comments = localStorageGetter("all_comments");
    const aopStatus = localStorage.getItem("aop-status");

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const { objectives, current_parent_id, setCurrentObjective, current_row_id, setCurrentRowId, clearParentId } = useObjectivesHook();
    const { activities, addActivity, updateActivityField, } = useActivitiesHook();

    //check for objective id from location state if null then it will set the current_parent_id
    const parentId = location.state?.objectiveParentId || current_parent_id;
    const objectiveRowId = location.state?.rowId;

    const objectiveData = objectives.find(obj => obj.id === parentId);
    const { functionType, objective, successIndicator, othersObjective, othersSuccessIndicator, rowId } = objectiveData || {}

    const { objectiveId } = params; //objective Id lang for url path pero yung value is from row
    const currentPath = location.pathname;
    const childPath = currentPath === `/aop-management/activities/${objectiveId}`;
    const [loading, setLoading] = useState(true);
    const [openNotify, setOpenNotify] = useState(false);
    const [editor, setEditor] = useState(null);
    const [show, setShow] = useState(false);
    const [editLoad, setEditLoad] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const hasActivitiesForParent = activities.some((act) => act.parentId === parentId);

    const { user } = useAuth();
    const { name, id, assignedArea } = user ?? {};

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

    const editSignal = () => {
        socket.emit('start-edit', {
            userId: id,
            name: name,
            area: assignedArea?.name,
        })
    }

    const disconnectSignal = () => {
        socket.emit('stop-edit', {
            userId: id,
            area: assignedArea?.name,
        })
        setShow(false);
        handleCloseSnack();
    }

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

    const handleEditClick = () => {
        setEditLoad(true)
        setTimeout(() => {
            editSignal();
            setShow(true)
            setEditLoad(false)
        }, 300)
    }

    const handleClose = () => {
        close;
        closeAlertDialog();
        // setOpenReq(false);
        // setItemReq({});
        // setActivity({});
        // setExpenseClass({});
        // setPin("");
    };

    const handleCloseSnack = () => {
        setEditor(null);
        setOpenNotify(false);
    };

    const notify = () => setOpenNotify(true);

    useEffect(() => {
        if (!hasActivitiesForParent && parentId && loading) {
            addActivity(parentId ?? current_parent_id);
            setLoading(false);
        }
    }, [activities, parentId]);

    useEffect(() => {
        if (current_parent_id !== null) {
            if (current_parent_id !== parentId && !!parentId) {
                setCurrentObjective(parentId);
            }
        } else {
            setCurrentObjective(parentId);
        }

        if (current_row_id !== null) {
            if (current_parent_id !== objectiveRowId && !!objectiveRowId) {
                setCurrentRowId(objectiveRowId);
            }
        } else {
            setCurrentRowId(objectiveRowId)
        }
    }, []);

    // useEffect(() => {
    //     console.log('objectives', objectiveData)
    // }, [objectives])

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapseClick = () => {
        setIsCollapsed((prev) => !prev);
    };

    const handleNavigateBack = () => {
        clearParentId()
        navigate(`/aop-management`, { state: { ...location.state } })
    }

    const disabledEditMode = () => {

        if (!APPLICATION_OBJECTIVE_ID) return false

        // if (aopStatus === "draft") return false;

        // const noRemarks = !remarks || remarks.length === 0;
        // const noComments = !comments || comments.length === 0;

        // if (noRemarks && noComments) return true;

        return disabled;
    }

    return (
        <Fragment>
            {childPath && (
                <Fragment>
                    <ContainerComponent
                        title={`${AOP_CONSTANTS.MANAGE_ACTIVITIES_HEADER} row ${rowId} - ${functionType?.label || "please select a function type"}`}
                        description={AOP_CONSTANTS.MANAGE_ACTIVITIES_SUBHEADER}
                        isTable={false}
                        sx={{ mt: 3 }}
                        actions={
                            <Stack>
                                <IconButtonComponent
                                    variant={"text"}
                                    icon={isCollapsed ? <ChevronUp /> : <ChevronDown />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCollapseClick();
                                    }}
                                />
                            </Stack>
                        }
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            {isCollapsed && (
                                <Box>
                                    <Stack direction={"row"} gap={2}>
                                        <SheetComponent variant={"outlined"}>
                                            <Typography fontSize={14} fontWeight={600}>
                                                Function Type:
                                            </Typography>
                                            <Box width={"200px"} mt={1}>
                                                <Typography fontSize={12} color="primary">
                                                    {functionType?.label || "please select a function type"}
                                                </Typography>
                                            </Box>
                                        </SheetComponent>

                                        <SheetComponent variant={"outlined"}>
                                            <Typography fontSize={14} fontWeight={600}>
                                                Objective:
                                            </Typography>
                                            <Box width={"200px"} mt={1}>
                                                <Typography fontSize={12} color="primary">
                                                    {othersObjective ? othersObjective : objective?.description || "please select an objective"}
                                                </Typography>
                                            </Box>
                                        </SheetComponent>

                                        <SheetComponent variant={"outlined"}>
                                            <Typography fontSize={14} fontWeight={600}>
                                                Success Indicator:
                                            </Typography>
                                            <Box width={"200px"} mt={1}>
                                                <Typography fontSize={12} color="primary">
                                                    {othersSuccessIndicator ? othersSuccessIndicator : successIndicator?.description || "please select a success indicator"}
                                                </Typography>
                                            </Box>
                                        </SheetComponent>

                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </ContainerComponent>

                    <Box sx={{ m: 3 }} />

                    <ContainerComponent
                        title={AOP_CONSTANTS.TABLE_ACTIVITY_HEADER}
                        description={AOP_CONSTANTS.TABLE_ACTIVITY_SUBHEADING}
                        isTable={true}
                        actions={
                            <Stack
                                direction={'row'}
                                spacing={1}
                            >
                                <ButtonComponent
                                    onClick={() => addActivity(current_parent_id ? current_parent_id : parentId)}
                                    label={"Add an Activity"}
                                    endDecorator={<Plus size={16} />}
                                    disabled={disabledEditMode()}
                                />

                                <ButtonComponent
                                    // onClick={() => }
                                    label={show ? "Exit Edit Mode" : "Edit Activities"}
                                    onClick={() => (show ? disconnectSignal() : handleEditClick())}
                                    isLoading={editLoad}
                                    color={show ? "danger" : "primary"}
                                    variant="outlined"
                                    disabled={disabledEditMode()}
                                />
                            </Stack>
                        }
                    >
                        <EditableTableComponent
                            columns={AOP_ACTIVITIES_HEADER}
                            tableRow={
                                <ActivitiesTable
                                    isEditing={show}
                                    handleChange={updateActivityField}
                                    parentId={parentId ?? current_parent_id}
                                    objectiveRowId={objectiveRowId ?? current_row_id}
                                    rows={activities}
                                // deleteRow={deleteActivities}
                                />
                            }
                            stickLast
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
                                onClick={() => handleNavigateBack()}
                            />
                        </Stack>
                    </ContainerComponent>
                </Fragment>
            )}

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
        </Fragment>
    );
};

export default Activities;
