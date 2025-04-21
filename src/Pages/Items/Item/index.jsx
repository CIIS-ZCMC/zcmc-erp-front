import React from "react";

import {
  Grid,
  List,
  Stack,
  Box,
  Typography,
  Divider,
  ListItem,
} from "@mui/joy";

import BoxComponent from "../../../Components/Common/Card/BoxComponent";

import ButtonComponent from "../../../Components/Common/ButtonComponent";

import QuantityControlComponent from "../../../Components/Cart/QuantityControlComponent";

const Item = ({ quantity, onDecrease, onIncrease }) => {
  return (
    <>
      <Grid
        container
        columns={{ xs: 12, sm: 12, md: 12 }}
        spacing={2}
        sx={{
          flexGrow: 1,
        }}
      >
        <Grid item xs={12} sm={12} md={6}>
          <Box
            sx={{
              width: "100%",
              height: 300, // adjust as needed
              borderRadius: "md", // optional
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318"
              alt="Cover"
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <Stack gap={2} bgcolor={"white"}>
            <BoxComponent>
              <Stack gap={1} p={1}>
                <Typography level="body-xs" fontWeight={400} color="primary">
                  Office Supplies - Furniture and applicances
                </Typography>

                <Typography level="lg" fontWeight={600}>
                  Cradle pro ergonomic and foldable office table and chair
                </Typography>

                <Typography> &#8369; 12,000</Typography>
              </Stack>

              <Box
                p={1}
                gap={1}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <QuantityControlComponent
                    quantity={quantity}
                    onDecrease={onDecrease}
                    onIncrease={onIncrease}
                  />

                  <Stack>
                    <Typography>Item Subtotal :</Typography>
                    <Typography>&#8369; 24,000</Typography>
                  </Stack>
                </Stack>

                <Divider />

                <ButtonComponent label={"Add to Cart"} />
              </Box>
            </BoxComponent>

            <BoxComponent>
              <Stack>
                <Typography level="xs" fontWeight={400}>
                  Unit of measurement:
                </Typography>

                <Typography level="xs" fontWeight={600}>
                  1 piece set in a carton box
                </Typography>
              </Stack>
            </BoxComponent>
          </Stack>
        </Grid>
      </Grid>
      <Stack gap={1} mt={2}>
        <BoxComponent>
          <Stack gap={1} p={1}>
            <Typography level="body xs" fontWeight={400}>
              Specifications:
            </Typography>

            <List>
              <ListItem>
                <Typography level="body-sm">
                  Base: 5 star aluminum alloy
                </Typography>
              </ListItem>

              <ListItem>
                <Typography level="body-sm">
                  Armrest type: 3D with 360 fully rotate
                </Typography>
              </ListItem>

              <ListItem>
                <Typography level="body-sm">
                  Maximum load: 150 KG (330 lbs)
                </Typography>
              </ListItem>

              <ListItem>
                <Typography level="body-sm">
                  Chair: W720mm x D840mm x H1290-1375mm
                </Typography>
              </ListItem>

              <ListItem>
                <Typography level="body-sm">Seat: W570mm x D500mm</Typography>
              </ListItem>
            </List>
          </Stack>
        </BoxComponent>
      </Stack>
    </>
  );
};

export default Item;
