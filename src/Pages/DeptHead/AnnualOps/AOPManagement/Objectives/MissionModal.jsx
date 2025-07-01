import React from 'react'

import ModalComponent from '../../../../../Components/Common/Dialog/ModalComponent'
import TextareaComponent from '../../../../../Components/Form/TextareaComponent'

const MissionModal = ({
    AOP_APPLICATION_ID,
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
                title={AOP_APPLICATION_ID ? 'Update mission' : 'Create mission'}
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
                rightButtonLabel={AOP_APPLICATION_ID ? 'Update' : "Save"}
                rightButtonAction={() => handleSaveMission()}
            />
        </div>
    )
}

export default MissionModal