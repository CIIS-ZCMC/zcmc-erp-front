import React, { useState } from "react";
import {
  AccordionGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/joy";

const AccordionComponent = ({
  accordionSummary,
  accordionDetails,
  defaultExpanded = false,
  expandedStyles = {},
  summaryStyles = (expanded) => ({}), // function returning object
  detailsStyles = {},
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <AccordionGroup transition="0.2s">
      <Accordion
        expanded={expanded}
        onChange={(event, isExpanded) => setExpanded(isExpanded)}
        sx={{
          transition: "all 0.2s",
          ...(expanded ? expandedStyles : {}), // apply ONLY when expanded
        }}
      >
        <AccordionSummary
          sx={{
            transition: "all 0.2s",
            ...summaryStyles(expanded), // call the function here
          }}
        >
          {accordionSummary}
        </AccordionSummary>
        <AccordionDetails sx={{ ...detailsStyles }}>
          {accordionDetails}
        </AccordionDetails>
      </Accordion>
    </AccordionGroup>
  );
};

export default AccordionComponent;
