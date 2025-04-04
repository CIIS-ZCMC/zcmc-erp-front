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
  width,
  height,
  maxHeight,
  bgColor,
  ...props
}) {
  return (
    <Box
      sx={{
        width: width ?? "100%",
        height: height ?? "100%",
        maxHeight: maxHeight,
        overflowY: maxHeight ? "scroll" : "visible", // Improved condition
        border: 1,
        borderColor: "neutral.100",
        bgcolor: bgColor || "white", // Use default color when bgColor is not passed
        borderRadius: 10,
        overflowX: "hidden", // Hide horizontal overflow
        p: 1,
      }}
      {...props} // Spread additional props
    >
      {children}
    </Box>
  );
}

export default BoxComponent;
