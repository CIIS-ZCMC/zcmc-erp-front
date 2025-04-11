import React from "react";

import { Stack, Typography, Input, Divider } from "@mui/joy";
import { Divide, Minus, Plus } from "lucide-react";

import IconButtonComponent from "../../Components/Common/IconButtonComponent";
import InputComponent from "../../Components/Form/InputComponent";

const QuantityControlComponent = ({ quantity = 1 }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButtonComponent
        size={"sm"}
        variant={"outlined"}
        color={"nuetral"}
        icon={<Minus size={14} />}
        // disabled={quantity <= 1}
        // onClick={onDecrease}
      />

      <Divider orientation="vertical" sx={{ height: 24 }} />
      <Typography>{quantity}</Typography>
      <Divider orientation="vertical" sx={{ height: 24 }} />

      {/* <Typography level="body-md" width="2rem" textAlign="center">
                {quantity}
            </Typography> */}

      <IconButtonComponent
        size={"sm"}
        variant={"outlined"}
        color={"nuetral"}
        icon={<Plus size={14} />}
        // disabled={quantity <= 1}
        // onClick={onDecrease}
      />
    </Stack>
  );
};

export default QuantityControlComponent;
