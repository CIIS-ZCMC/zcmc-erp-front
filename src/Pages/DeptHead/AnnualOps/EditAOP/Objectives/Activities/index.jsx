import { Fragment, useEffect, useState } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Stack, Box } from '@mui/joy';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { v4 as uuid } from 'uuid';

import useActivitiesHook from '../../../../../../Hooks/ActivitiesHook';

import ContainerComponent from '../../../../../../Components/Common/ContainerComponent';
import IconButtonComponent from '../../../../../../Components/Common/IconButtonComponent';
import SheetComponent from '../../../../../../Components/Common/SheetComponent';
import ButtonComponent from '../../../../../../Components/Common/ButtonComponent';
import EditableTableComponent from '../../../../../../Components/Common/Table/EditableTableComponent';

import TableRow from './TableRow';

import { AOP_CONSTANTS } from '../../../../../../Data/constants';
import { AOP_ACTIVITIES_HEADER } from '../../../../../../Data/Columns';

const EditActivities = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const aopId = location.state?.aopId;
    const objectiveRowId = location.state?.rowId;
    const objectiveId = location.state.objectiveId;

    const currentPath = location.pathname;
    const childPath = currentPath === `/aop-edit/activities/${objectiveRowId}`;

    const { activities, setUpdatedActivities, addActivity } = useActivitiesHook();

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapseClick = () => {
        setIsCollapsed((prev) => !prev);
    };

    // useEffect(() => {
    //     //  console.log(activities);
    //     const hasActivitiesForParent = activities.some(
    //         (act) => act.parentId === parentId
    //     );
    //     if (!hasActivitiesForParent && parentId) {
    //         addActivity(parentId ?? current_parent_id);
    //     }
    // }, [activities, parentId]);

    const activitiesRowData = activities.map((data, index) => ({
        ...data,
        rowId: index + 1,
        parentId: objectiveId,
    }))

    useEffect(() => {
        // console.log('updated Activities', activitiesRowData)
        setUpdatedActivities(activitiesRowData)
    }, [])

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
                                    onClick={() => addActivity(objectiveId)}
                                    label={"Add an Activity"}
                                    endDecorator={<Plus size={16} />}
                                />
                            </Stack>
                        }
                    >

                        <EditableTableComponent
                            columns={AOP_ACTIVITIES_HEADER}
                            tableRow={
                                <TableRow
                                    // handleChange={updateActivityField}
                                    // aopId={aopId ?? current_parent_id}
                                    aopRowId={aopId}
                                    objectiveRowId={objectiveRowId ?? current_row_id}
                                    parentId={objectiveId}
                                    rows={activities}
                                // deleteRow={removeActivity}
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
                                onClick={() => navigate(-1)}
                            />
                        </Stack>

                    </ContainerComponent>
                </Fragment>
            )}
            <Outlet />
        </Fragment>
    )
}

export default EditActivities
