import React from 'react'

import { Stack, Grid, Box, Typography, Divider, Link } from '@mui/joy';

import BoxComponent from '../../Components/Common/Card/BoxComponent';
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent';

const designationsOptions = [
    {
        id: 1,
        label: "ACCOUNTANT I",
        umis_designation_id: 1,
        name: "ACCOUNTANT I",
        code: "ACC I",
        probation: 6
    },
    {
        id: 2,
        label: "ACCOUNTANT II",
        umis_designation_id: 2,
        name: "ACCOUNTANT II",
        code: "ACC II",
        probation: 6
    },
]

const JobPositionsSection = ({
    designations,
    setDesignations,
    handleRemove,
    handleSelectedData
}) => {

    return (
        <div>
            <BoxComponent>

                <Stack gap={1}>
                    <AutocompleteComponent
                        label={'Select job position'}
                        placeholder='Select a job position'
                        // value={user?.name || ''}
                        size={'md'}
                        setValue={(value) => handleSelectedData(value, setDesignations, true)}
                        options={designationsOptions}
                    />

                    <Typography
                        level="body-xs"
                        fontWeight={400}
                    >
                        Selected People ({designations.length})
                    </Typography>
                </Stack>

                {designations.length === 0 ?
                    <Stack
                        m={2}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Typography
                            level='body-xs'
                        >
                            Please select responsbile job position
                        </Typography>
                    </Stack>

                    : designations?.map(({ id, name, code }) => (
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
                                        onClick={() => handleRemove(id, designations, setDesignations)}
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

export default JobPositionsSection