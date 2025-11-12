import React from 'react';

import { Stack, Typography } from '@mui/joy';

import BoxComponent from '@Components/Common/Card/BoxComponent';

import PersonsLogo from '../../../../assets/dashboard/Persons.svg'

import StatusCard from './StatusCard';

const ObjectivesCard = ({ PersonsCount, height, designationCount, usersCount }) => {
    return (
        <>

            <StatusCard
                height={height}
                hasFunction={false}
                logo={PersonsLogo}
                title={'responsible person'}
                count={PersonsCount}
                description={`Includes (${designationCount}) job positions and (${usersCount}) persons in total`}
            />

        </>
    )
}

export default ObjectivesCard