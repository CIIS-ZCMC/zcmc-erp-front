import { FormControl, FormHelperText, FormLabel, Textarea } from "@mui/joy";

function TextareaComponent({
  label,
  placeholder,
  helperText,
  value,
  minRows = 4,
  maxRows = 10,
  fontWeight = 400,
  darkMode = false,
  size = "md",
  setValue,
  name,
  color,
  isRequired = false,
  onChange,
}) {
  const handleInput = (e) => {
    setValue(e.target.value);
  };

  return (
    <FormControl>
      {label && (
        <FormLabel
          sx={{ fontSize: 14, fontWeight: 500, color: darkMode && "white" }}
        >
          {label}
          {isRequired && <span style={{ color: "red", fontSize: 18 }}>*</span>}
        </FormLabel>
      )}
      <Textarea
        autoComplete="off"
        required={isRequired}
        size={size}
        placeholder={placeholder}
        name={name}
        minRows={minRows}
        color={color}
        maxRows={maxRows}
        value={value}
        onChange={setValue ? handleInput : onChange}
        sx={{
          fontSize: 13,
          fontWeight: fontWeight,
          py: 1.2,
          background: darkMode ? "transparent" : undefined,
          color: "neutral.700",
          whiteSpace: "pre-wrap",
        }}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default TextareaComponent;
