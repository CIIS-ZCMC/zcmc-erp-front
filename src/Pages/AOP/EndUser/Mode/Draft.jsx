import React from 'react'

import { Stack, Box, Typography, useTheme } from '@mui/joy'
import { useNavigate } from 'react-router-dom';
import { Warning } from '@mui/icons-material';

import ButtonComponent from '@Components/Common/ButtonComponent';

import {
    STATUS_LABELS,
    STATUS_MESSAGES,
    PPMP_BUTTON_LABEL
} from '../../../../Data/constants';

const Draft = ({ status }) => {

    const theme = useTheme();
    const color = theme.palette.custom;

    const navigate = useNavigate()

    return (
        <>
            <Stack
                bgcolor={"#FFF4E5"}
                borderRadius={5}
                direction={"row"}
                alignItems="center"
                padding={2}
                spacing={1.5}
                width={"75%"}
            >
                <Warning sx={{ color: color.warning, fontSize: 20 }} />
                <Box width={"100%"}>
                    <Typography
                        level="body-xs"
                        color="warning"
                        sx={{ fontWeight: 600 }}
                    >
                        Status: {STATUS_LABELS[status] ?? ""}
                    </Typography>
                    <Typography level="body-xs" color="warning">
                        {STATUS_MESSAGES[status] ?? "Unknown AOP status."}
                    </Typography>
                </Box>

                <Box width={"450px"}>
                    <ButtonComponent
                        label={PPMP_BUTTON_LABEL[status] ?? "Create PPMP"}
                        onClick={() => navigate("/aop/summary")}
                        fullWidth={"true"}
                    />
                </Box>
            </Stack>
        </>
    )
}

export default Draft