import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  ModalClose,
  Stack,
  Typography,
} from "@mui/joy";
import { BiX } from "react-icons/bi";

DrawerComponent.propTypes = {};

function DrawerComponent({ open, setOpen, content, title, description }) {
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
    <Drawer open={open} onClose={toggleDrawer(false)} sx={{ padding: 3 }}>
      <Stack p={3} gap={2}>
        {title && (
          <DialogTitle
            sx={{ alignItems: "start", justifyContent: "space-between" }}
          >
            <Stack gap={0.3}>
              <Typography fontSize={{ xs: 15, lg: 18 }} fontWeight={600}>
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

            <IconButton variant="plain" onClick={toggleDrawer(false)}>
              <BiX fontSize={27} />
            </IconButton>
          </DialogTitle>
        )}{" "}
        <Divider sx={{ mx: 0.2 }} />
        <DialogContent>{content}</DialogContent>
      </Stack>
    </Drawer>
  );
}

export default DrawerComponent;
