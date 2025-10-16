import PropTypes from "prop-types";
import {
  Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
} from "@mui/joy";
import { getFontSize } from "../../Utils/Typography";
import { BiX } from "react-icons/bi";

function MultipleAutocompleteComponent({
  label,
  options = [],
  helperText,
  size = "small",
  width = "100%",
  placeholder = "",
  startDecorator,
  name,
  isRequired,
  setValue,
  value,
  darkMode,
  ...props
}) {
  return (
    <FormControl sx={{ width }}>
      {label && (
        <FormLabel
          sx={{ fontSize: getFontSize(size), color: darkMode && "white" }}
        >
          {label}{" "}
          {label && isRequired && (
            <span style={{ color: "red", fontSize: 18 }}>*</span>
          )}
        </FormLabel>
      )}

      <Autocomplete
        multiple
        startDecorator={startDecorator}
        placeholder={placeholder}
        options={options}
        getOptionLabel={(option) => option[name]}
        value={value}
        onChange={(_, value) => setValue(value)}
        renderTags={(tags, getTagProps) =>
          tags.map((item, index) => (
            <Chip
              key={index}
              variant="soft"
              color="primary"
              endDecorator={<BiX fontSize="sm" />}
              sx={{ minWidth: 0, fontSize: "xs" }}
              {...getTagProps({ index })}
            >
              {item[name]}
            </Chip>
          ))
        }
        {...props}
      />
      {helperText && (
        <FormHelperText sx={{ fontSize: "xs" }}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}

MultipleAutocompleteComponent.propTypes = {
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
  name: PropTypes.string,
  isRequired: PropTypes.bool,
  setValue: PropTypes.string,
  value: PropTypes.array,
};

export default MultipleAutocompleteComponent;
