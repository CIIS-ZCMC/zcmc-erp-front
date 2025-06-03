import { Fragment, useState, useEffect, useMemo } from 'react';

import { Stack, Link } from '@mui/joy';
import { ExternalLink, Plus } from 'lucide-react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { v4 as uuid } from "uuid";

import ContainerComponent from '../../../../../Components/Common/ContainerComponent';
import EditableTableComponent from '../../../../../Components/Common/Table/EditableTableComponent';
import ButtonComponent from '../../../../../Components/Common/ButtonComponent';

import useFunctionTypeHook from '../../../../../Hooks/FunctionTypeHook';
import useAOPObjectivesHooks from '../../../../../Hooks/AOP/AOPObjectivesHook';
import useObjectivesHook from '../../../../../Hooks/ObjectivesHook';
import useActivitiesHook from '../../../../../Hooks/ActivitiesHook';
import useResourceHook from '../../../../../Hooks/ResourceHook';
import useModalHook from '../../../../../Hooks/ModalHook';

import { useAOPActions } from '../../../../../Hooks/AOP/AOPObjectivesHook';

import TableRow from './TableRow'

import { AOP_CONSTANTS } from '../../../../../Data/constants';
import { AOP_HEADER } from '../../../../../Data/Columns';

const index = () => {

    const navigate = useNavigate()
    const location = useLocation();
    const id = location.state?.data.id;

    const { aopObjectives } = useAOPObjectivesHooks();
    const { function_types, getFunctionType } = useFunctionTypeHook();
    const { objectives, addObjective, setObjectives, clearObjectives } = useObjectivesHook();
    const { findActivitiesByObjectiveID, activities, clearActivities } = useActivitiesHook();
    const { resources, findResourcesByActivityID } = useResourceHook();
    const { setAlertDialog } = useModalHook();

    const [mission, setMission] = useState("");
    const [isDraft, setIsDraft] = useState(false)
    const [openSaveMissionModal, setOpenSaveMissionModal] = useState(false);

    useEffect(() => {
        console.log('aop objectives', aopObjectives)
    }, [])

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

    // console.log(objectives)

    const handleOpenDialog = () => {
        setOpenSaveMissionModal(true);
    };

    function buildAOP() {
        const objectivesData = objectives.map((item) => {
            const activities = findActivitiesByObjectiveID(item.id);
            const activitiesWithResourceAndResponsiblePeople = activities.map(
                (act) => {
                    const {
                        parentId,
                        id,
                        startMonth,
                        endMonth,
                        target,
                        isGadRelated,
                        ...actData
                    } = act;
                    const resources = findResourcesByActivityID(act.id);
                    // const responsible_people = findResponsiblePeopleByActivityID(act.id);

                    return {
                        ...actData,
                        start_month: startMonth,
                        end_month: endMonth,
                        is_gad_related: isGadRelated,
                        target: {
                            first_quarter: target.firstQuarter,
                            second_quarter: target.secondQuarter,
                            third_quarter: target.thirdQuarter,
                            fourth_quarter: target.fourthQuarter,
                        },
                        resources: resources,
                        // responsible_people: responsible_people,
                    };
                }
            );
            // console.log(item)
            return {
                objective_id: item.objective.id,
                success_indicator_id: item.successIndicator.id,
                activities: activitiesWithResourceAndResponsiblePeople,
            }
        })

        return objectivesData;
    }

    const handleSubmit = () => {

        const aopPayload = buildAOP();

        const payload = {
            mission: mission,
            has_discussed: true,
            status: isDraft ? isDraft : 'pending',
            application_objectives: aopPayload,
        }

        console.log('submitting payload', payload)
    }

    const clearLocalStorage = () => {
        //set objectives, activities, resources into empty state then clear localStorrage
        clearObjectives();
        clearActivities();
        // clearResponsiblePeople();
        // clearResources();

        localStorage.removeItem("objectives-storage");
        localStorage.removeItem("activities-storage");
        localStorage.removeItem("resources-storage");
    };

    const handleCancelRequest = () => {
        {
            clearLocalStorage();
            navigate("/aop");
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
                            onClick={() => handleOpenDialog()}
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

                <Stack
                    mt={2}
                    direction={"flex"}
                    alignItems={"center"}
                    justifyContent={"start"}
                    gap={1}
                >
                    <ButtonComponent
                        label={"Cancel Request"}
                        size={"md"}
                        variant={"outlined"}
                        onClick={() => handleCancelRequest()}
                    />

                    <ButtonComponent
                        label={"Submit AOP"}
                        size={"md"}
                        variant={"solid"}
                        onClick={() => handleSubmit()}
                    />
                </Stack>
            </ContainerComponent>
        </Fragment>
    )
}

export default index
