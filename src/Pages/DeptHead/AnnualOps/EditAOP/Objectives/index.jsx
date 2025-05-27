import { Fragment, useEffect, useMemo } from 'react'


import { Stack, Link } from '@mui/joy';
import { ExternalLink, Plus } from 'lucide-react';
import { useLocation, Outlet } from 'react-router-dom';
import { v4 as uuid } from "uuid";

import ContainerComponent from '../../../../../Components/Common/ContainerComponent'
import EditableTableComponent from '../../../../../Components/Common/Table/EditableTableComponent';
import ButtonComponent from '../../../../../Components/Common/ButtonComponent';

import useFunctionTypeHook from '../../../../../Hooks/FunctionTypeHook';
import useAOPObjectivesHooks from '../../../../../Hooks/AOP/AOPObjectivesHook';
import useObjectivesHook from '../../../../../Hooks/ObjectivesHook';
import useActivitiesHook from '../../../../../Hooks/ActivitiesHook';
import useModalHook from '../../../../../Hooks/ModalHook';

import { useAOPActions } from '../../../../../Hooks/AOP/AOPObjectivesHook';


import TableRow from './TableRow'

import { AOP_CONSTANTS } from '../../../../../Data/constants';
import { AOP_HEADER } from '../../../../../Data/Columns';

const index = () => {

    const location = useLocation();
    const id = location.state?.id;

    const { getSingleAOP } = useAOPActions();

    const { aopObjective, deleteObjective } = useAOPObjectivesHooks();
    const { function_types, getFunctionType } = useFunctionTypeHook();
    const { objectives, addObjective, setObjectives } = useObjectivesHook();
    const { findActivitiesByObjectiveID, activities } = useActivitiesHook();
    const { setAlertDialog } = useModalHook();

    const { application_objectives } = aopObjective;

    const formattedObjectives = useMemo(() => {
        return application_objectives?.map((aop, index) => ({
            id: uuid(),
            rowId: index + 1,
            functionTypeId: aop.function_type_id,
            objective: aop.objective_id,
            successIndicatorId: aop.success_indicator_id,
        })) || [];

    }, [application_objectives]);

    useEffect(() => {
        setObjectives(formattedObjectives)
    }, [formattedObjectives])

    // check pag walang objectives then add default objective
    useEffect(() => {
        if (objectives.length === 0) {
            addObjective();
        }
    }, [objectives, addObjective]);

    useEffect(() => {
        getSingleAOP(id, status => {
            // console.log(status)
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            setisLoading(false);
        });
    }, []);

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
                            aopId={id}
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
