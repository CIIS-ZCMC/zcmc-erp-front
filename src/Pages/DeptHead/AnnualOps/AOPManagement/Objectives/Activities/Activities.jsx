import { useState, Fragment, useEffect } from "react";

import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";

import { Box, Stack, Typography } from "@mui/joy";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

import ButtonComponent from "../../../../../../Components/Common/ButtonComponent";
import SheetComponent from "../../../../../../Components/Common/SheetComponent";
import IconButtonComponent from "../../../../../../Components/Common/IconButtonComponent";
import ContainerComponent from "../../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../../Components/Common/Table/EditableTableComponent";

import ActivitiesTable from "./ActivitiesTable";

import { AOP_CONSTANTS } from "../../../../../../Data/constants";
import { AOP_ACTIVITIES_HEADER } from "../../../../../../Data/Columns";

import useActivitiesHook from "../../../../../../Hooks/ActivitiesHook";
import useObjectivesHook from "../../../../../../Hooks/ObjectivesHook";

const Activities = () => {

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

    console.log(objectiveData)

    const { objectiveId } = params; //objective Id lang for url path pero yung value is from row
    const currentPath = location.pathname;
    const childPath = currentPath === `/aop-management/activities/${objectiveId}`;
    const [loading, setLoading] = useState(true);

    const hasActivitiesForParent = activities.some((act) => act.parentId === parentId);

    // useEffect(() => {
    //     console.log('location', location.state)
    // })

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

    return (
        <Fragment>
            {childPath && (
                <Fragment>
                    <ContainerComponent
                        title={`${AOP_CONSTANTS.MANAGE_ACTIVITIES_HEADER} row ${rowId} - ${functionType?.label || "please select a function type"}`}
                        description={AOP_CONSTANTS.MANAGE_ACTIVITIES_SUBHEADER}
                        isTable={false}
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
                                                    {functionType.label || "please select a function type"}
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
                            <Stack>
                                <ButtonComponent
                                    onClick={() => addActivity(current_parent_id ? current_parent_id : parentId)}
                                    label={"Add an Activity"}
                                    endDecorator={<Plus size={16} />}
                                />
                            </Stack>
                        }
                    >
                        <EditableTableComponent
                            columns={AOP_ACTIVITIES_HEADER}
                            tableRow={
                                <ActivitiesTable
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
            <Outlet />
        </Fragment>
    );
};

export default Activities;
