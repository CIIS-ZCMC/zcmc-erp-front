import React, { useEffect, useState } from 'react'

import { Stack, Box, Typography, Divider, Link } from '@mui/joy';
import { useLocation } from 'react-router-dom';

import useJobPositionsHook from '../../Hooks/JobPositionsHook';
import useResponsiblePersonHook from '../../Hooks/ResponsiblePeopleHook';

import BoxComponent from '../../Components/Common/Card/BoxComponent';
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent';


const SelectJobPositionComponent = () => {
    const { designations, handleValue } = useResponsiblePersonHook();
    const { jobPositions } = useJobPositionsHook()

    const location = useLocation()
    const pathSegments = location.pathname.split('/');
    const activityId = pathSegments[5];

    return <Stack gap={1}>
        <AutocompleteComponent
            label={'Select job position'}
            placeholder='Select a job position'
            // value={user?.name || ''}
            size={'md'}
            setValue={(value) => handleValue(activityId, "designations", value)}
            options={jobPositions}
        />

        <Typography
            level="body-xs"
            fontWeight={400}
        >
            Selected People ({designations?.length})
        </Typography>
    </Stack>
}

const JobPositionList = () => {

    const { responsible_people, removeData } = useResponsiblePersonHook();

    const location = useLocation();
    const pathSegment = location.pathname.split('/');

    const activityId = pathSegment[5];

    const filteredDesignations = responsible_people?.filter((element) => element.activity_index === activityId)[0] ?? []

    const designations = filteredDesignations?.designations;

    if (designations?.length === 0) {
        return <Stack
            m={2}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Typography
                level='body-xs'
            >
                Please select job position(s)
            </Typography>
        </Stack>
    }

    return <>
        {designations?.map(({ id, name, code }) => (
            < Box
                m={1}
            >
                <Box
                    key={id}
                    m={1}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                    >
                        <Stack
                            direction={'column'}
                            m={1}
                        >
                            <Typography>
                                {name}
                            </Typography>
                            <Typography
                                level="body-xs"
                                fontWeight={400}
                            >
                                {code}
                            </Typography>

                        </Stack>

                    </Box>

                    <Box>
                        <Link
                            component="button"
                            color='danger'
                            fontSize={14}
                            onClick={() => removeData(id, 'designations', activityId)}
                        >
                            Remove
                        </Link>
                    </Box>
                </Box>

                <Divider />
            </Box >
        ))}
    </>
}

const JobPositionsSection = () => {

    const { getJobPositions } = useJobPositionsHook();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getJobPositions((status, message) => {
            if (!(status >= 200 && status < 300)) {
                return
            }
            setIsLoading(false)
        })
    }, [])

    return (
        <div>
            <BoxComponent>
                <SelectJobPositionComponent />
                <JobPositionList />
            </BoxComponent>
        </div >
    )
}

export default JobPositionsSection