import React from 'react'

import {
    AccordionGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/joy'

const AccordionComponent = ({
    accordionSummary,
    accordionDetails
}) => {
    return (
        <>
            <AccordionGroup
                // variant='soft'
                transition="0.2s"
            >
                <Accordion>
                    <AccordionSummary>
                        {accordionSummary}
                    </AccordionSummary>
                    <AccordionDetails>
                        {accordionDetails}
                    </AccordionDetails>
                </Accordion>

            </AccordionGroup>
        </ >
    )
}

export default AccordionComponent