import React from 'react'

import ConfirmationModalComponent from '@Components/Common/Dialog/ConfirmationModalComponent'

const CancelModal = ({
    openCancelRequestModal,
    leftButtonAction,
    rightButtonAction,
    isLoading,
}) => {
    return (
        <>
            {openCancelRequestModal && (
                <ConfirmationModalComponent
                    leftButtonLabel={"Cancel"}
                    leftButtonAction={leftButtonAction}
                    rightButtonAction={rightButtonAction}
                    rightButtonLabel="Proceed"
                    isLoading={isLoading}
                />
            )}
        </>
    )
}

export default CancelModal