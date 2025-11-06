import React, { useEffect, useState } from 'react'

import { Grid, Typography } from '@mui/joy';
import { blue, grey } from '@mui/material/colors';
import { PlusIcon } from 'lucide-react';

import BoxComponent from '@Components/Common/Card/BoxComponent';

import AccordionComponent from '@Components/Common/AccordionComponent';
import ButtonComponent from '@Components/Common/ButtonComponent';

import UserAccordionSummary from './accordion/user/AccordionSummary';
import UserAccordionDetails from './accordion/user/AccordionDetails';

import PositionAccordionSummary from './accordion/positions/AccordionSummary';
import PositionAccordionDetails from './accordion/positions/AccordionDetails';

import { RESPONSIBLE } from '../../../../Data/constants';


const ResponsibleList = ({
    positionsCount,
    usersCount,
    setSelectedId,
    handleDelete,
    openResponsibleModal,
    responsible_people
}) => {

    const [isOpenUserAccordion, setIsOpenUserAccordion] = useState(true)

    const {
        EMPTY_STATE_TITLE,
        EMPTY_STATE_DESCRIPTION,
    } = RESPONSIBLE;

    const handleOpenUserAccordion = () => {
        setIsOpenUserAccordion(true)
    }


    useEffect(() => {
        console.log(usersCount)
    }, [usersCount])

    return (
        <>

            {responsible_people?.length === 0 ?
                <BoxComponent
                    borderColor={grey[300]}
                    height={"60vh"}
                    borderRadius={10}
                    justifyContent={"center"}
                    alignItems={"center"}
                    display={"flex"}
                    flexDirection={"column"}
                >
                    <Typography level="title-md">{EMPTY_STATE_TITLE}</Typography>
                    <Typography level="body-sm">
                        {EMPTY_STATE_DESCRIPTION}
                    </Typography>

                    <ButtonComponent
                        startDecorator={<PlusIcon />}
                        label={"Assign Responsible Person"}
                        onClick={openResponsibleModal}
                    />
                </BoxComponent>
                :
                <Grid
                    container
                    spacing={1}
                >
                    <Grid xs={6}>
                        <BoxComponent>
                            <AccordionComponent
                                accordionSummary={
                                    <UserAccordionSummary
                                        usersCount={usersCount}
                                    />}
                                accordionDetails={
                                    <UserAccordionDetails
                                        setSelectedId={setSelectedId}
                                        handleOpenDeleteModal={handleDelete}
                                        responsible_people={responsible_people}
                                    />}
                            />
                        </BoxComponent>
                    </Grid>

                    <Grid xs={6}>
                        <BoxComponent>
                            <AccordionComponent
                                accordionSummary={
                                    <PositionAccordionSummary
                                        positionsCount={positionsCount}
                                    />}
                                accordionDetails={<PositionAccordionDetails
                                    setSelectedId={setSelectedId}
                                    handleOpenDeleteModal={handleDelete}
                                    responsible_people={responsible_people}
                                />}
                            />
                        </BoxComponent>
                    </Grid>
                </Grid>
            }

        </>
    )
}

export default ResponsibleList