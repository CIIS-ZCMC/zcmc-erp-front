import PropTypes from "prop-types";
import { Autocomplete, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { getFontSize } from "../../Utils/Typography";

function AutocompleteComponent({
  label,
  options = [],
  helperText,
  size,
  width = "100%",
  placeholder = "",
  startDecorator,
  darkMode = false,
  setValue,
  value,
  name,
  handleSelect,
  ...props
}) {
  const handleChange = (event) => {
    setValue(event);
  };

  return (
    <FormControl sx={{ width: width }} {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <Autocomplete
        startDecorator={startDecorator}
        size={size}
        placeholder={placeholder}
        onChange={(_, event) => {
          handleSelect ? handleSelect(name, event) : handleChange(event);
        }}
        value={value}
        options={options}
        name={name}
        sx={{
          fontSize: getFontSize(size),
          background: darkMode ? "none" : "inherit",
          color: darkMode ? "white" : "inherit",
        }}
      />
      {helperText && (
        <FormHelperText sx={{ fontSize: getFontSize(size) ?? 12 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

AutocompleteComponent.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    ])
  ),
  helperText: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  startDecorator: PropTypes.node,
  darkMode: PropTypes.bool,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  handleSelect: PropTypes.func,
  setValue: PropTypes.oneOfType([PropTypes.object]),
  value: PropTypes.oneOfType([PropTypes.object]),
};

export default AutocompleteComponent;
