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
  expanded,
  onChange,
  expandedStyles = {},
  summaryStyles = (expanded) => ({}), // function returning object
  detailsStyles = {},
}) => {
  // const [expanded, setExpanded] = useState(defaultExpanded);

  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  const isExpanded = expanded !== undefined ? expanded : internalExpanded;
  const handleChange = (event, newExpanded) => {
    if (onChange) {
      onChange(event, newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  };

  return (
    <AccordionGroup transition="0.2s">
      <Accordion
        expanded={isExpanded}
        onChange={handleChange}
        sx={{
          transition: "all 0.2s",
          ...(isExpanded ? expandedStyles : {}), // apply ONLY when expanded
        }}
      >
        <AccordionSummary
          sx={{
            transition: "all 0.2s",
            ...summaryStyles(isExpanded), // call the function here
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
