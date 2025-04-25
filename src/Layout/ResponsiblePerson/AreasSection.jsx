import { useEffect, useState } from 'react';

import { Stack, Box, Typography, Divider, Link } from '@mui/joy'

import useAreasHook from '../../Hooks/AreasHook';
import useResponsiblePersonHook from '../../Hooks/ResponsiblePersonHook';

import BoxComponent from '../../Components/Common/Card/BoxComponent'
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent'


const SelectAreaComponent = () => {

    const key = 'areas';
    const { areas, setData } = useResponsiblePersonHook();
    const { areas: areasOptions } = useAreasHook();

    return <Stack gap={1}>
        <AutocompleteComponent
            label={'Select area'}
            placeholder='Select a area'
            // value={user?.name || ''}
            size={'md'}
            setValue={(value) => setData(key, value)}
            options={areasOptions}
        />

        <Typography
            level="body-xs"
            fontWeight={400}
        >
            Selected People ({areas.length})
        </Typography>
    </Stack>
}

const AreasList = () => {

    const { areas, removeData } = useResponsiblePersonHook();

    if (areas.length === 0) {

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
                        onClick={() => removeData(id, 'areas')}
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