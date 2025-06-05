import { Fragment, useState, useEffect, useMemo } from 'react';

import { Stack, Link } from '@mui/joy';
import { ExternalLink, Plus } from 'lucide-react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

import ContainerComponent from '../../../../../Components/Common/ContainerComponent';
import EditableTableComponent from '../../../../../Components/Common/Table/EditableTableComponent';
import ButtonComponent from '../../../../../Components/Common/ButtonComponent';

import useFunctionTypeHook from '../../../../../Hooks/FunctionTypeHook';
import useAOPObjectivesHooks from '../../../../../Hooks/AOP/AOPObjectivesHook';
import useObjectivesHook from '../../../../../Hooks/ObjectivesHook';
import useActivitiesHook from '../../../../../Hooks/ActivitiesHook';
import useResourceHook from '../../../../../Hooks/ResourceHook';
import useResponsiblePeopleHook from '../../../../../Hooks/ResponsiblePeopleHook';
import useModalHook from '../../../../../Hooks/ModalHook';

import { useAOPActions } from '../../../../../Hooks/AOP/AOPObjectivesHook';

import TableRow from './TableRow'

import { AOP_CONSTANTS } from '../../../../../Data/constants';
import { AOP_HEADER } from '../../../../../Data/Columns';

const index = () => {
    const { updateAOP } = useAOPActions();

    const navigate = useNavigate()
    const location = useLocation();
    const id = location.state?.data.id;

    const { aopObjectives, mission, aop_id, deleteObjective } = useAOPObjectivesHooks();
    const { function_types, getFunctionType } = useFunctionTypeHook();
    const { objectives, addObjective, clearObjectives } = useObjectivesHook();
    const { findActivitiesByObjectiveID, activities, clearActivities } = useActivitiesHook();
    const { findResourcesByActivityID, clearResources } = useResourceHook();
    const { findResponsiblePeopleByActivityID, clearResponsiblePeople } = useResponsiblePeopleHook();
    const { setAlertDialog } = useModalHook();

    // const [mission, setMission] = useState();
    const [isDraft, setIsDnraft] = useState(false)
    const [authorizationPin, setAuthorizationPin] = useState('123456');

    const [openSaveMissionModal, setOpenSaveMissionModal] = useState(false);

    const activitiesCount = objectives.map((objective) =>
        activities.filter((activity) => activity.parentId === objective.id)
    );

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


        getSingleAOP((status, message) => {
            setIsLoading(false)
            // console.log(status)
            if (!(status >= 200 && status < 300)) {
                return; //Toast error
            }
        })
    }, []);

    // formatted objectives
    const formattedObjectives = aopObjectives.application_objectives?.map(({ function_type, objective, success_indicator }, index) => (
        {
            id: uuid(),
            rowId: index + 1,
            functionType: function_type,
            objective: objective,
            successIndicator: success_indicator
        }
    ))

    // get flat activities
    const flatActivities = aopObjectives.application_objectives?.flatMap(data => data.activity) || [];


    // formatted activities
    const formattedActivities = flatActivities.map(({ activity_uuid, name, is_gad_related, cost, start_month, end_month, target }, index) => ({
        id: activity_uuid ? activity_uuid : uuid(),
        // parentId: objectiveId,
        rowId: index + 1,
        name: name,
        isGadRelated: is_gad_related,
        cost: cost,
        startMonth: start_month,
        endMonth: end_month,
        target: {
            firstQuarter: target.first_quarter,
            secondQuarter: target.second_quarter,
            thirdQuarter: target.third_quarter,
            fourthQuarter: target.fourth_quarter,
        }
    }));

    //get item resourcese
    const flatResources = aopObjectives.application_objectives?.flatMap(data =>
        data.activity.flatMap(item => item.resources)
    ) || [];


    const flatResponsiblePeople = aopObjectives.application_objectives?.flatMap(data =>
        data.activity.flatMap(item => item.responsible_people));

    const formattedResponsiblePeople = flatResponsiblePeople?.map((responsible) => (
        {
            activityId: responsible.activity_uuid,
            users: responsible.users,
            designations: responsible.designations,
            areas: responsible.areas
        }
    ));


    // formatted resources
    const formattedResources = flatResources?.map((resource, index) => ({
        id: uuid(),
        item_id: resource.item?.id,
        parentId: resource.item.parentId,
        rowId: index + 1,
        name: resource.item?.name,
        quantity: resource.quantity,
        individualPrice: resource.item?.estimated_budget,
        totalCost: Number((resource.item?.estimated_budget * resource.quantity).toFixed(2)),
        expenseClass: resource.expense_class,
        purchaseTypeId: resource.purchase_type,
    }));

    useEffect(() => {
        // console.log('AOP OBJECTIVES FETCH FROM SERVER:', aopObjectives);
        setObjectives(formattedObjectives ? formattedObjectives : []);
        setActivities(formattedActivities ? formattedActivities : []);
        //add set cart
        setResources(formattedResources ? formattedResources : []);
        setResponsiblePeople(formattedResponsiblePeople ? formattedResponsiblePeople : []);
    }, [aopObjectives])




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
                    const responsible_people = findResponsiblePeopleByActivityID(act.id);

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
                        responsible_people: responsible_people,
                    };
                }
            );

            return {
                objective_id: item.objective.id,
                success_indicator_id: item.successIndicator.id,
                activities: activitiesWithResourceAndResponsiblePeople,
            }
        })

        return objectivesData;
    }

    const clearLocalStorage = () => {
        //set objectives, activities, resources into empty state then clear localStorrage
        clearObjectives();
        clearActivities();
        clearResources();
        clearResponsiblePeople();

    };

    const handleSubmit = () => {

        const aopPayload = buildAOP();

        const payload = {
            mission: mission,
            has_discussed: true,
            status: isDraft ? isDraft : 'pending',
            authorization_pin: authorizationPin,
            application_objectives: aopPayload,
        }

        console.log('submitting payload', payload)

        updateAOP(payload, aop_id, (status, message) => {

            let data = {}

            // if existing
            // if (
            //     status === 200 &&
            //     message === "You already have an AOP application in your area."
            // ) {
            //     data = {
            //         status: 200,
            //         title: "Existing AOP",
            //         description: "You already have an AOP application in your area.",
            //     };
            //     setAlertDialog(data);
            //     return;
            // }

            //create new
            if (status === 200) {
                data = {
                    status: 200,
                    title: "Successfully submitted for approval.",
                    description:
                        "Your AOP request has been sent to the next approving body and they have been notified.",
                };

                // setOpenSubmitModal(false);
                // clearLocalStorage();
                // setMission("");
                // window.location.reload(false);
                // setAlertDialog(data);
                return;
            }

        })

    }

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
                        label={"Update AOP"}
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
