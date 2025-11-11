import React from 'react';

import ResourcesLogo from '../../../../assets/dashboard/Resources.svg';

import StatusCard from './StatusCard';

const ResourcesCard = ({ resourcesCount, height }) => {
    return (
        <>
            <StatusCard
                height={height}
                hasFunction={false}
                logo={ResourcesLogo}
                title={'resources'}
                count={resourcesCount}
                description={'With (₱22,000,000.00) total allocated budget'}
            />
        </>
    )
}

export default ResourcesCard