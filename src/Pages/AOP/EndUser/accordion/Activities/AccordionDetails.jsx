import React from 'react'

import { Grid, Stack, Typography } from '@mui/joy'

import ResourcesList from './Lists/ResourcesList'
import PeopleList from './Lists/PeopleList'

const AccordionDetails = ({
    first_quarter,
    second_quarter,
    third_quarter,
    fourth_quarter,
    resources,
    responsiblePeople,
    resourcesCount,
    peopleCount,
}) => {
    return (
        <div>

            <Stack
                direction={"row"}
                spacing={1}
                alignItems={"center"}
                justifyContent={'center'}
                my={2}
            >

                <Typography level="body-xs" sx={{ fontWeight: 600 }}>
                    Target (by quarter){" "}
                </Typography>

                <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    bgcolor={"#F2F2F2"}
                    padding={0.5}
                    borderRadius={5}
                    gap={1}
                >
                    <Typography level="body-xs">Q1</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{first_quarter ? first_quarter : '0'}</Typography>
                </Stack>


                <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    bgcolor={"#F2F2F2"}
                    padding={0.5}
                    borderRadius={5}
                    gap={1}
                >
                    <Typography level="body-xs">Q2</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{second_quarter ? second_quarter : '0'}</Typography>
                </Stack>

                <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    bgcolor={"#F2F2F2"}
                    padding={0.5}
                    borderRadius={5}
                    gap={1}
                >
                    <Typography level="body-xs">Q3</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{third_quarter ? third_quarter : '0'}</Typography>
                </Stack>

                <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    bgcolor={"#F2F2F2"}
                    padding={0.5}
                    borderRadius={5}
                    gap={1}
                >
                    <Typography level="body-xs">Q4</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{fourth_quarter ? fourth_quarter : '0'}</Typography>
                </Stack>
            </Stack>

            <Grid
                container
                spacing={2}
            >
                <Grid
                    xs={6}
                >
                    <ResourcesList
                        resources={resources}
                        resourcesCount={resourcesCount}
                    />
                </Grid>

                <Grid xs={6}>
                    <PeopleList
                        responsiblePeople={responsiblePeople}
                        peopleCount={peopleCount}
                    />
                </Grid>
            </Grid>

        </div>
    )
}

export default AccordionDetails