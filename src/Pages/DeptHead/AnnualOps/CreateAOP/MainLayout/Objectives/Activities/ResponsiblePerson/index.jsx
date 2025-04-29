import React, { Fragment, useState, useEffect } from 'react';
import { Stack, Grid, } from '@mui/joy';
import { useNavigate, useLocation } from 'react-router-dom';

import useResponsiblePersonHook, { addActivityIndexHook } from '../../../../../../../../Hooks/ResponsiblePersonHook';
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

    // const { users, designations, areas } = useResponsiblePersonHook();

    const setAopObjective = useAOPObjectivesHooks((state) => state.setAopObjective);

    const handleSaveAssignment = () => {
        const updatedResponsiblePeople = [
            ...users.map((user) => ({
                userId: user.id,
                designationId: null,
                divisionId: null,
                departmentId: null,
                sectionId: null,
                unitId: null
            })),
            ...designations.map((designation) => ({
                userId: null,
                designationId: designation.id,
                divisionId: null,
                departmentId: null,
                sectionId: null,
                unitId: null
            })),
            ...areas.map((area) => ({
                userId: null,
                designationId: null,
                divisionId: area.type === "division" ? area.id : null,
                departmentId: area.type === "department" ? area.id : null,
                sectionId: area.type === "section" ? area.id : null,
                unitId: area.type === "unit" ? area.id : null
            }))
        ];

        // Now, update the global state with the selected responsible people
        setAopObjective(Number(objectiveId), String(activityId), updatedResponsiblePeople);

        // Navigate back after saving
        navigate(`/aop-create/activities/${objectiveId}`);
    };

    const handleCancel = () => {
        navigate(`/aop-create/activities/${objectiveId}`)
    }

    const { responsible_persons } = useResponsiblePersonHook();
    const add = addActivityIndexHook()


    const filtered = responsible_persons?.filter((element) => element.activity_index == activityId)

    console.log(filtered)

    useEffect(() => {
        add(activityId)
    }, [])

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
                    <ButtonComponent
                        onClick={() => handleCancel()}
                        label={'Cancel Selection'}
                        size={'md'}
                        variant={'outlined'}
                    />

                    <ButtonComponent
                        label={'Save Assignment'}
                        size={'md'}
                        variant={'solid'}
                        onClick={() => handleSaveAssignment()}
                    />
                </Stack>
            </ContainerComponent>
        </Fragment>
    )
}

export default ResponsiblePerson