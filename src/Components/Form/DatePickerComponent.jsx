import { FormLabel, FormControl, Input, Typography } from "@mui/joy";

const DatePickerComponent = ({
  label,
  width,
  placeholder,
  value,
  name,
  onChange,
  error,
  helperText,
  size,
  startDecorator,
  type = "date",
  actions,
  disabled,
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
    if (actions) {
      actions(e.target.value);
    }
  };
  return (
    <>
      <FormControl>
        <FormLabel sx={{ fontSize: 14, fontWeight: 500 }}>{label}</FormLabel>
        <Input
          disabled={disabled}
          sx={{ width: width, fontSize: 14 }}
          value={value || ""}
          name={name}
          onChange={handleChange}
          size={size}
          type={type}
          error={error}
          placeholder={placeholder}
          startDecorator={startDecorator}
          slotProps={
            {
              // input: {
              //     min: '2018-06-07',
              //     max: '2018-06-14',
              // },
            }
          }
        />
        {error && (
          <Typography variant="body2" color="danger">
            {helperText}
          </Typography>
        )}

        {/* {error && <div style={{ color: "#c41c1c" }}>{helperText}</div>}{" "} */}
        {/* Display error message */}
      </FormControl>
    </>
  );
};
export default DatePickerComponent;
