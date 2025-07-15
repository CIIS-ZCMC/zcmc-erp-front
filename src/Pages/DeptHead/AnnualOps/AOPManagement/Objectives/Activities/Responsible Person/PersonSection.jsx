import React, { useEffect, useState } from 'react'

import { Stack, Box, Typography, Divider, Link } from '@mui/joy';
import { useLocation } from 'react-router-dom';

import useUserHook from '../../../../../../../Hooks/UserHook';
import useResponsiblePeopleHook from '../../../../../../../Hooks/ResponsiblePeopleHook';
import useModalHook from '../../../../../../../Hooks/ModalHook';

import AutocompleteComponent from '../../../../../../../Components/Form/AutocompleteComponent';
import ConfirmationModalComponent from '../../../../../../../Components/Common/Dialog/ConfirmationModalComponent';
import BoxComponent from '../../../../../../../Components/Common/Card/BoxComponent';

const SelectPersonComponent = ({ parentId, isEditing }) => {
    const { handleValue, getByActivityId } = useResponsiblePeopleHook();
    const { users: usersOptions } = useUserHook();

    const responsible = getByActivityId(parentId);
    const selectedUsers = responsible?.users || [];

    // useEffect(() => {
    //     console.log('responsible:', responsible);
    // }, [])

    return <Stack gap={1}>
        <AutocompleteComponent
            label={'Select Person/People'}
            placeholder='Select a responsible person'
            size={'md'}
            setValue={(value) => handleValue(parentId, "users", value)}
            options={usersOptions}
            disabled={!isEditing}
        />

        <Typography
            level="body-xs"
            fontWeight={400}
        >
            Selected People ({selectedUsers?.length})
        </Typography>
    </Stack>
}

const ResponsiblePersonList = ({ parentId }) => {

    const { responsible_people, removeResponsiblePersonnel, removeItem } = useResponsiblePeopleHook()
    const { setAlertDialog, setConfirmationModal, closeConfirmation } = useModalHook()

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [field, setField] = useState(null);
    const [localParentId, setLocalParentId] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [pin, setPin] = useState('')

    const filteredData = responsible_people?.filter((element) => element.activityId === parentId)[0] ?? []
    const users = filteredData?.users ?? [];

    if (users?.length === 0) {
        return (
            <Stack m={2} alignItems="center" justifyContent="center">
                <Typography level="body-xs">Please select responsible person/people</Typography>
            </Stack>
        );
    }

    const handleOpenDeleteModal = (id, field, parentId) => {
        setSelectedId(id)
        setField(field)
        setLocalParentId(parentId)
        setOpenDeleteModal(true)
        const data = {
            status: "warning",
            title: ` Are you sure you want to delete this responsible person?`,
            description:
                "The selected responsible person will be removed from the table. Please input authorization pin to proceed.",
        };
        setConfirmationModal(data);
    }

    const handleDeletePersonnel = async () => {
        try {

            setIsLoading(true)

            const formData = new FormData();
            formData.append("pin", pin);

            const result = await new Promise((resolve) => {
                removeItem(formData, (status, message,) =>
                    resolve({ status, message, })
                );
            });

            const { status, message } = result;

            if (status === 200) {
                setAlertDialog({
                    status: "success",
                    title: message,
                    description: message,
                })
                setSelectedId(null)
                setLocalParentId(null)
                setField(null)
                removeResponsiblePersonnel(selectedId, field, localParentId)
                setOpenDeleteModal(false);
                closeConfirmation();

            } else {
                setAlertDialog({
                    status: "error",
                    title: message,
                    description: message,
                });
            }
        }
        catch (error) {
            setIsLoading(false)
            setAlertDialog({
                status: "error",
                title: "Unexpected error",
                description: "Something went wrong. Please try again.",
            });
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {users?.map(({ id, label, designation }) => (
                <Box m={1} key={id}>
                    <Box
                        m={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Stack direction="column" m={1}>
                            <Typography>{label}</Typography>
                            <Typography level="body-xs" fontWeight={400}>
                                {designation}
                            </Typography>
                        </Stack>

                        <Link
                            component="button"
                            color="danger"
                            fontSize={14}
                            onClick={() => handleOpenDeleteModal(id, "users", parentId)}
                        >
                            Remove
                        </Link>
                    </Box>

                    <Divider />
                </Box>
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
                        rightButtonAction={() => handleDeletePersonnel()}
                        setAuthPin={setPin}
                        isLoading={isLoading}
                    />
                )
            }
        </>
    );
};


const PeronSection = ({ isEditing }) => {

    const location = useLocation()
    const activityId = location.state.parentId;

    const { getUsers } = useUserHook()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getUsers((status, message) => {
            // console.log(status)
            if (!(status >= 200 && status < 300)) { // if status not success
                return; //Toast error
            }
            setIsLoading(false)
        })
    }, [])

    return (
        <div>
            <BoxComponent>
                <SelectPersonComponent parentId={activityId} isEditing={isEditing} />
                <ResponsiblePersonList parentId={activityId} isEditing={isEditing} />
            </BoxComponent>



        </div >
    )
}

export default PeronSection