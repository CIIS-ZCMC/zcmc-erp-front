import PropTypes from "prop-types";
import { Box, Typography, Autocomplete, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { getFontSize } from "../../Utils/Typography";

function AutocompleteComponent({
  multiple = false,
  label,
  options = [],
  helperText,
  size = "sm",
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
        multiple={multiple}
        filterSelectedOptions={true}
        startDecorator={startDecorator}
        size={size}
        placeholder={placeholder}
        onChange={(_, event) => {
          handleSelect ? handleSelect(name, event) : handleChange(event);
        }}
        renderOption={(props, option) => (
          <li
            {...props}
            key={option.id}
            style={{
              padding: "8px 12px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              transition: "background 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Box display="flex" flexDirection="column">
              <Typography variant="body1" fontWeight="500">
                {option?.label}
              </Typography>
              {option.designation && (
                <Typography variant="caption" color="text.secondary">
                  {option.designation}
                </Typography>
              )}
            </Box>
          </li>
        )}
        value={value}
        options={options}
        name={name}
        // getOptionLabel={(option) => console.log(option.label)}
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
