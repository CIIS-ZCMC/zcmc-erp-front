import React from 'react'

import { Stack, Box, Typography, useTheme } from '@mui/joy';
import { Warning } from '@mui/icons-material';

import InputComponent from '@Components/Form/InputComponent';
import TextareaComponent from '@Components/Form/TextareaComponent';

import { ANNUAL_OPS } from '../../../../Data/constants';

const FiscalYearModal = ({ value, onChange, fiscalYear }) => {
    const { missionPlaceHolder } = ANNUAL_OPS;
    const theme = useTheme();
    const color = theme.palette.custom;

    return (
        <>
            <Stack spacing={2}>
                <InputComponent
                    label={"Fiscal Year"}
                    fontWeight={500}
                    value={fiscalYear}
                    disabled
                />
                <TextareaComponent
                    label={"Mission"}
                    placeholder={missionPlaceHolder}
                    value={value}
                    onChange={onChange}
                />
                <Stack
                    direction="row"
                    spacing={2}
                    bgcolor="#FFF4E5"
                    p={2}
                    borderRadius={8}
                >
                    <Box>
                        <Warning sx={{ color: color.warning, fontSize: 20 }} />
                    </Box>
                    <Typography color="warning" level="body-xs">
                        After creating this new AOP, you’ll need to define its details such
                        as functions, objectives, activities, resources and responsible
                        persons before formal submission. This AOP will remain in draft mode
                        until all required information is completed and submitted for
                        review.
                    </Typography>
                </Stack>
            </Stack>
        </>
    );
};

export default FiscalYearModal;