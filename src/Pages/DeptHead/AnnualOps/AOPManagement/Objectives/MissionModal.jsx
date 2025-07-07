import React, { useEffect } from 'react'

import ModalComponent from '../../../../../Components/Common/Dialog/ModalComponent'
import TextareaComponent from '../../../../../Components/Form/TextareaComponent'

const MissionModal = ({
    APPLICATION_OBJECTIVE_ID,
    openSaveMissionModal,
    handleCloseDialog,
    mission,
    setMission,
    handleSaveMission,
}) => {
    return (
        <div>
            {/* Create Update Mission Modal */}
            <ModalComponent
                isOpen={openSaveMissionModal}
                handleClose={handleCloseDialog}
                title={APPLICATION_OBJECTIVE_ID ? 'Update mission' : 'Create mission'}
                description={`Define the core purpose and primary focus of the organization's operational efforts for the upcoming fiscal year. This statement should guide the development and execution of the annual plan.`}
                content={
                    <>
                        <TextareaComponent
                            // label={'Mission'}
                            placeholder={"Please insert mission content here"}
                            value={mission}
                            onChange={(e) => setMission(e.target.value)}
                        />
                    </>
                }
                hasActionButtons={true}
                rightButtonLabel={APPLICATION_OBJECTIVE_ID ? 'Update' : "Save"}
                rightButtonAction={() => handleSaveMission()}
            />
        </div>
    )
}

export default MissionModal