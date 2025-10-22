import React from 'react'

import { Chip } from '@mui/joy'
import { ArrowRight } from 'lucide-react'

const CardActions = ({
    handleActivities
}) => {
    return (
        <>
            <Chip
                variant="outlined"
                color="primary"
                size="lg"
                p={2}
                startDecorator={10}
                endDecorator={<ArrowRight size={18} />}
                onClick={handleActivities}
            >
                Activities
            </Chip>
        </>
    )
}

export default CardActions