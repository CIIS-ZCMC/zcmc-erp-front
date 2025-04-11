import React, { Fragment } from "react";

import { Box, Stack, Typography, Divider } from "@mui/joy";
import { LucideDot, Minus, Plus, Trash } from "lucide-react";

import ButtonComponent from "../../Components/Common/ButtonComponent";
import QuantityControlComponent from "../../Components/Cart/QuantityControlComponent";
import IconButtonComponent from "../../Components/Common/IconButtonComponent";

const ItemsCart = ({ item, image, quantity, onRemove, onQuantityChange }) => {
  return (
    <Fragment>
      <Box display={"flex"}>
        <Box
          component="img"
          src={image}
          alt={name}
          loading="lazy"
          sx={{
            width: 66,
            height: 66,
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback-image.png";
          }}
        />

        <Stack pl={1}>
          <Typography fontSize={14} fontWeight={600}>
            {item?.name}
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
            &#8369; {item?.price.toLocaleString()}
          </Typography>

          <Box
            display={"flex"}
            sx={{ justifyContent: "space-between", alignItems: "flex-end" }}
            gap={1}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButtonComponent
                size={"sm"}
                variant={"outlined"}
                color={"nuetral"}
                icon={<Minus size={14} />}
                // disabled={quantity <= 1}
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              />

              <Divider orientation="vertical" />
              <Typography fontSize={12} sx={{ px: 1 }}>
                {item?.quantity}
              </Typography>
              <Divider orientation="vertical" />

              {/* <Typography level="body-md" width="2rem" textAlign="center">
                {quantity}
            </Typography> */}

              <IconButtonComponent
                size={"sm"}
                variant={"outlined"}
                color={"nuetral"}
                icon={<Plus size={14} />}
                // disabled={quantity <= 1}
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              />
            </Stack>
            <Box>
              <ButtonComponent
                label={"Remove"}
                variant={"plain"}
                endDecorator={<Trash size={12} />}
                size={"sm"}
                onClick={onRemove}
              />
            </Box>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ mt: 1 }} />
    </Fragment>
  );
};

export default ItemsCart;
