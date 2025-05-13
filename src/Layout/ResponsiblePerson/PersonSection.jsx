import React, { useEffect, useState } from 'react'

import { Stack, Box, Typography, Divider, Link } from '@mui/joy';
import { useLocation } from 'react-router-dom';

import useUserHook from '../../Hooks/UserHook';
import useResponsiblePeopleHook from '../../Hooks/ResponsiblePeopleHook';

import AutocompleteComponent from '../../Components/Form/AutocompleteComponent';
import BoxComponent from '../../Components/Common/Card/BoxComponent'


const SelectPersonComponent = ({ parentId }) => {
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

    const { responsible_people } = useResponsiblePeopleHook()

    const filteredData = responsible_people?.filter((element) => element.activityId === parentId)[0] ?? []
    const users = filteredData?.users;

    if (users?.length === 0) {
        return (
            <Stack m={2} alignItems="center" justifyContent="center">
                <Typography level="body-xs">Please select responsible person/people</Typography>
            </Stack>
        );
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
                            onClick={() => removeData(id, "users", parentId)}
                        >
                            Remove
                        </Link>
                    </Box>

                    <Divider />
                </Box>
            ))}
        </>
    );
};


const PersonSection = () => {

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
                <SelectPersonComponent parentId={activityId} />
                <ResponsiblePersonList parentId={activityId} />
            </BoxComponent>
        </div >
    )
}

export default PersonSection