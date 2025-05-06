import { Fragment, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/joy';
import { Plus } from 'lucide-react';

//custom components
import ButtonComponent from '../../../../../../Components/Common/ButtonComponent';
import ContainerComponent from '../../../../../../Components/Common/ContainerComponent';
import EditableTableComponent from '../../../../../../Components/Common/Table/EditableTableComponent';
import TableRow from './TableRow';

// hooks
import useFunctionTypeHook from '../../../../../../Hooks/FunctionTypeHook';
import useAOPObjectivesHooks from '../../../../../../Hooks/AOP/AOPObjectivesHook';
import useObjectivesHook from '../../../../../../Hooks/ObjectivesHook';

//data related

import { AOP_CONSTANTS } from '../../../../../../Data/constants';
import { AOP_HEADER } from '../../../../../../Data/Columns';

const Objectives = () => {

    const { deleteObjective, getApplicationObjectivesPayload, setApplicationObjectivesPayload } = useAOPObjectivesHooks()
    const { function_types, getFunctionType } = useFunctionTypeHook();
    const { applicationObjectives, addObjective, updateObjectiveField } = useObjectivesHook();

    const navigate = useNavigate()

    // local states
    const [editRowId, setEditRowId] = useState(null)
    const [isLoading, setisLoading] = useState(false)

    useEffect(() => {
        const params = { with_sub_data: 1 };
        getFunctionType(params, (status, message) => {
            // console.log(status)
            if (!(status >= 200 && status < 300)) { // if status not success
                return; //Toast error
            }
            setisLoading(false)
        });
    }, [isLoading])

    // handle Submit
    const handleSubmit = () => {

        const selectedValues = applicationObjectives.map((row) => ({
            id: row.rowId,
            objective_id: row.objective?.id || null,
            success_indicator_id: row.successIndicator?.id || null,
        }));

        setApplicationObjectivesPayload(selectedValues);

        const payload = getApplicationObjectivesPayload();
        console.log('Submitting payload:', payload);

        // await axios.post('/api/aop/submit', { application_objectives: payload });
    };

    // console.log(aopObjectives)

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
                    tableRow={
                        <TableRow
                            editRowId={editRowId}
                            setEditRowId={setEditRowId}
                            rows={applicationObjectives}
                            deleteRow={deleteObjective}
                            handleChange={updateObjectiveField}
                            function_types={function_types}
                        />}
                    stickLast
                />

                <Stack
                    mt={2}
                    direction={'flex'}
                    alignItems={'center'}
                    justifyContent={'start'}
                    gap={1}
                >
                    <ButtonComponent
                        label={'Cancel Request'}
                        size={'md'}
                        variant={'outlined'}
                        onClick={() => navigate(`/aop/all`)}
                    />

                    <ButtonComponent
                        label={'Submit AOP'}
                        size={'md'}
                        variant={'solid'}
                        disabled={false}
                        onClick={handleSubmit} //submit new aop
                    />
                </Stack>

            </ContainerComponent>


        </Fragment>
    )
}

export default Objectives