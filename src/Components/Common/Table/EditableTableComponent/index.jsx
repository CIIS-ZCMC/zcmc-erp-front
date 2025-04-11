import React from 'react'

import { Box } from '@mui/material'

import SheetComponent from './SheetComponent'
import TableCompnent from './TableComponent'

const EditableTableComponent = () => {
    return (
        <Box sx={{ width: "100%", overflow: "auto" }}>
            <SheetComponent>
                <TableCompnent />
            </SheetComponent>
        </Box>
    )
}

export default EditableTableComponent