import React, { useEffect, useState } from 'react'

import { Stack, Grid, Box, Typography, Divider } from '@mui/joy';
import { Trash } from 'lucide-react';

import useUserHook from '../../Hooks/UserHook';

import ButtonComponent from '../../Components/Common/ButtonComponent';
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent';
import BoxComponent from '../../Components/Common/Card/BoxComponent'

const PersonSection = () => {

    const { getUsers } = useUserHook()

    // local state
    const [usersOptions, setUsersOptions] = useState([
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
    ])

    const [users, setUsers] = useState([])

    const [user, setUser] = useState({
        id: null,
        name: '',
        designation: ''
    })

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

    const handleSelectedUser = (selectedValue) => {
        if (!selectedValue) return;

        // setUser(selectedValue);
        setUsers((prevUsers) => {
            const alreadyExists = prevUsers.some((u) => u.id === selectedValue.id);
            return alreadyExists ? prevUsers : [...prevUsers, selectedValue];
        });
        setUser({ id: null, name: '', designation: '' });
    };
    const handleRemoveUser = (id) => {
        const filteredUsers = users.filter((user) => user.id !== id)
        setUsers(filteredUsers)
        // alert(`Are you sure to delete ${id}`)
    }

    // useEffect(() => {
    //     console.log(users)
    // }, [users])

    return (
        <div>
            <BoxComponent>

                <Stack gap={1}>
                    <AutocompleteComponent
                        label={'Select Person/People'}
                        placeholder='Select a responsible person'
                        value={user?.name || ''}
                        size={'md'}
                        setValue={(value) => handleSelectedUser(value)}
                        options={usersOptions}
                    />

                    <Typography
                        level="body-xs"
                        fontWeight={400}
                    >
                        Selected People ({users.length})
                    </Typography>
                </Stack>

                {users?.map(({ id, name, designation }) => (
                    <Box
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
                                <ButtonComponent
                                    onClick={() => handleRemoveUser(id)}
                                    label={'Remove'}
                                    variant={'text'}
                                    endDecorator={<Trash size={12} />}
                                    size={'sm'}
                                />
                            </Box>
                        </Box>

                        <Divider />
                    </Box>
                ))}
            </BoxComponent>
        </div>
    )
}

export default PersonSection