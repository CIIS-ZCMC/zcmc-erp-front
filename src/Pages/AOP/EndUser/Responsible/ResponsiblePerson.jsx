import React, { useState } from 'react';

import { Stack } from '@mui/joy';

import ModalComponent from '@Components/Common/Dialog/ModalComponent';

import ResponsibleTitle from './ResponsibleTitle';
import ResponsibleStatus from './ResponsibleStatus';
import ResponsibleList from './ResponsibleList';

import ResponsibleModal from './modal/ResponsibleModal';

import { RESPONSIBLE } from '../../../../Data/constants';

const ResponsiblePerson = () => {

    const {
        MODAL_TITLE,
        MODAL_DESCRIPTION,
    } = RESPONSIBLE;

    const [isLoading, setIsLoading] = useState(false)
    const [openResponsibleModal, setOpenResponsibleModal] = useState(false);

    const handleOpenResponsibleModal = () => {
        setOpenResponsibleModal(true)
    }

    const handleCloseResponsibleModal = () => {
        setOpenResponsibleModal(false)
    }

    const handleAssignPerson = () => {
        console.log('working')
    }

    return (
        <>
            <Stack spacing={1}>
                <ResponsibleTitle />
                <ResponsibleStatus
                    openResponsibleModal={handleOpenResponsibleModal}
                />
                <ResponsibleList
                    openResponsibleModal={handleOpenResponsibleModal}
                />
            </Stack>


            <ModalComponent
                isOpen={openResponsibleModal}
                handleClose={handleCloseResponsibleModal}
                title={MODAL_TITLE}
                description={MODAL_DESCRIPTION}
                maxWidth={650}
                height={550}
                content={
                    <>
                        <ResponsibleModal />
                    </>
                }
                hasActionButtons={true}
                rightButtonLabel={'Assign Person'}
                rightButtonAction={() => handleAssignPerson()}
                isLoading={isLoading}
            />
        </ >
    )
}

export default ResponsiblePerson