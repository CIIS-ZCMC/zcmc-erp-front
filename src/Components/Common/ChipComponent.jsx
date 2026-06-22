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
  endDecorator = true,
  variant,
  onClick,
  fontSize = 12,
  startDecorator,
  chipRadius,
  wrap = false,
  fontWeight = 600,
  ...props
}) {
  const sxStyles = {
    fontWeight: fontWeight,
    fontSize: fontSize,

    maxWidth: {
      xs: 500,
      sm: 700,
      md: 1200,
    },
    position: "relative",
    zIndex: 1,

    "--Chip-radius": chipRadius ? chipRadius : "24px",

    ...(wrap
      ? {
          height: "auto",
          whiteSpace: "normal",

          "& .MuiChip-label": {
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "unset",
            display: "block",
            paddingTop: "4px",
            paddingBottom: "4px",
          },
        }
      : {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          "& .MuiChip-label": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }),

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
