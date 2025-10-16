import React from 'react';

import { Checkbox } from '@mui/joy';
import ConfirmationModalComponent from '@Components/Common/Dialog/ConfirmationModalComponent';

import { AOP_CONSTANTS } from '../../../../../../Data/constants';


import useObjectivesHook from '../../../../../../Hooks/ObjectivesHook';

const DiscussedModal = ({
    openConfirmDiscussedDialog,
    isLoading,
    rightButtonAction,
    leftButtonAction
}) => {

    const { setIsDiscussed, hasDiscussed } = useObjectivesHook();

    return (
        <>
            {openConfirmDiscussedDialog && (
                <ConfirmationModalComponent
                    leftButtonLabel={"Cancel"}
                    leftButtonAction={leftButtonAction}
                    rightButtonAction={rightButtonAction}
                    rightButtonLabel="Proceed"
                    rightButtonDisabled={!hasDiscussed}
                    isLoading={isLoading}
                    content={
                        <>
                            <Checkbox
                                label={AOP_CONSTANTS.DISCUSSED_LABEL}
                                onChange={(e) => {
                                    setIsDiscussed(e.target.checked);
                                }}
                                checked={hasDiscussed}
                            />
                        </>
                    }
                />
            )}
        </>
    )
}

export default DiscussedModal