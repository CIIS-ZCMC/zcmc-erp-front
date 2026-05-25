import PropTypes from "prop-types";
import { Chip } from "@mui/joy";
import { getStatusIcon } from "../../Utils/StatusIcon";

ChipComponent.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.string,
  startDecorator: PropTypes.element,
  endDecorator: PropTypes.element,
};

function ChipComponent({
  color,
  label,
  status,
  endDecorator,
  variant,
  onClick,
  fontSize = 12,
  startDecorator,
  ...props
}) {
  const sxStyles = {
    fontWeight: 600,
    fontSize: fontSize,

    maxWidth: {
      xs: 300,
      sm: 450,
      md: 550,
    },
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",

    "& .MuiChip-label": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },

    ...(variant || color
      ? { color: color }
      : {
          fontWeight: 600,
          border: 1,
        }),
  };
  return (
    <Chip
      color={color}
      variant={variant}
      sx={sxStyles}
      onClick={onClick}
      size="lg"
      startDecorator={startDecorator && startDecorator}
      endDecorator={endDecorator && getStatusIcon(status, true)} // the second param is for icon display
      {...props}
    >
      {label}
    </Chip>
  );
}

export default ChipComponent;
