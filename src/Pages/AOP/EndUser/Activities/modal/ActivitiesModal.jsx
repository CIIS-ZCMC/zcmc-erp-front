import React, { useEffect } from 'react';

import { Stack, Typography, FormControl, FormLabel, Alert, Checkbox, Input } from '@mui/joy';
import { TriangleAlert } from 'lucide-react'

import TextareaComponent from '@Components/Form/TextareaComponent';
import InputComponent from '@Components/Form/InputComponent';

import useActivitiesStore, { useActivitiesActions } from '../../../../../Store/ActivitiesStore';

const ActivitiesModal = ({
    selectedActivity,
}) => {

    const { activity, startMonth, endMonth, isGadRelated, target } = useActivitiesStore();
    const { firstQuarter, secondQuarter, thirdQuarter, fourthQuarter } = target ?? {};

    const { setActivity, setStartMonth, setEndMonth, setIsGadRelated, setTarget } = useActivitiesActions();

    useEffect(() => {
        if (selectedActivity) {
            setActivity(selectedActivity.name)
            setStartMonth(selectedActivity.start_month)
            setEndMonth(selectedActivity.end_month)
            setIsGadRelated(selectedActivity.is_gad_related)
            setTarget({
                firstQuarter: selectedActivity.target.first_quarter || '',
                secondQuarter: selectedActivity.target.second_quarter || '',
                thirdQuarter: selectedActivity.target.third_quarter || '',
                fourthQuarter: selectedActivity.target.fourth_quarter || '',
            })
        }
    }, [selectedActivity])

    useEffect(() => {
        if (!startMonth && !endMonth) {
            const defaultYear = new Date().getFullYear() + 1; //set to next year or + 1
            setStartMonth(`${defaultYear}-01`);
            setEndMonth(`${defaultYear}-01`);
        }
        // console.log(startMonth)
    }, [startMonth])

    const handleQuarterChange = (quarterKey) => (e) => {
        const value = e.target.value;

        if (value === "" || /^(\d{1,3})?%?$/.test(value) && (value.replace('%', '') === '' || Number(value.replace('%', '')) <= 100)) {
            setTarget({ [quarterKey]: value }); // keep as string to allow typing
        }
    };

    return (
        <>
            <Stack
                spacing={2}
                overflow={'hidden'}
            >
                <TextareaComponent
                    label={'Activity name'}
                    placeholder="Activity name"
                    value={activity || ""}
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
                                value={startMonth || ""}
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
                                value={endMonth || ""}
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
                            type={'text'}
                            label={'Quarter 1'}
                            width={100}
                            min={0}
                            max={100}
                            value={firstQuarter || ""}
                            onChange={handleQuarterChange("firstQuarter")}
                        />

                        <InputComponent
                            type={'text'}
                            label={'Quarter 2'}
                            width={100}
                            min={0}
                            max={100}
                            value={secondQuarter || ""}
                            onChange={handleQuarterChange("secondQuarter")}

                        />

                        <InputComponent
                            type={'text'}
                            label={'Quarter 3'}
                            width={100}
                            min={0}
                            max={100}
                            value={thirdQuarter || ""}
                            onChange={handleQuarterChange("thirdQuarter")}
                        />

                        <InputComponent
                            type={'text'}
                            label={'Quarter 4'}
                            width={100}
                            min={0}
                            max={100}
                            value={fourthQuarter || ""}
                            onChange={handleQuarterChange("fourthQuarter")}
                        />
                    </Stack>

                </Stack>

                <Stack
                    mt={10}
                >
                    <Checkbox
                        checked={isGadRelated}
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