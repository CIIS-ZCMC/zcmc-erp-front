import React from 'react'

import PesoLogo from '../../../../assets/dashboard/Peso.svg'

import StatusCard from './StatusCard'

const CostCard = ({ totalCost, height }) => {
    return (
        <>
            <StatusCard
                height={height}
                hasFunction={false}
                logo={PesoLogo}
                count={totalCost}
                title={'total cost'}
            />
        </>
    )
}

export default CostCard