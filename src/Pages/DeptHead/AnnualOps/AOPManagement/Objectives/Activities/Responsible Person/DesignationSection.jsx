import React, { useEffect, useState } from 'react'

import { Stack, Box, Typography, Divider, Link } from '@mui/joy';
import { useLocation } from 'react-router-dom';

import useJobPositionsHook from '../../../../../../../Hooks/JobPositionsHook';
import useResponsiblePeopleHook from '../../../../../../../Hooks/ResponsiblePeopleHook';
import useModalHook from '../../../../../../../Hooks/ModalHook';

import BoxComponent from '../../../../../../../Components/Common/Card/BoxComponent';
import AutocompleteComponent from '../../../../../../../Components/Form/AutocompleteComponent';
import ConfirmationModalComponent from '../../../../../../../Components/Common/Dialog/ConfirmationModalComponent';

const SelectJobPositionComponent = ({ parentId }) => {
    const { getByActivityId, handleValue } = useResponsiblePeopleHook();
    const { jobPositions } = useJobPositionsHook()

    const responsible = getByActivityId(parentId);
    const selectedDesignations = responsible?.designations || []

    return <Stack gap={1}>
        <AutocompleteComponent
            label={'Select job position'}
            placeholder='Select a job position'
            size={'md'}
            setValue={(value) => handleValue(parentId, "designations", value)}
            options={jobPositions}
        />

        <Typography
            level="body-xs"
            fontWeight={400}
        >
            Selected Job Positions ({selectedDesignations?.length})
        </Typography>
    </Stack>
}

const JobPositionList = ({ parentId }) => {

    const { responsible_people, removeResponsiblePersonnel } = useResponsiblePeopleHook();
    const { setAlertDialog, setConfirmationModal, closeConfirmation } = useModalHook()

    const filteredData = responsible_people?.filter((element) => element.activityId === parentId)[0] ?? []
    const designations = filteredData?.designations
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [field, setField] = useState(null);
    const [localParentId, setLocalParentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const handleOpenDeleteModal = (id, field, parentId) => {
        setSelectedId(id)
        setField(field)
        setLocalParentId(parentId)
        setOpenDeleteModal(true)
        const data = {
            status: "error",
            title: ` Are you sure you want to delete this responsible person?`,
            description:
                "The selected responsible person will be removed from the table. Please input authorization pin to proceed.",
        };
        setConfirmationModal(data);
    }

    const handleDeleteDesignation = () => {
        setIsLoading(true)
        try {
            setTimeout(() => {
                removeResponsiblePersonnel(selectedId, field, localParentId)
                setOpenDeleteModal(false)
                closeConfirmation()
                setIsLoading(false)
            }, 1000);
        } catch (error) {
            setIsLoading(false)
            setAlertDialog({
                status: "error",
                title: "Unexpected error",
                description: "Something went wrong. Please try again.",
            });
        }
    }

    if (designations?.length === 0) {
        return <Stack
            m={2}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Typography
                level='body-xs'
            >
                Please select job position(s)
            </Typography>
        </Stack>
    }

    return <>
        {designations?.map(({ id, label, code }) => (
            < Box
                m={1}
            >
                <Box
                    key={id}
                    m={1}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Box
                        display={'flex'}
                        alignItems={'center'}
                    >
                        <Stack
                            direction={'column'}
                            m={1}
                        >
                            <Typography>
                                {label}
                            </Typography>
                            <Typography
                                level="body-xs"
                                fontWeight={400}
                            >
                                {code}
                            </Typography>

                        </Stack>

                    </Box>

                    <Box>
                        <Link
                            component="button"
                            color='danger'
                            fontSize={14}
                            onClick={() => handleOpenDeleteModal(id, 'designations', parentId)}
                        >
                            Remove
                        </Link>
                    </Box>
                </Box>

                <Divider />
            </Box >

        ))}

        {
            openDeleteModal && (
                <ConfirmationModalComponent
                    withAuthPin={true}
                    leftButtonLabel="Cancel"
                    leftButtonAction={() => {
                        setOpenDeleteModal(false)
                        closeConfirmation()
                    }}
                    rightButtonLabel="Delete"
                    rightButtonAction={() => handleDeleteDesignation()}
                    // setAuthPin={setPin}
                    isLoading={isLoading}
                />
            )
        }
    </>
}

const DesignationSection = () => {

    const location = useLocation();
    const activityId = location.state.parentId;

    const { getJobPositions } = useJobPositionsHook();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getJobPositions((status, message) => {
            if (!(status >= 200 && status < 300)) {
                return
            }
            setIsLoading(false)
        })
    }, [])

    return (
        <div>
            <BoxComponent>
                <SelectJobPositionComponent parentId={activityId} />
                <JobPositionList parentId={activityId} />
            </BoxComponent>
        </div >
    )
}

export default DesignationSection