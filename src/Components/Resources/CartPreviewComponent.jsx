import QuantityControlComponent from "@Components/Cart/QuantityControlComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import {
  AspectRatio,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import { red } from "@mui/material/colors";
import { CircleSmall, ShoppingCart } from "lucide-react";
import React, { Fragment } from "react";
import { BiX } from "react-icons/bi";

export default function CartPreviewComponent({
  open,
  onClose,
  item,
  image = "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
}) {
  return (
    <Fragment>
      <ModalComponent
        isOpen={open}
        handleClose={onClose}
        minWidth={766}
        noDivider
        content={
          <>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={6}>
                <AspectRatio minHeight={80} maxHeight={130}>
                  <img
                    src={item?.image ?? image}
                    role="button"
                    loading="lazy"
                    alt={item?.name}
                  />
                </AspectRatio>

                <BoxComponent mt={3} p={2}>
                  <ButtonComponent
                    label={"Add to Cart"}
                    endDecorator={<ShoppingCart />}
                    fullWidth={true}
                  />
                  <Stack
                    mt={2}
                    direction={"row"}
                    justifyContent={"space-between"}
                  >
                    <Stack width={"100%"}>
                      <Typography level="body-sm">Quantity:</Typography>
                      <QuantityControlComponent />
                    </Stack>
                    <Stack width={"100%"}>
                      <Typography level="body-sm">Item subtotal:</Typography>
                    </Stack>
                  </Stack>
                </BoxComponent>
              </Grid>
              <Grid xs={6} spacing={1}>
                <Stack spacing={1}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography level="body-xs">
                      {item?.item_category?.description}{" "}
                      <CircleSmall size={8} /> {item?.item_unit?.name}
                    </Typography>
                    <IconButton variant="plain" onClick={onClose}>
                      <BiX fontSize={27} />
                    </IconButton>
                  </Stack>

                  <Typography level="title-lg">{item?.name}</Typography>
                  <Typography
                    level="title-md"
                    mt={0.5}
                    sx={{ color: red[900] }}
                  >
                    ₱
                    {item?.estimated_budget.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack>
                  <Typography level="body-sm">Specifications: </Typography>
                </Stack>
              </Grid>
            </Grid>
          </>
        }
      />
    </Fragment>
  );
}
