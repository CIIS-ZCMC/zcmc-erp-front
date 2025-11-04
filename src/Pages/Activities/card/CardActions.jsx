import React from 'react'

import { Chip, Stack } from '@mui/joy'
import { ArrowRight } from 'lucide-react'

const CardActions = ({
    resourcesCount,
    responsibleCount
}) => {
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
                    startDecorator={resourcesCount}
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
                    startDecorator={responsibleCount}
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