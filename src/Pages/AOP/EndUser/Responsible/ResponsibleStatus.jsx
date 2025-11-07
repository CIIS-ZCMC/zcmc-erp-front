import React, { useEffect } from 'react';

import { Stack, Box, Divider, useTheme, Typography } from '@mui/joy';
import { PhilippinePesoIcon, PlusIcon } from 'lucide-react';
import { CalendarToday, CheckCircle } from '@mui/icons-material';
import { blue, grey } from '@mui/material/colors';
import moment from 'moment';

import ChipComponent from '@Components/Common/ChipComponent';
import BoxComponent from '@Components/Common/Card/BoxComponent';
import ButtonComponent from '@Components/Common/ButtonComponent';

import { RESPONSIBLE } from '../../../../Data/constants';

const ResponsibleStatus = ({
    activity,
    openResponsibleModal
}) => {

    const {
        MANAGE_RESPONSIBLE_HEADER,
        MANAGE_RESPONSIBLE_SUBHEADER,
    } = RESPONSIBLE;

    const color = useTheme()

    const { start_month, end_month, name, cost, is_gad_related, target } = activity || {};
    const { first_quarter, second_quarter, third_quarter, fourth_quarter } = target || {};

    // useEffect(() => {
    //     console.log(activity)
    // }, [activity])

    const formattedStartMonth = moment(start_month, "YYYY-MM").format("MMMM");
    const formattedEndMonth = moment(end_month, "YYYY-MM").format("MMMM");

    const timeframe = `${start_month ? formattedStartMonth : ""} - ${end_month ? formattedEndMonth : ''}`

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
                                label={`Activity: ${name}`} // change to dynamic activity name
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
                                    <Typography level="title-md">{timeframe}</Typography>
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
                                    <Typography level="title-md">₱ {cost}</Typography>
                                </Stack>
                            </Stack>

                            <Stack direction={"row"} spacing={1} width="100%">
                                <CheckCircle sx={{ fontSize: 30, color: blue[800] }} />{" "}
                                <Stack>
                                    <Typography level="body-sm">
                                        GAD-related activity
                                    </Typography>
                                    <Typography level="title-md">{is_gad_related === 0 ? 'No' : 'Yes'}</Typography>
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
                        gap={1}
                    >
                        <Typography level="body-xs">Q1</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{first_quarter ? first_quarter : '0'}</Typography>
                    </Stack>


                    <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                        bgcolor={"#F2F2F2"}
                        padding={0.5}
                        borderRadius={5}
                        gap={1}
                    >
                        <Typography level="body-xs">Q2</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{second_quarter ? second_quarter : '0'}</Typography>
                    </Stack>

                    <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                        bgcolor={"#F2F2F2"}
                        padding={0.5}
                        borderRadius={5}
                        gap={1}
                    >
                        <Typography level="body-xs">Q3</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{third_quarter ? third_quarter : '0'}</Typography>
                    </Stack>

                    <Stack
                        direction={"row"}
                        spacing={1}
                        alignItems={"center"}
                        bgcolor={"#F2F2F2"}
                        padding={0.5}
                        borderRadius={5}
                        gap={1}
                    >
                        <Typography level="body-xs">Q4</Typography>
                        <Typography sx={{ fontWeight: 600 }}>{fourth_quarter ? fourth_quarter : '0'}</Typography>
                    </Stack>
                </Stack>

            </BoxComponent >
        </>
    )
}

export default ResponsibleStatus