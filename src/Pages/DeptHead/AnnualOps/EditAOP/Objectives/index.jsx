import { Fragment, useEffect } from 'react'

import { Stack, Link } from '@mui/joy';
import { ExternalLink, Plus } from 'lucide-react';

import ContainerComponent from '../../../../../Components/Common/ContainerComponent'
import EditableTableComponent from '../../../../../Components/Common/Table/EditableTableComponent';
import ButtonComponent from '../../../../../Components/Common/ButtonComponent';

import useFunctionTypeHook from '../../../../../Hooks/FunctionTypeHook';
import useAOPObjectivesHooks from '../../../../../Hooks/AOP/AOPObjectivesHook';
import useObjectivesHook from '../../../../../Hooks/ObjectivesHook';
import useActivitiesHook from '../../../../../Hooks/ActivitiesHook';
import useModalHook from '../../../../../Hooks/ModalHook';


import TableRow from './TableRow'

import { AOP_CONSTANTS } from '../../../../../Data/constants';
import { AOP_HEADER } from '../../../../../Data/Columns';

const index = () => {

    const { aopObjectives, deleteObjective } = useAOPObjectivesHooks();
    const { function_types, getFunctionType } = useFunctionTypeHook();
    const { objectives, addObjective } = useObjectivesHook();
    const { findActivitiesByObjectiveID, activities } = useActivitiesHook();
    const { setAlertDialog } = useModalHook();

    // check pag walang objectives then add default objective
    useEffect(() => {
        if (objectives.length === 0) {
            addObjective();
        }
    }, [objectives, addObjective]);

    useEffect(() => {
        const params = { with_sub_data: 1 };
        getFunctionType(params, (status, message) => {
            // console.log(status)
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            setisLoading(false);
        });
    }, []);

    useEffect(() => {
        console.log(objectives)
    }, [objectives])

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.MANAGE_OBJECTIVES_HEADER}
                description={AOP_CONSTANTS.MANAGE_OBJECTIVES_SUBHEADER}
                actions={
                    <Stack>
                        <ButtonComponent
                            onClick={addObjective}
                            label={"Add an Objective"}
                            endDecorator={<Plus size={16} />}
                        />
                    </Stack>
                }
            >

                <EditableTableComponent
                    columns={AOP_HEADER}
                    secondaryHeader={
                        <Link
                            component="button"
                            // onClick={() => handleOpenDialog()}
                            pb={1}>
                            <Stack direction={"row"} gap={1} alignItems={"center"}>
                                Update Mission
                                <ExternalLink size={16} />
                            </Stack>
                        </Link>
                    }
                    tableRow={
                        <TableRow
                            rows={objectives}
                            function_types={function_types}
                        />
                    }
                    stickLast
                />


            </ContainerComponent>
        </Fragment>
    )
}

export default index
