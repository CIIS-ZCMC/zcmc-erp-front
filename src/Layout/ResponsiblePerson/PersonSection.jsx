import React, { useEffect, useState } from 'react'

import { Stack, Box, Typography, Divider, Link } from '@mui/joy';

import useUserHook from '../../Hooks/UserHook';
import useResponsiblePeopleHook from '../../Hooks/ResponsiblePeopleHook';
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent';
import BoxComponent from '../../Components/Common/Card/BoxComponent'
import { useLocation } from 'react-router-dom';


const SelectPersonComponent = () => {
    const { users, handleValue } = useResponsiblePeopleHook();
    const { users: usersOptions } = useUserHook()

    const location = useLocation()
    const pathSegments = location.pathname.split('/');
    const activityId = pathSegments[5];

    return <Stack gap={1}>
        <AutocompleteComponent
            label={'Select Person/People'}
            placeholder='Select a responsible person'
            // value={user?.name || ''}
            size={'md'}
            setValue={(value) => handleValue(activityId, "users", value)}
            options={usersOptions}
        />

        <Typography
            level="body-xs"
            fontWeight={400}
        >
            Selected People ({users?.length})
        </Typography>
    </Stack>
}

const ResponsiblePersonList = () => {

    const { responsible_people, removeData } = useResponsiblePeopleHook();

    const location = useLocation()
    const pathSegments = location.pathname.split('/');
    const activityId = pathSegments[5];

    const filteredUsers = responsible_people?.filter((element) => element.activity_index === activityId)[0] ?? []

    // useEffect(() => {
    //     console.log(filteredUsers)
    // }, [filteredUsers])

    const users = filteredUsers?.users

    if (users?.length === 0) {
        return <Stack
            m={2}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Typography
                level='body-xs'
            >
                Please select responsbile person/people
            </Typography>
        </Stack>;
    }

    return <>
        {
            users?.map(({ id, name, designation }) => (
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
                                    {name}
                                </Typography>
                                <Typography
                                    level="body-xs"
                                    fontWeight={400}
                                >
                                    {designation}
                                </Typography>

                            </Stack>

                        </Box>

                        <Box>
                            <Link
                                component="button"
                                color='danger'
                                fontSize={14}
                                onClick={() => removeData(id, 'users', activityId)}
                            >
                                Remove
                            </Link>
                        </Box>
                    </Box>

                    <Divider />
                </Box>
            ))
        }
    </>
}

const PersonSection = () => {

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
                <SelectPersonComponent />
                <ResponsiblePersonList />
            </BoxComponent>
        </div >
    )
}

export default PersonSection