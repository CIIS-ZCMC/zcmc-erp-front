import React from 'react'

import { Stack } from '@mui/joy'
import ButtonComponent from '@Components/Common/ButtonComponent'

const Footer = () => {
    return (
        <>
            <Stack
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
            >

                <ButtonComponent
                    label="Last"
                    variant="outlined"
                    onClick={() => { }}
                    size={'sm'}
                />
                <ButtonComponent
                    label="Next"
                    variant="outlined"
                    onClick={() => { }}
                    size={'sm'}

                />
            </Stack>
        </>
    )
}

export default Footer