import React, { useEffect, useState } from 'react'

import { Stack, Grid, Box, Typography, Divider, Link } from '@mui/joy';

import useUserHook from '../../Hooks/UserHook';
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent';
import BoxComponent from '../../Components/Common/Card/BoxComponent'

const usersOptions = [
    {
        id: 1,
        name: 'Art',
        label: 'Art',
        designation: 'Programmer'
    },
    {
        id: 2,
        name: 'Kim',
        label: 'Kim',
        designation: 'Programmer'
    }
]

const PersonSection = ({
    users,
    setUsers,
    user,
    setUser,
    handleSelectedData,
    handleRemove,
}) => {

    const { getUsers } = useUserHook()
    const [isLoading, setIsLoading] = useState(false)
    // const [usersOptions, setUserOptions] = useState([]);

    useEffect(() => {
        getUsers((status, message) => {
            // console.log(status)
            if (!(status >= 200 && status < 300)) { // if status not success
                return; //Toast error
            }
            setIsLoading(false)
            // setUsersOptions(users) set users options
        })
    }, [])

    return (
        <div>
            <BoxComponent>

                <Stack gap={1}>
                    <AutocompleteComponent
                        label={'Select Person/People'}
                        placeholder='Select a responsible person'
                        // value={user?.name || ''}
                        size={'md'}
                        setValue={(value) => handleSelectedData(value, setUsers, true)}
                        options={usersOptions}
                    />

                    <Typography
                        level="body-xs"
                        fontWeight={400}
                    >
                        Selected People ({users.length})
                    </Typography>
                </Stack>

                {users.length === 0 ?
                    <Stack
                        m={2}
                        alignItems={'center'}
                        justifyContent={'center'}
                    >
                        <Typography
                            level='body-xs'
                        >
                            Please select responsbile person/people
                        </Typography>
                    </Stack>

                    : users?.map(({ id, name, designation }) => (
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
                                        onClick={() => handleRemove(id, users, setUsers)}
                                    >
                                        Remove
                                    </Link>
                                </Box>
                            </Box>

                            <Divider />
                        </Box>
                    ))}
            </BoxComponent>
        </div >
    )
}

export default PersonSection