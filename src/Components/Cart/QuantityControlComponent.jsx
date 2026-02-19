import React from "react";

import {
  Stack,
  Typography,
  Input,
  Divider,
  Box,
  Button,
  ButtonGroup,
  IconButton,
} from "@mui/joy";
import { Divide, Minus, Plus } from "lucide-react";

import IconButtonComponent from "../../Components/Common/IconButtonComponent";
import InputComponent from "../../Components/Form/InputComponent";

const QuantityControlComponent = ({
  quantity = 1,
  onDecrease,
  onIncrease,
  onChange,
  withLabel = false,
  disabled = false,
}) => {
  // Local input state
  const [inputValue, setInputValue] = React.useState(String(quantity));

  // Sync store → local input whenever parent changes quantity
  React.useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  // Handle typing in input
  const handleChange = (e) => {
    const value = e.target.value;

    // Allow empty while typing
    if (value === "" || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  // Commit value to parent/store on blur
  const handleBlur = () => {
    const numericValue = Number(inputValue);

    if (!numericValue || numericValue < 1) {
      setInputValue("1");
      onChange?.(1); // commit minimum value
    } else {
      onChange?.(numericValue); // commit typed value
    }
  };

  return (
    <Stack>
      {withLabel && (
        <Typography fontSize={14} fontWeight={400} mb={0.5}>
          Quantity
        </Typography>
      )}

      <ButtonGroup
        variant="soft"
        size="sm"
        color="neutral"
        spacing="0.2rem"
        disabled={disabled}
      >
        <IconButton onClick={onDecrease} disabled={quantity === 1}>
          <Minus />
        </IconButton>
        {/* <Button>{quantity}</Button> */}
        <Input
          value={inputValue}
          size="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          variant="soft"
          sx={{
            width: 50,
            textAlign: "center",
            "& input": {
              textAlign: "center",
            },
          }}
        />
        <IconButton onClick={onIncrease}>
          <Plus />
        </IconButton>
      </ButtonGroup>
    </Stack>
  );
};

export default QuantityControlComponent;
