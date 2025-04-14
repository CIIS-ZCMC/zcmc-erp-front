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
import { aopHeader } from '../../../../../../Data/Columns';

const Objectives = () => {

    const { aop_objectives } = useAOPHook();
    const { function_types, getFunctionType } = useFunctionTypeHook();

    const [isLoading, setisLoading] = useState(false)

    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const parentPath = currentPath === '/aop-create';

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

    const [editRowId, setEditRowId] = useState(null);
    const [editField, setEditField] = useState({});

    //local states
    const [functionType, setFunctionType] = useState(null)
    const [objective, setObjective] = useState(null)
    const [successIndicator, setSuccessIndicator] = useState(null)

    const [aopObjectives, setAopObjectives] = useState([])

    const annualOpsPlanning = [
        {
            id: 1,
            functionTypes: [
                {
                    id: 1,
                    name: 'Strategic',
                    objectives: [
                        { id: 1, name: 'OBJ-TPS-9879' },
                        { id: 2, name: 'OBJ-TPS-9879' }
                    ]
                },
                { id: 2, name: 'Core' }
            ],
            objectives: [],
            successIndicators: [],
        }
    ]

    const handleManageActivities = (id) => {
        console.log(id)
        navigate(`activities/${id}`)
    }

    const handleDeleteObjective = (id) => {
        console.log(id)
    }

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
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.MANAGE_OBJECTIVES_HEADER}
                description={AOP_CONSTANTS.MANAGE_OBJECTIVES_SUBHEADER}
                actions={
                    <Stack>
                        <ButtonComponent
                            // onClick={() => setOpen(true)}
                            label={"Add an Objective"}
                            endDecorator={<Plus size={16} />}
                        />
                    </Stack>
                }
            >
                <EditableTableComponent
                    columns={aopHeader(handleManageActivities, handleDeleteObjective)}
                    tableRow={
                        <TableRow
                            functionType={functionType}
                            setFunctionType={setFunctionType}
                            objective={objective}
                            setObjective={setObjective}
                            successIndicator={successIndicator}
                            setSuccessIndicator={setSuccessIndicator}
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
                        disabled={true}
                    // onClick={} submit aop
                    />
                </Stack>

            </ContainerComponent>


        </Fragment>
    )
}

export default Objectives