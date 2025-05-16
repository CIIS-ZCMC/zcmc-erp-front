import React, { Fragment, useEffect, useState } from 'react'

import { Outlet, useParams, useLocation, useNavigate } from 'react-router-dom'
import { Stack } from '@mui/joy'
import { Plus } from 'lucide-react'

import EditableTableComponent from '../../../../../../../../Components/Common/Table/EditableTableComponent';
import ContainerComponent from '../../../../../../../../Components/Common/ContainerComponent';
import ButtonComponent from '../../../../../../../../Components/Common/ButtonComponent';

import TableRow from './TableRow'

import { AOP_CONSTANTS } from '../../../../../../../../Data/constants';
import { AOP_RESOURCE_HEADER } from '../../../../../../../../Data/Columns';

import useResourceHook from '../../../../../../../../Hooks/ResourceHook';

const Resources = () => {

    const location = useLocation();
    const { activityId, objectiveId } = useParams();
    const currentPath = location.pathname;
    const childPath = currentPath === `/aop-create/activities/${objectiveId}/resources/${activityId}`

    const { resources } = useResourceHook();

    useEffect(() => {
        console.log(resources)
    }, [resources])

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
                    columns={AOP_RESOURCE_HEADER}
                    stripe={'odd'}
                    haverRow
                    tableRow={
                        <TableRow
                            rows={resources}
                        // handleEdit={handleEdit}
                        // handleBlur={handleBlur}
                        // editField={editField}
                        // editRowId={editRowId}
                        // setEditRowId={setEditRowId}
                        />
                    }
                />
            </ContainerComponent>

            <Outlet />
        </Fragment>
    )
}

export default Resources