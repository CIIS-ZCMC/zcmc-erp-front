import React, { useState } from "react";

import { Box, Stack, Typography, Divider } from "@mui/joy";
import { ChevronDown, ChevronUp } from "lucide-react";

import MenuItemComponent from ".";
import ChildMenuItem from "./ChildMenuItem";

// Style objects
const headerItemStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
  width: "100%",
};

const MenuItemWithChildren = ({ name, children, icon, path, isCollapsed }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <MenuItemComponent
        onClick={() => setIsExpanded(!isCollapsed && !isExpanded)}
      >
        <Box sx={headerItemStyles}>
          <Stack direction="row" alignItems="center">
            {icon}
            {!isCollapsed && (
              <Typography ml={1} color="white" fontSize={{ xs: 12, md: 14 }}>
                {name}
              </Typography>
            )}
          </Stack>
          {!isCollapsed && (isExpanded ? <ChevronUp /> : <ChevronDown />)}
        </Box>
      </MenuItemComponent>

      {!isCollapsed && isExpanded && (
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

export default MenuItemWithChildren;
