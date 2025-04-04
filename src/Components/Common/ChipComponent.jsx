import PropTypes from "prop-types";
import { Chip } from "@mui/joy";
import { getStatusIcon } from "../../Utils/StatusIcon";

ChipComponent.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.string,
  startDecorator: PropTypes.element,
};

function ChipComponent({ color, label, status, variant, ...props }) {
  const sxStyles = {
    fontWeight: 500,
    // fontSize: 13,
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
      endDecorator={getStatusIcon(status, true)} // the second param is for icon display
      {...props}
    >
      {label}
    </Chip>
  );
}

export default ChipComponent;
