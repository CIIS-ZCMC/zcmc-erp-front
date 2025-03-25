import React from 'react';

import { Box, Stack } from '@mui/joy';

import MenuItemWithChildren from './MenuItemComponent/MenuItemWithChildren';
import { sidebarRoutes } from '../../../Data';

import SimpleMenuItem from './MenuItemComponent/SimpleMenuItem';

const Content = () => {
    return (
        <Box>
            <Stack mt={4} gap={1} flexGrow={1}>
                {sidebarRoutes?.map((item, index) => (
                    item.children
                        ? <MenuItemWithChildren key={index} {...item} />
                        : <SimpleMenuItem key={index} {...item} />
                ))}
            </Stack>
        </Box>
    );
};

export default Content;