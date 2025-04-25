import React, { Fragment, useState, useEffect } from 'react';
import { Stack, Grid, } from '@mui/joy';

import useResponsiblePersonHook from '../../../../../../../../Hooks/ResponsiblePersonHook';

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

    const { users, designations, areas } = useResponsiblePersonHook();

    const handleSaveAssignment = () => {
        const responsiblePeople = [];

        // Add entries from users
        users.forEach((user) => {
            responsiblePeople.push({
                user_id: user.id,
                designation_id: null,
                division_id: null,
                department_id: null,
                section_id: null,
                unit_id: null
            });
        });

        // Add entries from designations
        designations.forEach((designation) => {
            responsiblePeople.push({
                user_id: null,
                designation_id: designation.id,
                division_id: null,
                department_id: null,
                section_id: null,
                unit_id: null
            });
        });

        // Add entries from areas
        areas.forEach((area) => {
            responsiblePeople.push({
                user_id: null,
                designation_id: null,
                division_id: area.type === "division" ? area.id : null,
                department_id: area.type === "department" ? area.id : null,
                section_id: area.type === "section" ? area.id : null,
                unit_id: area.type === "unit" ? area.id : null,
            });
        });

        console.log("Formatted Responsible People:", responsiblePeople);
    };

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