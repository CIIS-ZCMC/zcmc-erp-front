import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  ModalClose,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { BiX } from "react-icons/bi";

DrawerComponent.propTypes = {};

function DrawerComponent({
  open,
  setOpen,
  content,
  title,
  description,
  size = "md",
  footer,
}) {
  const toggleDrawer = (inOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(inOpen);
  };

  return (
    <Drawer
      open={open}
      onClose={(event) => {
        event.stopPropagation(); // prevent accordion toggle
        toggleDrawer(false)(event); // call original function
      }}
      sx={{ padding: 3 }}
      size={size}
      variant="plain"
      slotProps={{
        content: {
          sx: {
            bgcolor: "transparent",
            p: { md: 3, sm: 0 },
            boxShadow: "none",
          },
        },
      }}
    >
      <Sheet
        sx={{
          borderRadius: "md",
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          overflow: "auto",
        }}
      >
        <Stack p={3} gap={2}>
          {title && (
            <DialogTitle
              sx={{ alignItems: "start", justifyContent: "space-between" }}
            >
              <Stack gap={0.3}>
                <Typography
                  fontSize={{ xs: 15, lg: 18 }}
                  fontWeight={600}
                  textTransform={"capitalize"}
                >
                  {title}
                </Typography>
                <Typography
                  fontWeight={400}
                  fontSize={{ xs: 12, lg: 13 }}
                  color="neutral"
                >
                  {description}
                </Typography>
              </Stack>

              <IconButton
                variant="plain"
                onClick={(e) => {
                  e.stopPropagation(); // prevent accordion toggle
                  toggleDrawer(false)(e);
                }}
              >
                <BiX fontSize={27} />
              </IconButton>
            </DialogTitle>
          )}
          <Divider sx={{ mx: 0.2 }} />
          <DialogContent sx={{ flex: 1 }}>{content}</DialogContent>
        </Stack>
        {footer && (
          <DialogActions
            sx={{
              p: 2,
              mt: "auto",
              bottom: 0,
              zIndex: 1,
            }}
          >
            {footer}
          </DialogActions>
        )}
      </Sheet>
    </Drawer>
  );
}

export default DrawerComponent;
