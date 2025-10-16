import React from 'react'

import ConfirmationModalComponent from '@Components/Common/Dialog/ConfirmationModalComponent'

const ConfirmationModal = ({
    rightButtonAction,
    withAuthPin,
    rightButtonDisabled,
    setAuthPin,
    isLoading,
    openConfirmDialog
}) => {
    return (
        <>
            {openConfirmDialog && (
                <ConfirmationModalComponent
                    leftButtonlabel={"Back to editor"}
                    rightButtonAction={rightButtonAction}
                    withAuthPin={withAuthPin}
                    rightButtonDisabled={!rightButtonDisabled}
                    setAuthPin={setAuthPin}
                    isLoading={isLoading}
                />
            )}
        </>
    )
}

export default ConfirmationModal