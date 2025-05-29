import { Fragment, useState } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Stack, Box } from '@mui/joy';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

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

    const parentId = location.state?.parentId;
    const objectiveRowId = location.state?.rowId;

    const { objectiveId } = params; //objective Id lang for url path pero yung value is from row

    const currentPath = location.pathname === `/aop-edit/1/activities/${objectiveId}`;

    const { activities, addActivity } = useActivitiesHook();

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapseClick = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <Fragment>
            {currentPath &&
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
                                    onClick={() => addActivity(parentId)}
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
                                    parentId={parentId ?? current_parent_id}
                                    objectiveRowId={objectiveRowId ?? current_row_id}
                                    rows={activities}
                                // deleteRow={removeActivity}
                                />
                            }
                            stickLast
                        />

                    </ContainerComponent>



                </Fragment>
            }

            <Outlet />
        </Fragment>
    )
}

export default EditActivities
