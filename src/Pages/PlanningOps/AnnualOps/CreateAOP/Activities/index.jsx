import { useState } from 'react';

import { Box, Stack, Typography, Divider } from '@mui/joy';
import { ChevronDown, ChevronUp } from 'lucide-react';

import Header from '../../../../../Layout/Header';

import SheetComponent from '../../../../../Components/Common/SheetComponent';
import IconButtonComponent from '../../../../../Components/Common/IconButtonComponent';
import EditableTableComponent from '../../../../../Components/Common/Table/EditableTableComponent';
import TableRow from './TableRow';

import { AOP_CONSTANTS } from '../../../../../Data/constants';
import { ACTIVITIES_HEADER } from '../../../../../Data';

const Activities = () => {

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
        <>
            <SheetComponent
                variant={"outlined"}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Stack>
                        <Typography level="title-md">
                            {AOP_CONSTANTS.MANAGE_ACTIVITIES_HEADER}
                        </Typography>
                        <Typography level="body-sm">
                            {AOP_CONSTANTS.MANAGE_ACTIVITIES_SUBHEADER}
                        </Typography>
                    </Stack>

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
                </Box>

                {isCollapsed && <Box
                    sx={{
                        mt: 2,
                    }}
                >
                    <Divider />

                    <Stack
                        direction={'row'}
                        gap={2}
                        mt={2}
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
            </SheetComponent >

            <EditableTableComponent
                tableHeader={ACTIVITIES_HEADER}
                stripe={'odd'}
                hoverRow
                isLoading={false}
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

        </>
    )
}

export default Activities