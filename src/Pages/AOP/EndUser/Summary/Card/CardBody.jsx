import React from 'react'

import { Typography } from '@mui/joy';

import { AOP_SUMMARY } from '../../../../../Data/constants';

const CardBody = () => {

    const { SUMMARY_CARD_BODY } = AOP_SUMMARY

    return (
        <>
            <Typography
                mt={2}
                level='body-sm'
                textAlign={'start'}
            >
                {SUMMARY_CARD_BODY}
            </Typography>
        </>
    )
}

export default CardBody