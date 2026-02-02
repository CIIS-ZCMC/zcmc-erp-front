import PropTypes from "prop-types";
import { Autocomplete, FormControl, FormHelperText, FormLabel } from "@mui/joy";
import { getFontSize } from "../../Utils/Typography";
import { useEffect } from "react";

function YearSelectorComponent({
  label,
  helperText,
  size = "small",
  width = "100%",
  placeholder = "",
  startDecorator,
  darkMode = false,
  value,
  setValue,
  bgcolor = "inherit",
  txtcolor = "inherit",
  options,
  endDecorator,
  ...props
}) {
  const yearOptions = options?.map((year) => ({ year: year })) || [];

  // useEffect(() => {
  //   console.log(yearOptions)
  //   console.log(startYear)
  // }, [options])

  return (
    <FormControl sx={{ width: width }}>
      {label && (
        <FormLabel sx={{ fontSize: getFontSize(size) }}>{label}</FormLabel>
      )}
      <Autocomplete
        startDecorator={startDecorator}
        endDecorator={endDecorator}
        size={"sm"}
        placeholder={placeholder}
        options={yearOptions}
        value={value}
        getOptionLabel={(option) => option.year}
        onChange={(event, newValue) => {
          if (newValue) {
            setValue(newValue.year);
          }
        }}
        sx={{
          background: darkMode ? "none" : bgcolor,
          color: darkMode ? "white" : txtcolor,
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
    ]),
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
