import BoxComponent from "@Components/Common/Card/BoxComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import {
  Autocomplete,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import React, { Fragment, useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import CartPreviewComponent from "./CartPreviewComponent";
import Cart from "./Cart";
import { useAuth } from "../../Store/AuthStore";
import useCartStore from "../../Hooks/ItemCartHook";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import useItemsHook from "../../Hooks/ItemManagementHook";

export default function AddToCartLayout({
  getSearchSuggestions,
  getSearchResults,
  suggestions,
  results,
  loading = false,
  items = [],
  getItems,
  isPPMP = false,
  options = [],
  addActivityToItem,
  removeActivityFromItem,
  filterValues,
  setFilterValues,
}) {
  const { user } = useAuth();
  const cartStore = useCartStore(user?.id || "guest", isPPMP);
  const { cart, addToCart, removeFromCart, updateQty, clearCart } = cartStore();
  const {
    classification,
    categories,
    variants,
    getItemCategories,
    getItemClassification,
    getSystems,
  } = useItemsHook();

  // const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  // Filter values

  const totalCost = cart.reduce(
    (sum, i) => sum + i.estimated_budget * i.qty,
    0,
  );
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    getItemCategories(() => {});
    getItemClassification(() => {});
    getSystems(() => {});
  }, []);

  return (
    <Fragment>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={8}>
          <BoxComponent boxShadow="sm">
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              p={1}
            >
              <SearchWithSuggestions
                placeholder="Search items..."
                getSearchSuggestions={getSearchSuggestions}
                getSearchResults={getSearchResults}
                suggestions={suggestions}
                getItems={getItems}
                onSelect={(item) => console.log("Selected item:", item)}
              />
              <Typography
                level="body-sm"
                endDecorator={
                  <IconButtonComponent
                    variant={"outlined"}
                    size={"sm"}
                    icon={openFilter ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => setOpenFilter(!openFilter)}
                  />
                }
              >
                Filters
              </Typography>
            </Stack>
            <Stack
              sx={{
                overflow: "hidden",
                maxHeight: openFilter ? 200 : 0,
                opacity: openFilter ? 1 : 0,
                transform: openFilter ? "translateY(0)" : "translateY(-8px)",
                transition:
                  "max-height 0.25s ease, opacity 0.2s ease, transform 0.25s ease",
                pointerEvents: openFilter ? "auto" : "none",
                px: 1,
                pb: openFilter ? 1 : 0,
              }}
            >
              <Divider sx={{ py: 0.05, my: 1.5 }} />
              <Stack direction={"row"} spacing={3} alignItems={"flex-end"}>
                <AutocompleteComponent
                  label={"Filter by classification"}
                  options={classification}
                  value={filterValues?.classification}
                  setValue={(val) => {
                    setFilterValues((prev) => ({
                      ...prev,
                      classification: val,
                    }));
                  }}
                  getOptionLabel={(opt) => opt?.name || ""}
                  placeholder="Select classification"
                />
                <AutocompleteComponent
                  label={"Filter by category"}
                  options={categories}
                  value={filterValues?.category}
                  setValue={(val) => {
                    setFilterValues((prev) => ({
                      ...prev,
                      category: val,
                    }));
                  }}
                  getOptionLabel={(opt) => opt?.name || ""}
                  placeholder="Select category"
                />
                <AutocompleteComponent
                  label={"Filter by variant"}
                  placeholder="Select variant"
                  options={variants}
                  value={filterValues?.system}
                  setValue={(val) => {
                    setFilterValues((prev) => ({
                      ...prev,
                      system: val,
                    }));
                  }}
                  getOptionLabel={(opt) => opt?.name || ""}
                />
                <ButtonComponent
                  label="Clear Filters"
                  width="400px"
                  variant={"plain"}
                  color="primary"
                  onClick={() =>
                    setFilterValues({
                      classification: null,
                      category: null,
                      system: null,
                    })
                  }
                />
              </Stack>
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
            isPPMP={isPPMP}
            options={options}
            removeActivityFromItem={removeActivityFromItem}
            addActivityToItem={addActivityToItem}
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
