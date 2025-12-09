import React from "react";

import {
  AccordionGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/joy";

const AccordionComponent = ({
  accordionSummary,
  accordionDetails,
  defaultExpanded,
}) => {
  return (
    <>
      <AccordionGroup
        // variant='soft'
        transition="0.2s"
      >
        <Accordion defaultExpanded={defaultExpanded}>
          <AccordionSummary>{accordionSummary}</AccordionSummary>
          <AccordionDetails>{accordionDetails}</AccordionDetails>
        </Accordion>
      </AccordionGroup>
    </>
  );
};

export default AccordionComponent;
