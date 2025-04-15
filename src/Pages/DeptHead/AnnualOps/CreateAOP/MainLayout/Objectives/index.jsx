import { Fragment, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { Stack } from '@mui/joy';
import { Plus } from 'lucide-react';

//custom components
import ButtonComponent from '../../../../../../Components/Common/ButtonComponent';
import ContainerComponent from '../../../../../../Components/Common/ContainerComponent';
import EditableTableComponent from '../../../../../../Components/Common/Table/EditableTableComponent';
import TableRow from './TableRow';

import useAOPHook from '../../../../../../Hooks/AOPHook';
import useFunctionTypeHook from '../../../../../../Hooks/FunctionTypeHook';

//data related
import AOPApproval from '../../../../../PlanningOps/Approval/AOPApproval';

import { AOP_CONSTANTS } from '../../../../../../Data/constants';
import { AOP_HEADER } from '../../../../../../Data/Columns';

const Objectives = () => {

    const navigate = useNavigate()

    const { aop_objectives } = useAOPHook();
    const { function_types, getFunctionType } = useFunctionTypeHook();

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

    //local states
    const [aopObjectives, setAopObjectives] = useState([
        { id: 1, functionType: null, objectives: null, successIndicator: null, },
        { id: 2, functionType: null, objectives: null, successIndicator: null, },
        { id: 3, functionType: null, objectives: null, successIndicator: null, },
    ])

    // Capture changes on input/select
    const handleChange = (id, field, value) => {
        setAopObjectives(prev =>
            prev.map(row =>
                row.id === id
                    ? {
                        ...row,
                        [field]: value,
                        ...(field === 'functionType' && {
                            objective: null,
                            successIndicator: null,
                        }),
                        ...(field === 'objective' && {
                            successIndicator: null,
                        }),
                    }
                    : row
            )
        );
    };

    // handle add new row for onjectives
    const handleAddRow = () => {
        const newId = aopObjectives.length + 1;
        setAopObjectives([
            ...aopObjectives,
            { id: newId, functionType: null, objectives: null, successIndicator: null, }
        ])
    }

    // Delete a row
    const handleDeleteRow = (id) => {
        setAopObjectives(prev => prev.filter(row => row.id !== id));
    };

    // Submit the table as a form
    const handleSubmit = () => {
        console.log("Submitted Objectives:", aopObjectives);
        // You can POST this to an API
    };

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.MANAGE_OBJECTIVES_HEADER}
                description={AOP_CONSTANTS.MANAGE_OBJECTIVES_SUBHEADER}
                actions={
                    <Stack>
                        <ButtonComponent
                            onClick={handleAddRow}
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
                            rows={aopObjectives}
                            deleteRow={handleDeleteRow}
                            handleChange={handleChange}
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