import PropTypes from "prop-types";
import { Box } from "@mui/joy";

BoxComponent.propTypes = {
  children: PropTypes.node, // `children` should be any type of node, not just an element
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bgColor: PropTypes.string, // Change to string for color
  props: PropTypes.object, // Keep this for spreading additional props
};

function BoxComponent({
  children,
  height,
  maxHeight,
  bgColor,
  p = 2,
  ...props
}) {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        height: height ?? "auto",
        maxHeight: maxHeight,
        overflowY: height || maxHeight ? "auto" : "visible",
        border: 1,
        borderColor: "neutral.200",
        bgcolor: bgColor || "white", // Use default color when bgColor is not passed
        borderRadius: 8,
        overflowX: "hidden", // Hide horizontal overflow
        p: p,
        ...props,
      }}
    >
      {children}
    </Box>
  );
}

export default BoxComponent;
