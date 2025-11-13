import React from 'react'

import { Stack, Box, Typography, useTheme } from '@mui/joy'
import { useNavigate } from 'react-router-dom';
import { Warning } from '@mui/icons-material';

import ButtonComponent from '@Components/Common/ButtonComponent';

const Draft = () => {

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
                        Status: Draft Mode
                    </Typography>
                    <Typography level="body-xs" color="warning">
                        This AOP is currently in draft mode. You may click this
                        button and confirm to submit this AOP for review.
                    </Typography>
                </Box>
                <Box width={"450px"}>
                    <ButtonComponent
                        label={"Submit AOP for Review"}
                        onClick={() => navigate("/aop/summary")}
                        fullWidth={"true"}
                    />
                </Box>
            </Stack>
        </>
    )
}

export default Draft