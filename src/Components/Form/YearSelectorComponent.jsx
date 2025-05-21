import PropTypes from "prop-types";
import { Autocomplete, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { getFontSize } from "../../Utils/Typography";

function YearSelectorComponent({
  label,
  helperText,
  size = "small",
  width = "100%",
  placeholder = "",
  startDecorator,
  darkMode = false,
  value = { year: "2024" },
  setValue,
  ...props
}) {
  // Generate a range of years
  const startYear = 2010;
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
    year: `${startYear + i}`,
  }));

  return (
    <FormControl sx={{ width: width }}>
      {label && (
        <FormLabel sx={{ fontSize: getFontSize(size) }}>{label}</FormLabel>
      )}
      <Autocomplete
        startDecorator={startDecorator}
        size={"sm"}
        placeholder={placeholder}
        options={years}
        value={value}
        getOptionLabel={(option) => option.year}
        onChange={(event, newValue) => {
          if (newValue) {
            setValue(newValue.year);
          }
        }}
        sx={{
          background: darkMode ? "none" : "inherit",
          color: darkMode ? "white" : "inherit",
          py: 0.6,
        }}
        {...props}
      />
      {helperText && (
        <FormHelperText sx={{ fontSize: getFontSize(size) }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

YearSelectorComponent.propTypes = {
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
  setValue: PropTypes.bool,
};

export default YearSelectorComponent;
