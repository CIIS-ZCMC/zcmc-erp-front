import React from "react";
import { styled } from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";

const MenuItemComponent = styled(RouterLink)(({ theme, color = {} }) => ({
  width: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
  textDecoration: "none",
  color: "white",
  borderRadius: 10,
  transition: "background-color 0.3s",
  backgroundColor: "transparent",
  "&.hover": {
    bgcolor: "neutral.50",
    transition: "background 0.2s",
  },
  // If you want to handle active state, you can use the 'active' class added by React Router
}));

export default MenuItemComponent;
