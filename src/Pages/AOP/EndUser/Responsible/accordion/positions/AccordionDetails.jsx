import React, { Fragment } from 'react'

import {
    Stack,
    List,
    ListItem,
    IconButton,
    Divider,
    Typography,
} from '@mui/joy'

import { X } from 'lucide-react'

const AccordionDetails = ({
    setSelectedId,
    handleOpenDeleteModal,
    responsible_people
}) => {

    const handleDelete = (id) => {
        // console.log('id to be deleted', id)
        setSelectedId(id)
        handleOpenDeleteModal(id)
    }

    return (
        <>
            <Stack spacing={1.5}>
                {responsible_people?.filter(({ user }) => user === null).length === 0 ? (
                    <Typography p={2} textAlign="center" level="title-md">
                        Please assign a designation
                    </Typography>
                ) : (
                    responsible_people
                        ?.filter(({ user }) => user === null)
                        .map(({ designation, responsible_person_id }) => (
                            <Fragment key={responsible_person_id}>
                                <List sx={{ marginTop: 1 }}>
                                    <ListItem
                                        endAction={
                                            <IconButton
                                                onClick={() => handleDelete(responsible_person_id)}
                                                aria-label="Delete"
                                                size="sm"
                                            >
                                                <X />
                                            </IconButton>
                                        }
                                    >
                                        <Stack mt={2} direction="column">
                                            <Typography level="title-sm">{designation?.name}</Typography>
                                        </Stack>
                                    </ListItem>
                                </List>
                                <Divider />
                            </Fragment>
                        ))
                )}
            </Stack>

        </>
    )
}

export default AccordionDetails