import { Typography } from "@mui/joy";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import Radio, { radioClasses } from "@mui/joy/Radio";
import { MdCheckCircleOutline } from "react-icons/md";

function RadioButtonComponent({ actions, handleChange, setValue, value }) {
  return (
    <RadioGroup
      value={value} // Use value instead of defaultValue for controlled component
      overlay
      onChange={handleChange ? handleChange : (e) => setValue(e.target.value)}
      sx={{
        flexDirection: "row",
        gap: 2,
      }}
    >
      {actions.map(({ value: element_value, label, color, icon }, key) => (
        <Sheet
          key={key}
          variant="soft"
          color={color}
          sx={{
            borderRadius: "md",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            overflow: "hidden",
            width: "100%",
            [`& .${radioClasses.checked}`]: {
              [`& .${radioClasses.action}`]: {
                border: 3,
                borderColor: color,
              },
            },
          }}
        >
          <Radio
            color={color}
            value={element_value}
            checked={element_value === value}
          />
          <Typography
            color={color}
            level="title-sm"
            mt={1}
            textAlign={"center"}
          >
            {label}
          </Typography>
        </Sheet>
      ))}
    </RadioGroup>
  );
}

export default RadioButtonComponent;
