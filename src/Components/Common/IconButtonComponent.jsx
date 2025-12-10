import React from "react";

import { IconButton } from "@mui/joy";

const IconButtonComponent = ({
  disabled,
  variant,
  onClick,
  icon,
  size,
  color,
  withBorderRadius = false,
}) => {
  return (
    <div>
      <IconButton
        disabled={disabled}
        variant={variant}
        onClick={onClick}
        size={size}
        color={color}
        sx={{ borderRadius: withBorderRadius && "50%" }}
      >
        {icon}
      </IconButton>
    </div>
  );
};

export default IconButtonComponent;
