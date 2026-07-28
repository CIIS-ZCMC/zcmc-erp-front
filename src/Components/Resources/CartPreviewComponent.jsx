import QuantityControlComponent from "@Components/Cart/QuantityControlComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import { Circle } from "@mui/icons-material";
import { Box, Divider, Grid, Stack, Typography, useTheme } from "@mui/joy";
import { grey, red } from "@mui/material/colors";
import { CircleSmall, ShoppingCart } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { formatPeso } from "../../Utils/FormatPeso";

export default function CartPreviewComponent({
  open,
  onClose,
  item,
  category,
  unit,
  name,
  qty,
  price,
  specifications = [],
  onAddToCart,
  variant,
  image = "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  isAddToCart = true,
}) {
  const theme = useTheme();
  const color = theme.palette;
  const [quantity, setQuantity] = useState(1);

  // recompute subtotal
  const subTotal = (price || 0) * quantity;

  // reset when new item or reopen modal
  useEffect(() => {
    if (open) setQuantity(1);
  }, [open, item]);

  const handleAddToCart = () => {
    if (!item) return;
    onAddToCart({
      ...item,
      qty: quantity, // 👈 match Zustand store field name
    });
    onClose();
  };
  return (
    <Fragment>
      <ModalComponent
        isOpen={open}
        handleClose={onClose}
        minWidth={505}
        maxWidth={505}
        noDivider
        content={
          <>
            <Stack spacing={1}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography level="body-sm" sx={{ color: color.custom.main }}>
                  {category}

                  <CircleSmall size={8} style={{ margin: "0 4px" }} />
                  {unit}
                </Typography>
              </Stack>
              <Typography level="title-lg">{name}</Typography>

              <Typography
                level="title-md"
                mt={0.5}
                sx={{ color: red[900] }}
                fontWeight={600}
              >
                ₱
                {price?.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              <Typography level="body-sm">Specifications: </Typography>
              <Stack
                sx={{
                  maxHeight: 200, // adjust as needed
                  overflowY: "auto",
                  pr: 1, // space for scrollbar
                }}
                spacing={0.5}
              >
                {specifications.length > 0 ? (
                  specifications.map((spec, index) => (
                    <Typography
                      key={index}
                      level="body-sm"
                      sx={{ color: grey[900], display: "block" }}
                      startDecorator={
                        <Circle
                          sx={{ fontSize: "5px", pb: 0.3, color: "black" }}
                        />
                      }
                    >
                      {spec.description}
                    </Typography>
                  ))
                ) : (
                  <Typography level="body-md">
                    No specifications provided.
                  </Typography>
                )}
              </Stack>
            </Stack>

            {/* Add-to-cart section (only if true) */}

            {isAddToCart && (
              <BoxComponent mt={2} p={2}>
                <ButtonComponent
                  label="Add to Cart"
                  endDecorator={<ShoppingCart />}
                  onClick={handleAddToCart}
                  fullWidth
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems={"flex-end"}
                  mt={isAddToCart && 2}
                >
                  <Stack width="100%" alignItems={"flex-start"} spacing={1}>
                    <Typography level="body-sm">Quantity:</Typography>
                    <QuantityControlComponent
                      quantity={quantity}
                      onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                      onIncrease={() => setQuantity((q) => q + 1)}
                    />
                  </Stack>
                  <Stack width="100%" alignItems={"flex-end"} spacing={1}>
                    <Typography level="body-sm">Item subtotal:</Typography>
                    <Typography
                      fontWeight={600}
                      sx={{ color: color.custom.main }}
                    >
                      {formatPeso(subTotal)}
                    </Typography>
                  </Stack>
                </Stack>
                <Divider sx={{ mt: 2, color: color.custom.fontLight }} />
              </BoxComponent>
            )}
          </>
        }
      />
    </Fragment>
  );
}
