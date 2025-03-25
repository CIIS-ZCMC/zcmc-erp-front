import React from 'react'

import { Box, Typography } from '@mui/joy';

import MenuItemComponent from '.';

const childIconStyles = {
    fontSize: { xs: 16, md: 20 },
    display: "flex",
    alignItems: "center",
};

const ChildMenuItem = ({ icon, name, path }) => {
    return (
        <>
            <MenuItemComponent to={path} path={path}>
                <Box sx={childIconStyles}>
                    {icon}
                </Box>
                <Typography ml={2} color="white" fontSize={{ xs: 12 }}>
                    {name}
                </Typography>
            </MenuItemComponent>
        </>
    )
}

export default ChildMenuItem