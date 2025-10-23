import { KeyboardArrowDown } from "@mui/icons-material";
import { Option, Select, selectClasses } from "@mui/joy";
import * as React from "react";

export default function SelectComponent({
  darkMode = false,
  bgcolor = "inherit",
  txtcolor = "inherit",
  startYear = 2024,
  onChange,
  width = "auto",
}) {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const years = Array.from(
    { length: nextYear - startYear + 1 },
    (_, i) => nextYear - i
  );
  const [value, setValue] = React.useState(nextYear);
  const handleChange = (event, newValue) => {
    setValue(newValue); // update internal state
    if (onChange) onChange(newValue); // send value to parent if provided
  };

  return (
    <Select
      placeholder="Select a pet…"
      indicator={<KeyboardArrowDown />}
      variant="solid"
      value={value}
      onChange={handleChange}
      sx={{
        width: width,
        fontSize: "22px",
        fontWeight: "bolder",
        [`& .${selectClasses.indicator}`]: {
          transition: "0.2s",
          [`&.${selectClasses.expanded}`]: {
            transform: "rotate(-180deg)",
          },
        },
        background: darkMode ? "none" : bgcolor,
        color: darkMode ? "white" : txtcolor,
        py: 0.6,
        "&:hover": {
          background: darkMode ? "#333" : bgcolor,
          color: txtcolor,
          cursor: "pointer",
          fontWeight: "bolder",
        },
      }}
    >
      {years.map((opt) => (
        <Option key={opt} value={opt}>
          {opt}
        </Option>
      ))}
    </Select>
  );
}
