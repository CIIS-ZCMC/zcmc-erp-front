import React from 'react'

import { Chip } from '@mui/joy'
import { ArrowRight } from 'lucide-react'

const CardActions = ({
    handleActivities,
    count
}) => {
    return (
        <>
            <Chip
                variant="outlined"
                color="primary"
                size="lg"
                p={2}
                startDecorator={count === 0 ? "0" : count}
                endDecorator={<ArrowRight size={18} />}
                onClick={handleActivities}
            >
                Activities
            </Chip>
        </>
    )
}

export default CardActions