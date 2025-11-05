import React, { useEffect, useMemo } from 'react'

import { Tabs, TabList, Tab, TabPanel, Stack, Typography } from '@mui/joy'

import { X } from 'lucide-react'

import AutocompleteComponent from '@Components/Form/AutocompleteComponent'
import ChipComponent from '@Components/Common/ChipComponent'

import useUserHook from '../../../../../Hooks/UserHook'
import useJobPositionsHook from '../../../../../Hooks/JobPositionsHook'

import useResponsibleStore, { useResponsiblePeopleActions } from '../../../../../Store/ResponsibleStore';
import useUsersStore from '../../../../../Store/UsersStore';
import useJobPositionStore from '../../../../../Store/JobPositionsStore';


const ResponsibleModal = () => {

    const { responsiblePeople } = useResponsibleStore();
    const { setResponsiblePeople } = useResponsiblePeopleActions();

    const { users } = useUsersStore();
    const { jobPositions } = useJobPositionStore();

    const { getUsers } = useUserHook();
    const { getJobPositions } = useJobPositionsHook();

    // useEffect(() => {
    //     console.log(setResponsiblePeople)
    // }, [setResponsiblePeople])

    useEffect(() => {
        getUsers((status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            // setIsLoading(false);
        });

        getJobPositions((status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            // setIsLoading(false);
        });
    }, [])

    // Filter out users that are already selected
    const availableOptions = useMemo(() => {
        return users.filter(
            (user) => !responsiblePeople.some((p) => p.id === user.id)
        );
    }, [users, responsiblePeople]);

    return (
        <>
            <Tabs aria-label="Basic tabs" defaultValue={0} >

                <TabList tabFlex={1}>
                    <Tab>People (4)</Tab>
                    <Tab>Job Position(2)</Tab>
                </TabList>

                <TabPanel value={0}>
                    <AutocompleteComponent
                        label={'Select Person/People'}
                        size={'lg'}
                        placeholder='Search by name or department'
                        setValue={(value) => setResponsiblePeople(value)}
                        options={availableOptions}
                    // disabled={!isEditing}
                    />
                </TabPanel>

                <TabPanel value={1}>
                    <AutocompleteComponent
                        label={'Select job position'}
                        placeholder='Search by position or department'
                        size={'lg'}
                        setValue={(value) => setResponsiblePeople(value)}
                        options={jobPositions}
                    // disabled={!isEditing}
                    />
                </TabPanel>
            </Tabs>

            <Stack
                direction="row"
                spacing={1}
                gap={1}
                flexWrap="wrap"
            >
                {responsiblePeople.map(({ id, label }) => (
                    <ChipComponent
                        key={id}
                        variant="outlined"
                        color="success"
                        label={label}
                        endDecorator={true}
                        onClick={() => console.log('delete me:', id)}
                        status={'error'}
                    />
                ))}
            </Stack>
        </>
    )
}

export default ResponsibleModal