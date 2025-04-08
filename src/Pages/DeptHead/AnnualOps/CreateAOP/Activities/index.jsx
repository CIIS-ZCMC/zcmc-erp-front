import { useState, Fragment } from 'react';

import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';

import { Box, Stack, Typography, Divider } from '@mui/joy';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

import ButtonComponent from '../../../../../Components/Common/ButtonComponent';
import SheetComponent from '../../../../../Components/Common/SheetComponent';
import IconButtonComponent from '../../../../../Components/Common/IconButtonComponent';
import EditableTableComponent from '../../../../../Components/Common/Table/EditableTableComponent';
import TableRow from './TableRow';
import ContainerComponent from '../../../../../Components/Common/ContainerComponent';

import { AOP_CONSTANTS } from '../../../../../Data/constants';
import { ACTIVITIES_HEADER } from '../../../../../Data/Columns';

const Activities = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const { objectiveId } = useParams();
    const currentPath = location.pathname;
    const childPath = currentPath === `/aop-create/activities/${objectiveId}`

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapseClick = () => {
        setIsCollapsed(prev => !prev)
    };

    const [rows, setRows] = useState([
        {
            id: 1,
            activities: "Training Workshop",
            startMonth: "January",
            endMonth: "March",
            quarter1: 100,
            quarter2: 50,
            quarter3: 'N/A',
            quarter4: 'N/A',
            cost: 5000,
            isGadRelated: true,
            responsiblePerson: "John Doe",
        },

        {
            id: 2,
            activities: "Training Workshop",
            startMonth: "January",
            endMonth: "March",
            quarter1: 100,
            quarter2: 50,
            quarter3: 'N/A',
            quarter4: 'N/A',
            cost: 5000,
            isGadRelated: true,
            responsiblePerson: "John Doe",
        },
    ]);

    const [editRowId, setEditRowId] = useState(null);
    const [editField, setEditField] = useState({});

    const handleEdit = (id, field, value) => {
        setEditField({ id, field, value });
    };

    const handleBlur = () => {
        if (editField.id !== undefined) {
            setRows((prev) =>
                prev.map((row) =>
                    row.id === editField.id
                        ? { ...row, [editField.field]: editField.value }
                        : row
                )
            );
            setEditRowId(null);
            setEditField({});
        }
    };

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
                                    onClick={() => setOpen(true)}
                                    label={"Add an Activity"}
                                    endDecorator={<Plus size={16} />}
                                />
                            </Stack>
                        }
                    >
                        <EditableTableComponent
                            columns={ACTIVITIES_HEADER}
                            stripe={'even'}
                            hoverRow
                            isLoading={false}
                            bordered={true}
                            stickLast
                            tableRow={
                                <TableRow
                                    rows={rows}
                                    handleEdit={handleEdit}
                                    handleBlur={handleBlur}
                                    editField={editField}
                                    editRowId={editRowId}
                                    setEditRowId={setEditRowId}
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