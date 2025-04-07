import React, { Fragment, useState } from 'react'

import { Stack } from '@mui/joy'
import { Plus } from 'lucide-react'

import EditableTableComponent from '../../../../../../Components/Common/Table/EditableTableComponent'
import ContainerComponent from '../../../../../../Components/Common/ContainerComponent'
import ButtonComponent from '../../../../../../Components/Common/ButtonComponent'

import TableRow from './TableRow'

import { AOP_CONSTANTS } from '../../../../../../Data/constants'
import { AOP_STEP_HEADER } from '../../../../../../Data/Columns'

const Resources = () => {

    const [rows, setRows] = useState([
        {
            id: 1,
            item_name: "Strategic",
            resource_type: 'Resource Type',
            expense_class: 'Expense Class',
            jan: 'N/A',
            feb: 'N/A',
            mar: 'N/A',
            apr: 'N/A',
            may: 'N/A',
            jun: 'N/A',
            jul: 'N/A',
            aug: 'N/A',
            sep: 'N/A',
            oct: 'N/A',
            nov: 'N/A',
            dec: 'N/A',
            procurement_mode: 'Mode'
        },
    ]);

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.TABLE_RESOURCES_HEADER}
                description={AOP_CONSTANTS.TABLE_RESOURCES_SUBHEADING}
                actions={
                    <Stack>
                        <ButtonComponent
                            // onClick={() => setOpen(true)}
                            label={"Add Resource"}
                            endDecorator={<Plus size={16} />}
                        />
                    </Stack>
                }
            >
                <EditableTableComponent
                    tableHeader={AOP_STEP_HEADER}
                    stripe={'odd'}
                    haverRow
                    tableRow={
                        <TableRow
                            rows={rows}
                        // handleEdit={handleEdit}
                        // handleBlur={handleBlur}
                        // editField={editField}
                        // editRowId={editRowId}
                        // setEditRowId={setEditRowId}
                        />
                    }
                />

            </ContainerComponent>
        </Fragment>
    )
}

export default Resources