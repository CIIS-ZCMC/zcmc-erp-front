import React, { useEffect } from 'react'

import { Stack, Typography, FormControl, FormLabel, Alert, Checkbox, Input } from '@mui/joy'

import TextareaComponent from '@Components/Form/TextareaComponent'
import InputComponent from '@Components/Form/InputComponent'

import { TriangleAlert } from 'lucide-react'

import useActivitiesStore from '../../../Store/ActivitiesStore'
import { useActivitiesActions } from '../../../Store/ActivitiesStore'

const ActivitiesModal = ({
    activityName,
}) => {

    const { activity, startMonth, endMonth, isGadRelated, target } = useActivitiesStore();
    const { setActivity, setStartMonth, setEndMonth, setIsGadRelated, setTarget } = useActivitiesActions();

    const { firstQuarter, secondQuarter, thirdQuarter, fourthQuarter } = target;

    return (
        <>
            <Stack
                spacing={2}
                overflow={'hidden'}
            >
                <TextareaComponent
                    label={'Activity name'}
                    placeholder="Activity name"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                />

                <Stack
                    mt={2}
                    gap={1}
                >
                    <Typography>Timeframe</Typography>

                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <FormControl>
                            <FormLabel>from</FormLabel>
                            <Input
                                size='sm'
                                type='month'
                                fullWidth={true}
                                sx={{
                                    width: 225
                                }}
                                value={startMonth}
                                onChange={(e) => setStartMonth(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>to</FormLabel>
                            <Input
                                size='sm'
                                type='month'
                                fullWidth
                                sx={{
                                    width: 225
                                }}
                                value={endMonth}
                                onChange={(e) => setEndMonth(e.target.value)}
                            // onBlur={() => setEditRowId(null)}
                            />
                        </FormControl>
                    </Stack>


                    {/* <Typography>Target</Typography> */}
                    <Stack
                        mt={3}
                        gap={1}
                        direction={'row'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >

                        <InputComponent
                            type={'number'}
                            label={'Quarter 1'}
                            width={100}
                            value={firstQuarter}
                            onChange={(e) => setTarget({ firstQuarter: e.target.value })}
                        />

                        <InputComponent
                            type={'number'}
                            label={'Quarter 2'}
                            width={100}
                            value={secondQuarter}
                            onChange={(e) => setTarget({ secondQuarter: e.target.value })}
                        />

                        <InputComponent
                            type={'number'}
                            label={'Quarter 3'}
                            width={100}
                            value={thirdQuarter}
                            onChange={(e) => setTarget({ thirdQuarter: e.target.value })}
                        />

                        <InputComponent
                            type={'number'}
                            label={'Quarter 4'}
                            width={100}
                            value={fourthQuarter}
                            onChange={(e) => setTarget({ fourthQuarter: e.target.value })}
                        />
                    </Stack>

                </Stack>

                <Stack
                    mt={10}
                >
                    <Checkbox
                        value={isGadRelated}
                        label="GAD related activity"
                        onChange={(e) => setIsGadRelated(e.target.checked)}
                    />
                </Stack>

                <Alert
                    size='sm'
                    color="warning"
                    startDecorator={<TriangleAlert />}
                    sx={{
                        mt: 5,
                        p: 1,
                        width: 500
                    }}
                >
                    Reminder: This activity doesn’t have assigned resources or responsible persons yet. After saving, you can add them by opening the full details of this activity or through the Manage Activities page.
                </Alert>

            </Stack>
        </>
    )
}

export default ActivitiesModal