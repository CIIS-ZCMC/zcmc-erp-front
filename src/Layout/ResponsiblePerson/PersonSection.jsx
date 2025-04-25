import React, { useEffect, useState } from 'react'

import { Stack, Box, Typography, Divider, Link } from '@mui/joy';

import useUserHook from '../../Hooks/UserHook';
import useResponsiblePersonHook from '../../Hooks/ResponsiblePersonHook';
import AutocompleteComponent from '../../Components/Form/AutocompleteComponent';
import BoxComponent from '../../Components/Common/Card/BoxComponent'


const SelectPersonComponent = () => {
    const key = 'users';
    const { users, setData } = useResponsiblePersonHook();
    const { users: usersOptions } = useUserHook()

    return <Stack gap={1}>
        <AutocompleteComponent
            label={'Select Person/People'}
            placeholder='Select a responsible person'
            // value={user?.name || ''}
            size={'md'}
            setValue={(value) => setData(key, value)}
            options={usersOptions}
        />

        <Typography
            level="body-xs"
            fontWeight={400}
        >
            Selected People ({users.length})
        </Typography>
    </Stack>
}

const ResponsiblePersonList = () => {
    const { users, removeData } = useResponsiblePersonHook();

    if (users.length === 0) {
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

    return <>{
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
                            onClick={() => removeData(id, 'users')}
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