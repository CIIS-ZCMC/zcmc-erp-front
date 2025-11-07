import BoxComponent from "@Components/Common/Card/BoxComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import { Grid, Stack, Typography } from "@mui/joy";
import React, { Fragment, useState } from "react";
import ProductGrid from "./ProductGrid";
import CartPreviewComponent from "./CartPreviewComponent";
import Cart from "./Cart";
import { useAuth } from "../../Store/AuthStore";
import useCartStore from "../../Hooks/ItemCartHook";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";

export default function AddToCartLayout({
  getSearchSuggestions,
  getSearchResults,
  suggestions,
  results,
  loading = false,
  items = [],
  getItems,
}) {
  const { user } = useAuth();
  const cartStore = useCartStore(user?.id || "guest");
  const { cart, addToCart, removeFromCart, updateQty, clearCart } = cartStore();

  // const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  const totalCost = cart.reduce(
    (sum, i) => sum + i.estimated_budget * i.qty,
    0
  );
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  return (
    <Fragment>
      {console.log("Current User in AddToCartLayout:", user)}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={8}>
          <BoxComponent boxShadow="sm">
            <Stack direction={"row"}>
              <SearchWithSuggestions
                placeholder="Search items..."
                getSearchSuggestions={getSearchSuggestions}
                getSearchResults={getSearchResults}
                suggestions={suggestions}
                getItems={getItems}
                onSelect={(item) => console.log("Selected item:", item)}
              />
            </Stack>
          </BoxComponent>
          <ProductGrid
            onItemInfo={(item) => {
              setSelectedProduct(item);
              setOpenPreview(true);
            }}
            onAddToCart={addToCart}
            loading={loading}
            items={items}
          />
        </Grid>
        <Grid xs={4}>
          <Cart
            cart={cart}
            removeFromCart={removeFromCart}
            onQtyChange={updateQty}
            totalCost={totalCost}
            totalQty={totalQty}
          />
        </Grid>
      </Grid>

      <CartPreviewComponent
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        item={selectedProduct}
        price={selectedProduct?.estimated_budget}
        category={selectedProduct?.item_category?.description}
        unit={selectedProduct?.item_unit?.name}
        specifications={selectedProduct?.item_specifications}
        name={selectedProduct?.name}
        variant={selectedProduct?.terminology}
        onAddToCart={addToCart}
      />
    </Fragment>
  );
}
