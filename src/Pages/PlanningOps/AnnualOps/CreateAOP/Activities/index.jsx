import { useState } from 'react';

import { Box, Stack, Typography, Divider } from '@mui/joy';
import { ChevronDown, ChevronUp } from 'lucide-react';

import Header from '../../../../../Layout/Header';

import SheetComponent from '../../../../../Components/Common/SheetComponent';
import IconButtonComponent from '../../../../../Components/Common/IconButtonComponent';
import EditableTableComponent from '../../../../../Components/Common/EditableTableComponent';
import TableRow from '../TableRow';

import { AOP_CONSTANTS } from '../../../../../Data/constants';
import { ACTIVITIES_HEADER } from '../../../../../Data';

const Activities = () => {

    const [isCollapsed, setIsCollapsed] = useState(false)

    const handleCollapseClick = () => {
        setIsCollapsed(prev => !prev)
    }

    const [rows, setRows] = useState([
        { id: 1, functionType: "Strategic", objectives: 'Objective 1', successIndicator: 'Success Indicator 1' },
        { id: 2, functionType: "Core", objectives: 'Objective 2', successIndicator: 'Success Indicator 2' },
        { id: 3, functionType: "Support", objectives: 'Objective 3', successIndicator: 'Success Indicator 3' },
    ]);

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