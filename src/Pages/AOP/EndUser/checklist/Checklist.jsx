import React, { useState, useEffect } from 'react';

import { Typography, List, ListItem, ListDivider, ListItemDecorator, Stack, Checkbox } from '@mui/joy';

import BoxComponent from '@Components/Common/Card/BoxComponent';


import useAOPHook from '../../../../Hooks/AOP/AOPHook';
import useAOPStore from '../../../../Store/AOPStore';

const Checklist = ({ fiscalYear }) => {

    const { getAopChecklist } = useAOPHook();
    const { aopChecklist } = useAOPStore();

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true);

        const params = { year: fiscalYear }

        getAopChecklist(params, (status, message) => {
            if (!(status >= 200 && status < 300)) {
                // if status not success
                return; //Toast error
            }
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        console.log('aop check list:', aopChecklist)
    }, [aopChecklist])

    return (
        <>
            <BoxComponent height="65vh" padding={2}>
                <Typography level="title-lg">AOP Submission Checklist</Typography>

                <Stack
                    mt={3}
                >
                    <List
                        size='lg'
                        component="nav"
                        variant=''
                    >

                        {aopChecklist?.map(({ title, description, status }) => (
                            <>
                                <ListItem>
                                    <ListItemDecorator>
                                        <Checkbox

                                            checked={!!status}
                                            color={!!status && "success"}
                                        />
                                    </ListItemDecorator>
                                    <Stack>
                                        <Typography level={status ? "title-sm" : 'body-sm'}>{title}</Typography>
                                        <Typography level="body-xs">{description}</Typography>
                                    </Stack>
                                </ListItem >
                                <ListDivider inset={'gutter'} />
                            </>
                        ))}

                    </List>
                </Stack>

            </BoxComponent >
        </>
    )
}

export default Checklist