import BoxComponent from "@Components/Common/Card/BoxComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import { Grid, Stack, Typography } from "@mui/joy";
import React, { Fragment, useState } from "react";
import ProductGrid from "./ProductGrid";
import CartPreviewComponent from "./CartPreviewComponent";
import Cart from "./Cart";

export default function AddToCartLayout({}) {
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing)
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + (item.qty || 1) } : p
        );
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  };

  const handleRemove = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const handleQtyChange = (id, qty) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(qty, 1) } : i))
    );

  const totalCost = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  return (
    <Fragment>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={8}>
          <BoxComponent boxShadow="sm">
            <Stack direction={"row"}>
              <SearchBarComponentv2 />
            </Stack>
          </BoxComponent>
          <ProductGrid
            onItemInfo={(item) => {
              setSelectedProduct(item);
              setOpenPreview(true);
            }}
            onAddToCart={handleAddToCart}
          />
        </Grid>
        <Grid xs={4}>
          <Cart
            cart={cart}
            removeFromCart={handleRemove}
            onQtyChange={handleQtyChange}
            totalCost={totalCost}
            totalQty={totalQty}
          />
        </Grid>
      </Grid>

      <CartPreviewComponent
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        item={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </Fragment>
  );
}
