import React from 'react';
import { styled } from '@mui/joy';
import { Link as RouterLink } from 'react-router-dom'; // or your preferred routing library

const MenuItemComponent = styled(RouterLink)(({ theme, color = {}, path }) => ({
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(1.5)} ${theme.spacing(2)}`,
    textDecoration: "none",
    color: "white",
    borderRadius: 10,
    transition: "background-color 0.3s",
    backgroundColor: "transparent",
    "&:hover": {
        backgroundColor: color.hover || "rgba(255, 255, 255, 0.1)",
    },
    // If you want to handle active state, you can use the 'active' class added by React Router
    "&.active": {
        fontWeight: 600,
        backgroundColor: color.active || "rgba(255, 255, 255, 0.2)",
    }
}));

export default MenuItemComponent;