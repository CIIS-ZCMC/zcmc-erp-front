import React, { Fragment, useState, useEffect, act } from 'react';
import { Stack, Grid, } from '@mui/joy';
import { useNavigate, useLocation } from 'react-router-dom';

import useResponsiblePersonHook, { addActivityIndexHook } from '../../../../../../../../Hooks/ResponsiblePeopleHook';
import useAOPObjectivesHooks from '../../../../../../../../Hooks/AOP/AOPObjectivesHook';

//Custom Components
import ButtonComponent from '../../../../../../../../Components/Common/ButtonComponent';
import ContainerComponent from '../../../../../../../../Components/Common/ContainerComponent';

// Layouts
import PersonSection from '../../../../../../../../Layout/ResponsiblePerson/PersonSection';
import JobPositionsSection from '../../../../../../../../Layout/ResponsiblePerson/JobPositionsSection';
import AreasSection from '../../../../../../../../Layout/ResponsiblePerson/AreasSection';

//data related
import { AOP_CONSTANTS } from '../../../../../../../../Data/constants';

const ResponsiblePerson = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const pathSegments = location.pathname.split('/');

    const objectiveId = pathSegments[3]
    const activityId = pathSegments[5];

    const setAopObjective = useAOPObjectivesHooks((state) => state.setAopObjective);
    const { responsible_people, resetValues, setAssignmentStatus } = useResponsiblePersonHook();
    const addActivityIndex = addActivityIndexHook()

    useEffect(() => {
        addActivityIndex(activityId)
        // console.log("responsible_people:", responsible_people);
    }, [responsible_people])

    const activity = responsible_people.find(
        (item) => item.activity_index === String(activityId)
    );

    const isAssigned = activity && (
        activity.isAssigned
    )

    const isSaveEnabled = activity &&
        (
            activity.users.length > 0 ||
            activity.designations.length > 0 ||
            activity.areas.length > 0
        );

    const handleSaveAssignment = () => {
        if (!activity) {
            console.warn("No responsible person data found for this activity.");
            return;
        }

        const updatedResponsiblePeople = [
            ...activity.users.map((user) => ({
                userId: user.id,
                designationId: null,
                divisionId: null,
                departmentId: null,
                sectionId: null,
                unitId: null
            })),

            ...activity.designations.map((designation) => ({
                userId: null,
                designationId: designation.id,
                divisionId: null,
                departmentId: null,
                sectionId: null,
                unitId: null
            })),

            ...activity.areas.map((area) => ({
                userId: null,
                designationId: null,
                divisionId: area.type === "division" ? area.id : null,
                departmentId: area.type === "department" ? area.id : null,
                sectionId: area.type === "section" ? area.id : null,
                unitId: area.type === "unit" ? area.id : null
            })),
        ]

        console.log(updatedResponsiblePeople)
        // update the global state
        setAopObjective(Number(objectiveId), String(activityId), updatedResponsiblePeople);
        setAssignmentStatus(activityId, true)
        // Navigate back after saving
        navigate(`/aop-create/activities/${objectiveId}`);
    };

    const handleCancel = (activityId) => {
        resetValues(activityId)
        navigate(`/aop-create/activities/${objectiveId}`)
    }
    // console.log(responsible_persons)

    return (
        <Fragment>
            <ContainerComponent
                title={AOP_CONSTANTS.TABLE_PERSON_HEADER}
                description={AOP_CONSTANTS.TABLE_PERSON_SUBHEADING}
            >

                <Grid
                    container
                    spacing={3}
                    columns={{ xs: 12, sm: 12, md: 12 }}
                    sx={{
                        flexGrow: 1,
                        width: "auto",
                        p: 1,
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        sm={2}
                        md={4}
                    >
                        <PersonSection />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={2}
                        md={4}
                    >
                        <JobPositionsSection />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={2}
                        md={4}
                    >
                        <AreasSection />
                    </Grid>

                </Grid>

                <Stack
                    mt={2}
                    direction={'flex'}
                    alignItems={'center'}
                    justifyContent={'start'}
                    gap={1}
                >

                    {isAssigned ?
                        <ButtonComponent
                            onClick={() => navigate(`/aop-create/activities/${objectiveId}`)}
                            label={'Back to activities'}
                            size={'md'}
                            variant={'outlined'}
                        />
                        :
                        <ButtonComponent
                            onClick={() => handleCancel(activityId)}
                            label={'Cancel Selection'}
                            size={'md'}
                            variant={'outlined'}
                            disabled={isAssigned}
                        />
                    }

                    <ButtonComponent
                        label={'Save Assignment'}
                        size={'md'}
                        variant={'solid'}
                        onClick={() => handleSaveAssignment()}
                        disabled={!isSaveEnabled}
                    />
                </Stack>
            </ContainerComponent>
        </Fragment>
    )
}

export default ResponsiblePerson