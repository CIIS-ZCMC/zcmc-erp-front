import React, { Fragment } from 'react'

import { FeedbackContent } from '../../../../PlanningOps/Approval/Contents/FeedbackContent'

const FeedbackSection = ({
    openFeedbackModal,
    setOpenFeedbackModal,
    isRemarksLoading,
}) => {
    return (
        <Fragment>
            <FeedbackContent
                openFeedbackModal={openFeedbackModal}
                setOpenFeedbackModal={setOpenFeedbackModal}
                isLoading={isRemarksLoading}
            />
        </Fragment>
    )
}

export default FeedbackSection