import React from 'react'

import PesoLogo from '../../../../assets/dashboard/Peso.svg'

import StatusCard from './StatusCard'

import formattedPrice from '../../../../Utils/formattedPrice'

const CostCard = ({ totalCost, height }) => {
    return (
        <>
            <StatusCard
                height={height}
                hasFunction={false}
                logo={PesoLogo}
                count={formattedPrice(totalCost)}
                title={'total cost'}
            />
        </>
    )
}

export default CostCard