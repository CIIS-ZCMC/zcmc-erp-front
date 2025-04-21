import {
  Accordion,
  accordionClasses,
  AccordionDetails,
  Box,
  Divider,
  IconButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";

import { AnimatePresence, motion } from "motion/react"; // eslint-disable-next-line no-unused-vars
import React from "react";
import "./accordion.css";
import { ChevronDown, Pencil } from "lucide-react";
import useAccordionHook from "../../../Hooks/AccordionHook";

function CustomAccordionComponent({
  id,
  children,
  expanded,
  title,
  withEdit,
  size,
  name,
  onClickEdit,
}) {
  const { handleExpand, rotationId, rotation } = useAccordionHook();
  const isOpen = React.useMemo(() => {
    if (!Array.isArray(expanded)) return false;
    return expanded.some((item) => item?.id === id && item?.name === name);
  }, [expanded, id, name]);

  const handleClick = () => {
    handleExpand(isOpen, id, name);
  };

  return (
    <Sheet
      sx={(theme) => ({
        [`& .${accordionClasses.root}`]: {
          border: 1,
          borderColor: theme.vars.palette.neutral[100],
          borderRadius: 8,
          px: 1,
          background: theme.vars.palette.background.body,
          width: "100%",
          "& button:hover": {
            background: "transparent",
          },
        },
        [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
          borderColor: theme.vars.palette.neutral[300],
        },
      })}
    >
      <Accordion expanded={isOpen}>
        <Box>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            width="100%"
            sx={{
              margin: 0,
              paddingY: 1,
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
                  onClick={onClickEdit}
                >
                  <Pencil size={16} />
                </IconButton>
              )}

              <IconButton
                variant="soft"
                size="sm"
                onClick={handleClick}
                sx={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.5s ease",
                }}
              >
                <ChevronDown size={18} />
              </IconButton>
            </Stack>
          </Stack>
          {isOpen && <Divider />}
        </Box>

        <AccordionDetails>
          <AnimatePresence>
            {isOpen && rotationId == id && rotation ? (
              <Box
                py={1.5}
                component={motion.div}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </Box>
            ) : (
              <Box
                py={1.5}
                component={motion.div}
                animate={{ opacity: 1, height: "auto" }}
              >
                {children}
              </Box>
            )}
          </AnimatePresence>
        </AccordionDetails>
      </Accordion>
    </Sheet>
  );
}
export default CustomAccordionComponent;
