import { useState, Fragment, useEffect } from 'react';

import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';

import { Box, Stack } from '@mui/joy';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

import ButtonComponent from '../../../../../../../Components/Common/ButtonComponent';
import SheetComponent from '../../../../../../../Components/Common/SheetComponent';
import IconButtonComponent from '../../../../../../../Components/Common/IconButtonComponent';
import ContainerComponent from '../../../../../../../Components/Common/ContainerComponent';
import EditableTableComponent from '../../../../../../../Components/Common/Table/EditableTableComponent';

import TableRow from './TableRow';

import { AOP_CONSTANTS } from '../../../../../../../Data/constants';
import { AOP_ACTIVITIES_HEADER } from '../../../../../../../Data/Columns';

import useAOPObjectivesHooks from '../../../../../../../Hooks/AOP/AOPObjectivesHook';

const Activities = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const { objectiveId } = useParams();
    const currentPath = location.pathname;
    const childPath = currentPath === `/aop-create/activities/${objectiveId}`

    const { aopObjectives, addActivity, deleteActivity, updateActivityField } = useAOPObjectivesHooks();

    const selectedObjective = aopObjectives.find(obj => obj.id === Number(objectiveId));
    const aopActivities = selectedObjective?.activities || [];

    useEffect(() => {
        // console.log(aopActivities)
    }, [])

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapseClick = () => {
        setIsCollapsed(prev => !prev)
    };

    const [editRowId, setEditRowId] = useState(null);

    return (
        <Fragment>

            <ContainerComponent
                title={AOP_CONSTANTS.MANAGE_ACTIVITIES_HEADER}
                description={AOP_CONSTANTS.MANAGE_ACTIVITIES_SUBHEADER}
                isTable={false}
                actions={
                    <Stack>
                        <IconButtonComponent
                            variant={'text'}
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    {isCollapsed && <Box>
                        <Stack
                            direction={'row'}
                            gap={2}
                        >
                            <SheetComponent variant={"outlined"}>
                                Content 1
                            </SheetComponent>

                            <SheetComponent variant={"outlined"}>
                                Content 2
                            </SheetComponent>

                            <SheetComponent variant={"outlined"}>
                                Content 3
                            </SheetComponent>
                        </Stack>
                    </Box>}

                </Box>
            </ContainerComponent>

            <Box sx={{ m: 3 }} />

            {childPath &&
                <>
                    <ContainerComponent
                        title={AOP_CONSTANTS.TABLE_ACTIVITY_HEADER}
                        description={AOP_CONSTANTS.TABLE_ACTIVITY_SUBHEADING}
                        isTable={true}
                        actions={
                            <Stack>
                                <ButtonComponent
                                    onClick={() => addActivity(Number(objectiveId))}
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
                                    handleChange={updateActivityField}
                                    objectiveId={selectedObjective?.id}
                                    editRowId={editRowId}
                                    setEditRowId={setEditRowId}
                                    deleteRow={deleteActivity}
                                    rows={aopActivities}
                                />
                            }
                        />

                        <Stack
                            mt={2}
                            direction={'flex'}
                            alignItems={'center'}
                            justifyContent={'start'}
                            gap={1}
                        >
                            <ButtonComponent
                                label={'Back'}
                                size={'md'}
                                variant={'outlined'}
                                onClick={() => navigate(`/aop-create`)}
                            />
                        </Stack>
                    </ContainerComponent>

                </>

            }
            <Outlet />

        </Fragment>
    )
}

export default Activities