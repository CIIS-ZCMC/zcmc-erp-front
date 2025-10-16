import React, { useEffect } from 'react'

import { Box } from '@mui/material'

import SheetComponent from './SheetComponent'
import TableComponent from './TableComponent'

const EditableTableComponent = ({ columns, tableRow }) => {

    const lastColumnWidth = columns[columns.length - 1]?.width || "144px";

    return (
        <Box sx={{ width: "100%", overflow: "auto" }}>
            <SheetComponent
                columns={columns}
                lastColumnWidth={lastColumnWidth}
            >
                <TableComponent
                    columns={columns}
                    rows={tableRow}
                />
            </SheetComponent>
        </Box>
    )
}

export default EditableTableComponent