import {
  Stack,
  Typography,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/joy";
import { grey } from "@mui/material/colors";

function VerticalRadioComponent({
  actions = [],
  value,
  setValue,
  handleChange,
  disabled = false,
  name,
  label,
}) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        name={name}
        value={value}
        onChange={handleChange || ((e) => setValue?.(e.target.value))}
      >
        <Stack spacing={1.5}>
          {actions.map((item) => (
            <Radio
              key={item.value}
              value={item.value}
              disabled={disabled}
              label={
                <Typography
                  fontSize={13}
                  color="neutral"
                  sx={{ lineHeight: 1.3 }}
                >
                  {item.label}
                </Typography>
              }
              sx={{
                alignItems: "flex-start",
                gap: 1.5,
              }}
            />
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
}

export default VerticalRadioComponent;
