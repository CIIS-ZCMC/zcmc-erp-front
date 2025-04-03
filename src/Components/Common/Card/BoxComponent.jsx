import PropTypes from "prop-types";
import { Box } from "@mui/joy";

BoxComponent.propTypes = {
  children: PropTypes.element,
  width: PropTypes.string,
  props: PropTypes.object,
  darkMode: PropTypes.bool,
};

function BoxComponent({ children, width, darkMode, props }) {
  return (
    <Box
      sx={{
        width: width ?? "100%",
        border: 1,
        borderColor: "neutral.100",
        bgcolor: darkMode ? "none" : "white",
        borderRadius: 10,
        p: 1,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default BoxComponent;
