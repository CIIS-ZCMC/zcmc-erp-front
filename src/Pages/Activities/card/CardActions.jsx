import React from 'react'

import { Chip, Stack } from '@mui/joy'
import { ArrowRight } from 'lucide-react'

const CardActions = () => {
    return (
        <>
            <Stack
                gap={1}
                direction={'row'}
                alignItems={'center'}
                justifyContent={'end'}
            >
                <Chip
                    variant="outlined"
                    color="primary"
                    size="md"
                    p={2}
                    startDecorator={10}
                    endDecorator={<ArrowRight size={18} />}
                // onClick={handleActivities}
                >
                    Resources
                </Chip>

                <Chip
                    variant="outlined"
                    color="primary"
                    size="md"
                    p={2}
                    startDecorator={10}
                    endDecorator={<ArrowRight size={18} />}
                // onClick={handleActivities}
                >
                    Responsible Person
                </Chip>
            </Stack>

        </>
    )
}

export default CardActions