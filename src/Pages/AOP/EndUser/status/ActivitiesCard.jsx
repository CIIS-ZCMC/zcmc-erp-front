import React from 'react'

import ActivitiesLogo from '../../../../assets/dashboard/Activities.svg';

import StatusCard from './StatusCard';

const ActivitiesCard = ({
    activitiesCount,
    height,
    gadActivitiesCount,
    nonGadActivitiesCount,
}) => {
    return (
        <>
            <StatusCard
                height={height}
                hasFunction={false}
                logo={ActivitiesLogo}
                title={'activities'}
                count={activitiesCount}
                description={`Where (${gadActivitiesCount}) are GAD-related and (${nonGadActivitiesCount}) are not GAD-related on this request`}
            />
        </>
    )
}

export default ActivitiesCard