import {
  Accordion,
  accordionClasses,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import "./accordion.css";
import { ChevronDown, Pencil } from "lucide-react";

function CustomAccordionComponent({
  id,
  children,
  expanded,
  setExpanded,
  title,
  withEdit,
  size,
}) {
  const isOpen = Array.isArray(expanded)
    ? expanded.includes(id)
    : expanded === id;

  const handleExpand = () => {
    if (isOpen) {
      setExpanded((prev) =>
        Array.isArray(prev) ? prev.filter((item) => item !== id) : []
      );
    } else {
      setExpanded((prev) => (Array.isArray(prev) ? [...prev, id] : [id]));
    }
  };

  return (
    <Sheet
      sx={(theme) => ({
        [`& .${accordionClasses.root}`]: {
          border: 1,
          borderColor: "neutral.100",
          borderRadius: 8,
          px: 1,
          background: "white",
          width: "100%",
          "& button:hover": {
            background: "transparent",
          },
        },
        [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
          borderColor: "neutral.400",
        },
        '& [aria-expanded="true"]': {
          boxShadow: `inset 0 -1px 0 ${theme.vars.palette.divider}`,
        },
      })}
    >
      <Accordion expanded={isOpen}>
        <AccordionSummary indicator={null}>
          <Stack
            direction={"row"}
            alignItems={"center"} // Ensures vertical alignment of children in the row
            justifyContent={"space-between"}
            width="100%"
            sx={{
              margin: 0,
              paddingY: 1, // Reset padding to avoid excess space
              width: "100%",
            }}
          >
            <Typography
              textColor={"success.800"}
              level={size == "sm" ? "body-sm" : "body-md"}
            >
              {title}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1}>
              {withEdit && (
                <IconButton
                  variant="soft"
                  size="sm"
                  component="a"
                  href="#as-link"
                >
                  <Pencil size={16} />
                </IconButton>
              )}
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <IconButton
                  variant="soft"
                  size="sm"
                  component="a"
                  href="#as-link"
                  onClick={handleExpand}
                >
                  <ChevronDown size={18} />
                </IconButton>
              </motion.div>
            </Stack>
          </Stack>
        </AccordionSummary>

        <AnimatePresence initial={false}>
          {isOpen && (
            <AccordionDetails
              component={motion.div}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto", padding: 5 }}
              exit={{ opacity: 0, height: 0, padding: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Box py={1.5}>{children}</Box>
            </AccordionDetails>
          )}
        </AnimatePresence>
      </Accordion>
    </Sheet>
  );
}
export default CustomAccordionComponent;
