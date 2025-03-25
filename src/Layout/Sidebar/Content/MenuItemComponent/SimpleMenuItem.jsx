import React from 'react';

import { Box, Divider, Typography } from '@mui/joy';

import MenuItemComponent from '.';

const simpleIconStyles = {
    fontSize: { xs: 16, md: 20 },
    alignItems: "center",
};

const SimpleMenuItem = ({ name, path, icon }) => {
    return (
        <>
            <MenuItemComponent to={path} path={path}>
                <Box sx={simpleIconStyles}>
                    {icon}
                </Box>
                <Typography ml={1} color="white" fontSize={{ xs: 12, md: 14 }}>
                    {name}
                </Typography>
            </MenuItemComponent>
            <Divider />
        </>
    )
}

export default SimpleMenuItem