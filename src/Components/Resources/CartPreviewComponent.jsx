import QuantityControlComponent from "@Components/Cart/QuantityControlComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import { Circle } from "@mui/icons-material";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { grey, red } from "@mui/material/colors";
import { CircleSmall, ShoppingCart } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
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
        minWidth={780}
        maxWidth={780}
        noDivider
        content={
          <>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={6} p={1}>
                {/* Floating Chip */}

                <Stack spacing={0.5}>
                  <Typography level="title-lg">{name}</Typography>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography
                      level="body-xs"
                      sx={{ color: color.custom.main }}
                    >
                      {category}
                      {isAddToCart && (
                        <>
                          <CircleSmall size={8} style={{ margin: "0 4px" }} />
                          {unit}
                        </>
                      )}
                    </Typography>
                  </Stack>
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
                      mt={2}
                      mb={1}
                    >
                      <Stack width="100%">
                        <Typography level="body-sm">Quantity:</Typography>
                      </Stack>
                      <Stack width="100%">
                        <Typography level="body-sm">Item subtotal:</Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems={"flex-end"}
                    >
                      <Stack width="100%">
                        <QuantityControlComponent
                          quantity={quantity}
                          onDecrease={() =>
                            setQuantity((q) => Math.max(1, q - 1))
                          }
                          onIncrease={() => setQuantity((q) => q + 1)}
                        />
                      </Stack>
                      <Stack width="100%">
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
              </Grid>
              <Grid xs={6}>
                {isAddToCart && (
                  <ChipComponent
                    size="sm"
                    color={
                      variant === "Variant-Regular" ? "success" : "warning"
                    }
                    label={variant === null ? "Variant not indicated" : variant}
                    sx={{
                      boxShadow: "sm",
                    }}
                    startDecorator={<Circle style={{ fontSize: 11 }} />}
                  />
                )}
                <Divider sx={{ my: 2 }} />

                {!isAddToCart && (
                  <>
                    <Stack mb={1}>
                      <Typography level="body-sm">Quantity</Typography>
                      <Typography level="title-md">
                        {qty} {unit}
                        {qty > 1 ? "(s)" : ""}
                      </Typography>
                    </Stack>
                  </>
                )}

                <Stack spacing={1}>
                  <Typography level="body-sm">Specifications: </Typography>
                  <Box
                    sx={{
                      maxHeight: 200, // adjust as needed
                      overflowY: "auto",
                      pr: 1, // space for scrollbar
                    }}
                  >
                    {specifications.length > 0 ? (
                      specifications.map((spec, index) => (
                        <Typography
                          key={index}
                          level="body-sm"
                          sx={{ color: grey[900], display: "block" }}
                        >
                          ● {spec.description}
                        </Typography>
                      ))
                    ) : (
                      <Typography level="body-md">
                        No specifications provided.
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </>
        }
      />
    </Fragment>
  );
}
