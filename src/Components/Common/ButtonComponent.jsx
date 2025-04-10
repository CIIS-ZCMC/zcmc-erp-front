import PropTypes from "prop-types";
import { Button } from "@mui/joy";

const ButtonComponent = ({
  size,
  label,
  onClick,
  variant,
  color = "success",
  startDecorator,
  endDecorator,
  fullWidth,
  width = "auto",
  disabled,
  type,
}) => {
  return (
    <Button
      type={type}
      size={size}
      variant={variant}
      onClick={onClick}
      color={color}
      startDecorator={startDecorator}
      endDecorator={endDecorator}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{
        width: fullWidth ? "100%" : width,
        fontWeight: 400,
        borderRadius: 8,
        height: size ?? 38,
        fontSize: size ?? 13,
      }}
    >
      {label}
    </Button>
  );
};

ButtonComponent.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  label: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["solid", "outlined", "text"]),
  color: PropTypes.string,
  startDecorator: PropTypes.node,
  endDecorator: PropTypes.node,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default ButtonComponent;
