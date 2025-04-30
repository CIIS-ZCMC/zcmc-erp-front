import { useEffect, useState } from 'react';

import { Stack, Box, Typography, Divider, Link } from '@mui/joy'
import { useLocation } from 'react-router-dom';

import useAreasHook from '../../Hooks/AreasHook';
import useResponsiblePersonHook from '../../Hooks/ResponsiblePeopleHook';

import BoxComponent from '../../Components/Common/Card/BoxComponent'
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent'

const SelectAreaComponent = () => {
    const { areas, handleValue } = useResponsiblePersonHook();
    const { areas: areasOptions } = useAreasHook();

    const location = useLocation();
    const pathSegments = location.pathname.split('/')
    const activityId = pathSegments[5]

    return <Stack gap={1}>
        <AutocompleteComponent
            label={'Select area'}
            placeholder='Select a area'
            // value={user?.name || ''}
            size={'md'}
            setValue={(value) => handleValue(activityId, "areas", value)}
            options={areasOptions}
        />

        <Typography
            level="body-xs"
            fontWeight={400}
        >
            Selected People ({areas?.length})
        </Typography>
    </Stack>
}

const AreasList = () => {

    const { responsible_people, removeData } = useResponsiblePersonHook();

    const location = useLocation();
    const pathSegment = location.pathname.split('/');

    const activityId = pathSegment[5];

    const filteredAreas = responsible_people?.filter((element) => element.activity_index === activityId)[0] ?? [];

    const areas = filteredAreas?.areas;

    if (areas?.length === 0) {
        return <Stack
            m={2}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Typography
                level='body-xs'
            >
                Please select area(s)
            </Typography>
        </Stack>
    }

    return areas?.map(({ id, name, division }) => (
        < Box
            key={id}
            m={1}
        >
            <Box
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
                            {division}
                        </Typography>

                    </Stack>

                </Box>

                <Box>
                    <Link
                        component="button"
                        color='danger'
                        fontSize={14}
                        onClick={() => removeData(id, 'areas', activityId)}
                    >
                        Remove
                    </Link>
                </Box>
            </Box>

            <Divider />
        </Box>
    ))
}

const AreasSection = () => {

    const { getAreas } = useAreasHook()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getAreas((status, message) => {
            if (!(status >= 200 && status < 300)) {
                return;
            }
            setIsLoading(false)
        })
    }, [])

    return (
        <div>
            <BoxComponent>
                <SelectAreaComponent />
                <AreasList />
            </BoxComponent>
        </div>
    )
}

export default AreasSection