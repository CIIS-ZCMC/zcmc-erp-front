import { FormControl, FormHelperText, FormLabel, Textarea } from "@mui/joy";

TextareaComponent.propTypes = {};

function TextareaComponent({
  label,
  placeholder,
  helperText,
  value,
  minRows,
  maxRows,
  fontWeight,
  darkMode,
  size,
  handleInput,
  name,
  isRequired,
  autoFocus,
}) {
  return (
    <FormControl>
      <FormLabel
        sx={{ fontSize: 14, fontWeight: 500, color: darkMode && "white" }}
      >
        {label}{" "}
        {label && isRequired && (
          <span style={{ color: "red", fontSize: 18 }}>*</span>
        )}
      </FormLabel>
      <Textarea
        autoFocus={autoFocus}
        required={isRequired}
        size={size}
        placeholder={placeholder}
        name={name}
        minRows={minRows}
        maxRows={maxRows}
        value={value}
        sx={{
          fontSize: 14,
          fontWeight: fontWeight,
          py: 1.2,
          background: darkMode && "none",
          color: darkMode && "white",
        }}
        onChange={handleInput}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default TextareaComponent;
