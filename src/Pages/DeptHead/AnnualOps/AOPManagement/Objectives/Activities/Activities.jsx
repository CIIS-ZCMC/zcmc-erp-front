import { useState, Fragment, useEffect } from "react";

import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom";

import { Box, Stack } from "@mui/joy";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

import ButtonComponent from "../../../../../../Components/Common/ButtonComponent";
import SheetComponent from "../../../../../../Components/Common/SheetComponent";
import IconButtonComponent from "../../../../../../Components/Common/IconButtonComponent";
import ContainerComponent from "../../../../../../Components/Common/ContainerComponent";
import EditableTableComponent from "../../../../../../Components/Common/Table/EditableTableComponent";

import ActivitiesTable from "./ActivitiesTable";

import { AOP_CONSTANTS } from "../../../../../../Data/constants";
import { AOP_ACTIVITIES_HEADER } from "../../../../../../Data/Columns";

import useAOPObjectivesHooks from "../../../../../../Hooks/AOP/AOPObjectivesHook";
import useActivitiesHook from "../../../../../../Hooks/ActivitiesHook";
import useObjectivesHook from "../../../../../../Hooks/ObjectivesHook";
import useResourceHook from "../../../../../../Hooks/ResourceHook";
import useResponsiblePeopleHook from "../../../../../../Hooks/ResponsiblePeopleHook";

const Activities = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const { current_parent_id, setCurrentObjective, current_row_id, setCurrentRowId, clearParentId } = useObjectivesHook();
    const { activities, addActivity, updateActivityField, removeActivity, findActivitiesByObjectiveID } = useActivitiesHook();
    const { resources, removeItemResource } = useResourceHook();
    const { removeMultipleResponsiblePersonnel } = useResponsiblePeopleHook();
    const { aopObjectives } = useAOPObjectivesHooks();

    //check for objective id from location state if null then it will set the current_parent_id
    const parentId = location.state?.objectiveParentId || current_parent_id;
    const objectiveRowId = location.state?.rowId;

    const { objectiveId } = params; //objective Id lang for url path pero yung value is from row
    const currentPath = location.pathname;
    const childPath = currentPath === `/aop-management/activities/${objectiveId}`;
    const [loading, setLoading] = useState(true);

    const hasActivitiesForParent = activities.some((act) => act.parentId === parentId);

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

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapseClick = () => {
        setIsCollapsed((prev) => !prev);
    };

    const handleNavigateBack = () => {
        clearParentId()
        navigate(`/aop-management`, { state: { ...location.state } })
    }

    const deleteActivities = (objectiveId) => {

        const relatedActivities = findActivitiesByObjectiveID(objectiveId);

        console.log(relatedActivities)
        console.log(objectiveId)

        const activityIds = relatedActivities.map((act) => act.id);

        // Remove resources by parentId
        const resourceIdsToDelete = resources
            .filter((res) => activityIds.includes(res.parentId))
            .map((res) => res.id);

        if (resourceIdsToDelete.length > 0) {
            removeItemResource(resourceIdsToDelete);
        }

        // Remove responsible people in batch by parentId
        if (activityIds.length > 0) {
            removeMultipleResponsiblePersonnel(activityIds); // NEW batch delete!
        }

        // Remove activities
        activityIds.forEach((id) => removeActivity(id));
    }

    return (
        <Fragment>
            {childPath && (
                <Fragment>
                    <ContainerComponent
                        title={AOP_CONSTANTS.MANAGE_ACTIVITIES_HEADER}
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
                                        <SheetComponent variant={"outlined"}>Content 1</SheetComponent>

                                        <SheetComponent variant={"outlined"}>Content 2</SheetComponent>

                                        <SheetComponent variant={"outlined"}>Content 3</SheetComponent>
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
                                    deleteRow={deleteActivities}
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
