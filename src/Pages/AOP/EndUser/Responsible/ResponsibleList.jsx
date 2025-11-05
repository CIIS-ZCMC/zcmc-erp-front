import React from 'react'

import { Typography } from '@mui/joy';
import { PlusIcon } from 'lucide-react';
import { grey } from '@mui/material/colors';

import BoxComponent from '@Components/Common/Card/BoxComponent';
import ButtonComponent from '@Components/Common/ButtonComponent';

import { RESPONSIBLE } from '../../../../Data/constants';

const ResponsibleList = ({
    openResponsibleModal
}) => {

    const {
        EMPTY_STATE_TITLE,
        EMPTY_STATE_DESCRIPTION,
    } = RESPONSIBLE;

    return (
        <>
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
        </>
    )
}

export default ResponsibleList