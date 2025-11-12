import React, { useEffect } from 'react';

import ResourcesLogo from '../../../../assets/dashboard/Resources.svg';

import StatusCard from './StatusCard';
import formattedPrice from '../../../../Utils/formattedPrice';

const ResourcesCard = ({ resourcesCount, height, totalCost }) => {

    const formattedCost = formattedPrice(totalCost)

    return (
        <>
            <StatusCard
                height={height}
                hasFunction={false}
                logo={ResourcesLogo}
                title={'resources'}
                count={resourcesCount}
                description={`With (${formattedCost}) total allocated budget`}
            />
        </>
    )
}

export default ResourcesCard