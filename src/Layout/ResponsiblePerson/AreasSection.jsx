import React from 'react'

import { Stack, Grid, Box, Typography, Divider, Link } from '@mui/joy'

import BoxComponent from '../../Components/Common/Card/BoxComponent'
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent'

const areaOptions = [
    {
        id: 1,
        label: 'Office of Medical Center Chief',
        name: "Office of Medical Center Chief",
        type: "division"
    },

    {
        id: 2,
        label: 'Office of Medical Center Chief',
        name: "Medical Service",
        type: "division"
    },
]

const AreasSection = ({
    areas,
    setAreas,
    handleRemove,
    handleSelectedData,
}) => {
    return (
        <div>
            <BoxComponent>

                <Stack gap={1}>
                    <AutocompleteComponent
                        label={'Select area'}
                        placeholder='Select a area'
                        // value={user?.name || ''}
                        size={'md'}
                        setValue={(value) => handleSelectedData(value, setAreas, true)}
                        options={areaOptions}
                    />

                    <Typography
                        level="body-xs"
                        fontWeight={400}
                    >
                        Selected People ({areas.length})
                    </Typography>
                </Stack>

                {areas.length === 0 ?
                    <Stack
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

                    : areas?.map(({ id, name, division }) => (
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
                                        onClick={() => handleRemove(id, areas, setAreas)}
                                    >
                                        Remove
                                    </Link>
                                </Box>
                            </Box>

                            <Divider />
                        </Box>
                    ))}
            </BoxComponent>
        </div>
    )
}

export default AreasSection