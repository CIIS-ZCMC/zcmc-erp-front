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
  withLabel = false,
}) => {
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
        <Button>{quantity}</Button>

        <IconButton onClick={onIncrease}>
          <Plus />
        </IconButton>
      </ButtonGroup>
    </Stack>
  );
};

export default QuantityControlComponent;
