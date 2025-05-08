import { useEffect, useState } from 'react';

import { Stack, Box, Typography, Divider, Link } from '@mui/joy'
import { useLocation } from 'react-router-dom';

import useAreasHook from '../../Hooks/AreasHook';
import useResponsiblePeopleHook from '../../Hooks/ResponsiblePeopleHook';

import BoxComponent from '../../Components/Common/Card/BoxComponent'
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent'

const SelectAreaComponent = ({ parentId }) => {
    const { handleValue, getByActivityId } = useResponsiblePeopleHook();
    const { areas: areasOptions } = useAreasHook();

    const responsible = getByActivityId(parentId);
    const selectedAreas = responsible?.areas || []

    return <Stack gap={1}>
        <AutocompleteComponent
            label={'Select area'}
            placeholder='Select a area'
            size={'md'}
            setValue={(value) => handleValue(parentId, "areas", value)}
            options={areasOptions}
        />

        <Typography
            level="body-xs"
            fontWeight={400}
        >
            Selected Areas ({selectedAreas?.length})
        </Typography>
    </Stack>
}

const AreasList = ({ parentId }) => {

    const { responsible_people, removeData } = useResponsiblePeopleHook();

    const filteredData = responsible_people?.filter((element) => element.activityId === parentId)[0] ?? [];
    const areas = filteredData.areas;

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

    return <>
        {
            areas?.map(({ id, label, division }) => (
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
                                    {label}
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
                                onClick={() => removeData(id, 'areas', parentId)}
                            >
                                Remove
                            </Link>
                        </Box>
                    </Box>

                    <Divider />
                </Box>
            ))
        }
    </>
}

const AreasSection = () => {

    const location = useLocation();
    const activityId = location.state.parentId

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
                <SelectAreaComponent parentId={activityId} />
                <AreasList parentId={activityId} />
            </BoxComponent>
        </div>
    )
}

export default AreasSection