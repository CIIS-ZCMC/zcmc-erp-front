import { FormControl, FormHelperText, FormLabel, Textarea } from "@mui/joy";
import userErrorInputHook from "../../Hooks/ErrorInputHook";
import { getFontSize } from "../../Utils/Typography";

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
  const { errors } = userErrorInputHook(); // Get error state
  const fieldError = errors?.[name];
  const handleInput = (e) => {
    setValue(e.target.value);
  };

  return (
    <FormControl error={fieldError?.isError}>
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
        onChange={(e) => {
          const value = e.target.value;

          // Clear error when user types something valid
          if (fieldError?.isError && value.trim()) {
            const { setError } = userErrorInputHook.getState();
            setError(name, false, "");
          }

          setValue ? handleInput(e) : onChange(e);
        }}
        sx={{
          fontSize: 13,
          fontWeight: fontWeight,
          py: 1.2,
          background: darkMode ? "transparent" : undefined,
          color: "neutral.700",

          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      />
      {(fieldError?.isError || helperText) && (
        <FormHelperText
          sx={{
            fontSize: getFontSize(size) ?? 12,
            color: fieldError?.isError ? "red" : "inherit",
          }}
        >
          {fieldError?.isError ? fieldError.message : helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default TextareaComponent;
