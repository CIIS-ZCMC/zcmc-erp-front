import React from 'react';

import { Stack, Box, Divider, useTheme, Typography } from '@mui/joy';
import { PhilippinePesoIcon, PlusIcon } from 'lucide-react';
import { CalendarToday, CheckCircle } from '@mui/icons-material';
import { blue, grey } from '@mui/material/colors';

import ChipComponent from '@Components/Common/ChipComponent';
import BoxComponent from '@Components/Common/Card/BoxComponent';
import ButtonComponent from '@Components/Common/ButtonComponent';

import { RESPONSIBLE } from '../../../../Data/constants';

const ResponsibleStatus = ({
    openResponsibleModal
}) => {

    const {
        MANAGE_RESPONSIBLE_HEADER,
        MANAGE_RESPONSIBLE_SUBHEADER,
    } = RESPONSIBLE;

    const color = useTheme()

    return (
        <>
            <BoxComponent bgColor={color.neutralBg} padding={2}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack>
                        <Stack direction={"row"} spacing={1}>
                            <Typography level="body-md" sx={{ fontWeight: 600 }}>
                                {MANAGE_RESPONSIBLE_HEADER}
                            </Typography>
                            <ChipComponent
                                label={"Activity: Procure Equipment and Tools"} // change to dynamic activity name
                                color={"success"}
                                variant={"outlined"}
                            />
                        </Stack>
                        <Typography level="body-sm">
                            {MANAGE_RESPONSIBLE_SUBHEADER}
                        </Typography>
                    </Stack>

                    <Stack>
                        <ButtonComponent
                            label={"Assign Responsible Person"}
                            startDecorator={<PlusIcon />}
                            onClick={openResponsibleModal}
                        />
                    </Stack>
                </Stack>

                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    spacing={2}
                    mt={3}
                >
                    <Stack width={"100%"}>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Stack direction={"row"} spacing={1} width="100%">
                                <CalendarToday sx={{ fontSize: 30, color: blue[800] }} />{" "}
                                <Stack>
                                    <Typography level="body-sm">Timeframe</Typography>
                                    <Typography level="title-md">August - September</Typography>
                                </Stack>
                            </Stack>
                            <Stack direction={"row"} spacing={1} width="100%">
                                <Box
                                    sx={{ bgcolor: blue[800] }}
                                    width={15}
                                    height={15}
                                    borderRadius={50}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    padding={1}
                                >
                                    <PhilippinePesoIcon style={{ color: "white" }} />{" "}
                                </Box>
                                <Stack>
                                    <Typography level="body-sm">Total Cost</Typography>
                                    <Typography level="title-md">₱ 500,000.00</Typography>
                                </Stack>
                            </Stack>

                            <Stack direction={"row"} spacing={1} width="100%">
                                <CheckCircle sx={{ fontSize: 30, color: blue[800] }} />{" "}
                                <Stack>
                                    <Typography level="body-sm">
                                        GAD-related activity
                                    </Typography>
                                    <Typography level="title-md">Yes</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Divider sx={{ my: 2, backgroundColor: grey }} />
                    </Stack>
                </Stack>

                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Typography level="body-xs" sx={{ fontWeight: 600 }}>
                        Target (by quarter){" "}
                    </Typography>
                    <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                        bgcolor={"#F2F2F2"}
                        padding={0.5}
                        borderRadius={5}
                    >
                        <Typography level="body-xs">Q1</Typography>
                        <Typography sx={{ fontWeight: 600 }}>200</Typography>
                    </Stack>
                </Stack>

            </BoxComponent >
        </>
    )
}

export default ResponsibleStatus