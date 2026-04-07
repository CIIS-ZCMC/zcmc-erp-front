import PropTypes from "prop-types";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import userErrorInputHook from "../../Hooks/ErrorInputHook";
import { getFontSize } from "../../Utils/Typography";
// import { getFontSize } from "../../Utils/Typography";
// import { BsEye, BsEyeSlash } from "react-icons/bs";
// import userErrorInputHook from "../../Hooks/ErrorInputHook";

const InputComponent = ({
  label,
  placeholder,
  helperText,
  value,
  setValue,
  autoFocus,
  fontWeight = 500,
  darkMode,
  type,
  size = "md",
  handleInput,
  name,
  startDecorator,
  endDecorator,
  width = "100%",
  isRequired,
  color = "primary",
  ...props
}) => {
  const isPassword = type == "password";
  const [showPassword, setShowPassword] = useState(false);

  const { errors } = userErrorInputHook(); // Get error state
  const fieldError = errors?.[name];

  const eyeColor = darkMode ? "white" : "black";
  const getIcon = () => {
    return showPassword ? (
      <Eye style={{ color: eyeColor }} size={16} />
    ) : (
      <EyeOff style={{ color: eyeColor }} size={16} />
    );
  };

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FormControl error={fieldError?.isError} sx={{ width: width }}>
      <FormLabel
        sx={{
          fontWeight: fontWeight,
          color: darkMode ? "white" : "black",
        }}
      >
        {label}
        {isRequired && <span style={{ color: "red" }}>*</span>}
      </FormLabel>
      <Input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        size={size ?? "md"}
        variant="outlined"
        name={name}
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value || ""}
        color={fieldError?.isError ? "danger" : color}
        onChange={(e) => {
          const value = e.target.value;

          // Clear error if user starts typing
          if (fieldError?.isError && value.trim()) {
            const { setError } = userErrorInputHook.getState();
            setError(name, false, "");
          }

          handleInput ? handleInput(e) : setValue(value);
        }}
        sx={{
          fontSize: 13,
          fontWeight: fontWeight,
          py: size ?? 1,
          background: darkMode && "none",
          color: darkMode ? "white" : "neutral.900",
          borderColor: fieldError?.isError ? "danger.300" : "neutral.300",
        }}
        slotProps={
          type === "number" && {
            input: {
              min: 1,
              max: 99,
              step: 1,
            },
          }
        }
        startDecorator={startDecorator}
        endDecorator={
          isPassword ? (
            <IconButton
              onClick={handlePasswordVisibility}
              color="none"
              sx={{ fontSize: 5 }}
            >
              {getIcon()}
            </IconButton>
          ) : (
            endDecorator
          )
        }
        {...props}
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
};

InputComponent.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setValue: PropTypes.func,
  autoFocus: PropTypes.bool,
  fontWeight: PropTypes.number,
  darkMode: PropTypes.bool,
  type: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleInput: PropTypes.func,
  name: PropTypes.string,
  startDecorator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  endDecorator: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isRequired: PropTypes.bool,
  isError: PropTypes.bool,
};

export default InputComponent;
