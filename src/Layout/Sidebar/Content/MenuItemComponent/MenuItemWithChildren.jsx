import React, { useState } from 'react'

import { Box, Stack, Typography, Divider } from '@mui/joy';
import { ChevronDown, ChevronUp } from 'lucide-react';

import MenuItemComponent from '.';
import ChildMenuItem from './ChildMenuItem';


// Style objects
const headerItemStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
};

const MenuItemWithChildren = ({ name, children, icon, path }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <MenuItemComponent onClick={() => setIsExpanded(!isExpanded)}>
                <Box sx={headerItemStyles}>
                    <Stack direction="row" alignItems="center">
                        {icon}
                        <Typography ml={1} color="white" fontSize={{ xs: 12, md: 14 }}>
                            {name}
                        </Typography>
                    </Stack>
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </Box>
            </MenuItemComponent>

            {isExpanded && (
                <Stack spacing={1.5}>
                    {children.map((child, index) => (
                        <ChildMenuItem key={index} {...child} />
                    ))}
                </Stack>
            )}
            <Divider />
        </>
    );
};

export default MenuItemWithChildren