import React from 'react';
import { ArrowRight } from 'lucide-react';
import ButtonComponent from '@Components/Common/ButtonComponent';

import ObjectivesLogo from '../../../../assets/dashboard/Objectives.svg';

import StatusCard from './StatusCard';

const ObjectivesCard = ({
    hasFunction = false,
    objectiveCounts,
    handleNavigate,
    height
}) => {
    return (
        <>
            <StatusCard
                height={height}
                hasFunction={hasFunction}
                logo={ObjectivesLogo}
                count={objectiveCounts}
                title={'objectives'}
                description={'Contains (14) success indicators in total on this request'}
                functionHandler={
                    <ButtonComponent
                        label={'Go to Objectives'}
                        size={'sm'}
                        onClick={hasFunction ? handleNavigate : null}
                        endDecorator={<ArrowRight />}
                        fullWidth
                    />
                }
            />

        </>
    )
}

export default ObjectivesCard