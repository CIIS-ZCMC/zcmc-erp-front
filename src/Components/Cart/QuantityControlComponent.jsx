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
}) => {
  const handleChange = (e) => {
    const value = e.target.value;

    // Allow empty while typing
    if (value === "") {
      onChange?.(1);
      return;
    }

    // Only allow numbers
    if (!/^\d+$/.test(value)) return;

    onChange?.(Number(value));
  };
  return (
    <Stack>
      {withLabel && (
        <Typography fontSize={14} fontWeight={400} mb={0.5}>
          Quantity
        </Typography>
      )}

      <ButtonGroup variant="soft" size="sm" color="neutral" spacing="0.2rem">
        <IconButton onClick={onDecrease} disabled={quantity === 1}>
          <Minus />
        </IconButton>
        {/* <Button>{quantity}</Button> */}
        <Input
          value={quantity}
          size="sm"
          onChange={handleChange}
          onBlur={() => onChange?.(Math.max(quantity, 1))}
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
