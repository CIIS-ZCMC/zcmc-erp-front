import React from "react";

import { Stack, Typography, Input, Divider, Box } from "@mui/joy";
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

      <Stack direction="row" alignItems="stretch" spacing={0.5}>
        <IconButtonComponent
          size={"sm"}
          variant={"soft"}
          icon={<Minus size={14} />}
          disabled={quantity === 1}
          onClick={onDecrease}
        />
        <Box
          sx={{
            borderRadius: 5,
            backgroundColor: "neutral.100",
            width: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            fontSize={12}
            sx={{
              color: "black",
            }}
            textAlign="center"
          >
            {quantity}
          </Typography>
        </Box>

        {/* <Typography level="body-md" width="2rem" textAlign="center">
                {quantity}
            </Typography> */}

        <IconButtonComponent
          size={"sm"}
          variant={"soft"}
          icon={<Plus size={14} />}
          // disabled={quantity <= 1}
          onClick={onIncrease}
        />
      </Stack>
    </Stack>
  );
};

export default QuantityControlComponent;
