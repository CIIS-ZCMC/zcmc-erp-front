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
import useSearchHook from "../../Hooks/SearchHook";

export default function AddToCartLayout({
  results,
  loading = false,
  isPPMP = false,
  options = [],
  addActivityToItem,
  removeActivityFromItem,
}) {
  const { user } = useAuth();
  const cartStore = useCartStore(user?.id || "guest", isPPMP);
  const { cart, addToCart, removeFromCart, updateQty, clearCart } = cartStore();
  const {
    items,
    classification,
    categories,
    variants,
    getItems,
    getItemCategories,
    getItemClassification,
    getSystems,
  } = useItemsHook();
  const { getSearchSuggestions, suggestions } = useSearchHook();

  // const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterValues, setFilterValues] = useState({
    classification: null,
    category: null,
    system: null,
  });
  const [search, setSearch] = useState("");
  const [displayLoading, setDisplayLoading] = useState(false);

  // Filter values

  const totalCost = cart.reduce(
    (sum, i) => sum + i.estimated_budget * i.qty,
    0,
  );
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleSearch = (searchValue = search, filters = filterValues) => {
    setDisplayLoading(true);
    console.log(searchValue);
    const params = {
      ...(searchValue && { search: searchValue }),
      ...(filters?.classification?.id && {
        item_classification_id: filters.classification.id,
      }),
      ...(filters?.category?.id && { item_category_id: filters.category.id }),
      ...(filters?.system?.id && { system_id: filters.system.id }),
    };

    getItems(params, (status, message) => {
      setDisplayLoading(false);
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  };

  useEffect(() => {
    setDisplayLoading(true);

    getItemCategories(() => {});
    getItemClassification(() => {});
    getSystems(() => {});
    getItems(() => {
      setDisplayLoading(false);
    });
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
                suggestions={suggestions}
                onSelect={(item) => handleSearch(item.name)}
                onEnter={(value) => handleSearch(value)}
                onClear={() => handleSearch(undefined)}
                search={search}
                setSearch={setSearch}
                getItems={getItems}
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
                    const newFilters = { ...filterValues, classification: val };
                    setFilterValues(newFilters);
                    handleSearch(search.name, newFilters); // trigger search
                  }}
                  getOptionLabel={(opt) => opt?.name || ""}
                  placeholder="Select classification"
                />
                <AutocompleteComponent
                  label={"Filter by category"}
                  options={categories}
                  value={filterValues?.category}
                  setValue={(val) => {
                    const newFilters = { ...filterValues, category: val };
                    setFilterValues(newFilters);
                    handleSearch(search.name, newFilters); // trigger search
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
                    const newFilters = { ...filterValues, system: val };
                    setFilterValues(newFilters);
                    handleSearch(search.name, newFilters); // trigger search
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
            loading={displayLoading}
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
