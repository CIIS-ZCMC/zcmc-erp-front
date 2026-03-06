import BoxComponent from "@Components/Common/Card/BoxComponent";
import { Box, Stack, Typography } from "@mui/joy";
import React, { Fragment } from "react";
import empty_cart from "../../assets/empty-cart.png";
import ItemsCart from "@Components/Resources/ItemsCart";
import { blue } from "@mui/material/colors";

export default function Cart({
  cart,
  removeFromCart,
  onQtyChange,
  totalCost,
  totalQty,
  isPPMP = false,
  removeActivityFromItem,
  options = [],
  addActivityToItem,
}) {
  return (
    <Fragment>
      <BoxComponent height={"95%"} display="flex" flexDirection="column">
        <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
          <Typography level="h6">
            {" "}
            <Typography fontSize={14} fontWeight={600}>
              {totalQty === 0
                ? "No items"
                : `${totalQty} Item${totalQty > 1 ? "s" : ""}`}{" "}
              in cart
            </Typography>
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {cart?.length > 0 ? (
            [...cart]
              .reverse()
              .map((item) => (
                <ItemsCart
                  key={item?.id}
                  item={item}
                  id={item?.id}
                  onQuantityChange={onQtyChange}
                  onRemove={() => removeFromCart(item?.id)}
                  isPPMP={isPPMP}
                  removeActivityFromItem={removeActivityFromItem}
                  options={options}
                  addActivityToItem={addActivityToItem}
                />
              ))
          ) : (
            <Stack
              sx={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <img src={empty_cart} alt="Not found" style={{ width: 140 }} />
              <Typography fontSize={14} fontWeight={600} sx={{ color: "gray" }}>
                Your cart is empty
              </Typography>
              <Typography
                fontSize={13}
                sx={{ color: "gray" }}
                textAlign={"center"}
              >
                Looks like you haven't added any items yet.
              </Typography>
            </Stack>
          )}
        </Box>

        <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack>
              <Typography level="body-xs">
                Total quantity for all items:
              </Typography>
              <Typography
                level="body-md"
                sx={{ color: blue[900], fontWeight: 600 }}
              >
                {totalQty.toLocaleString()}
              </Typography>
            </Stack>
            <Stack>
              <Typography level="body-xs">Total cost for all items:</Typography>
              <Typography
                level="body-md"
                sx={{ color: blue[900], fontWeight: 600 }}
              >
                &#8369; {totalCost.toLocaleString()}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </BoxComponent>
    </Fragment>
  );
}
