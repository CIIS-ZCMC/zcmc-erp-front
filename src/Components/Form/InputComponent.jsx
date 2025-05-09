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
  fontWeight = 400,
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

  //   const { errors } = userErrorInputHook();

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
    <FormControl sx={{ width: width }}>
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
        color={color}
        onChange={handleInput ? handleInput : (e) => setValue(e.target.value)}
        sx={{
          fontSize: 13,
          fontWeight: fontWeight,
          py: size ?? 1,
          background: darkMode && "none",
          color: darkMode ? "white" : "neutral.900",
          borderColor: "neutral.300",
        }}
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

      {helperText && (
        <FormHelperText sx={{ fontSize: 12 }}>{helperText}</FormHelperText>
      )}
      {/* {errors[name]?.isError && (
        <Typography fontSize={"xs"} color="danger">
          {errors[name]?.message}
        </Typography>
      )} */}
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
