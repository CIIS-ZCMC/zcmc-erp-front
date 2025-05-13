import React, { Fragment } from "react";

import { Box, Stack, Typography, Divider } from "@mui/joy";
import { LucideDot, Minus, Plus, Trash } from "lucide-react";

import ButtonComponent from "../../Components/Common/ButtonComponent";
import QuantityControlComponent from "../../Components/Cart/QuantityControlComponent";
import IconButtonComponent from "../../Components/Common/IconButtonComponent";

const ItemsCart = ({
  item,
  image,
  id,
  quantity,
  onRemove,
  onQuantityChange,
}) => {
  return (
    <Fragment>
      {console.log("item", item)}
      <Box display={"flex"} gap={1}>
        <Box
          component="img"
          src={image}
          alt={name}
          loading="lazy"
          sx={{
            width: 65,
            height: 55,
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback-image.png";
          }}
        />

        <Box width={"100%"}>
          <Typography fontSize={13} fontWeight={600}>
            {item?.description}
          </Typography>
          <Typography
            fontSize={12}
            fontWeight={400}
            display={"flex"}
            alignItems={"center"}
          >
            {item?.variant ? (
              <>
                {item?.variant} <LucideDot />
              </>
            ) : (
              ""
            )}{" "}
            {item?.category}
          </Typography>
          <Typography fontSize={12} fontWeight={600} textColor={"success.500"}>
            &#8369; {item?.estimated_budget.toLocaleString()}
          </Typography>

          <Box
            display={"flex"}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            <QuantityControlComponent
              quantity={item?.aop_quantity}
              onDecrease={() => onQuantityChange(id, item.aop_quantity - 1)}
              onIncrease={() => onQuantityChange(id, item.aop_quantity + 1)}
            />

            <ButtonComponent
              label={"Remove"}
              variant={"plain"}
              color="black"
              endDecorator={<Trash size={12} style={{ paddingLeft: 3 }} />}
              size={"xs"}
              onClick={onRemove}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />
    </Fragment>
  );
};

export default ItemsCart;
