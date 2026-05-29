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
import React, { Fragment, useEffect, useMemo, useState } from "react";
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

  const totalCost = useMemo(() => {
    return cart.reduce((sum, i) => sum + i.estimated_budget * i.qty, 0);
  }, [cart]);

  const totalQty = useMemo(() => {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }, [cart]);

  const executeSearch = () => {
    setDisplayLoading(true);

    const { classification, category, system } = filterValues;

    const filterParams = {
      ...(classification?.id && {
        item_classification_id: classification.id,
      }),
      ...(category?.id && {
        item_category_id: category.id,
      }),
      ...(system?.id && {
        system_id: system.id,
      }),
    };

    const params = {
      ...(search && { search }),
      ...(isPPMP && { type: "ppmp_item" }),
      ...filterParams,
    };

    if (!search && Object.keys(filterParams).length === 0) {
      params.mode = "selection";
    }

    getItems(params, () => {
      setDisplayLoading(false);
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      executeSearch();
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, filterValues]);

  useEffect(() => {
    setDisplayLoading(true);

    getItemCategories(() => {});
    getItemClassification(() => {});
    getSystems(() => {});
    getItems(
      { mode: "selection", ...(isPPMP && { type: "ppmp_item" }) },
      () => {
        setDisplayLoading(false);
      },
    );
  }, []);

  return (
    <Fragment>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid
          item
          xs={12}
          md={8.5}
          sx={{
            height: "calc(100vh - 340px)",
          }}
        >
          <BoxComponent boxShadow="sm">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent={"space-between"}
              p={1}
            >
              <SearchBarComponentv2 value={search} setValue={setSearch} />
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
                sx={{ mt: { xs: 1, sm: 0 } }}
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
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems={{ xs: "stretch", sm: "flex-end" }}
              >
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
                  getOptionLabel={(opt) => opt?.system || ""}
                />
                <ButtonComponent
                  label="Clear Filters"
                  width={{ xs: "100%", sm: "400px" }}
                  variant="soft"
                  color="primary"
                  onClick={() => {
                    // Reset all filters
                    const newFilters = {
                      classification: null,
                      category: null,
                      system: null,
                    };
                    setFilterValues(newFilters);

                    // Trigger search with current input (search string)
                    handleSearch(search || "", newFilters);
                  }}
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
        <Grid
          item
          xs={12}
          md={3.5}
          sx={{ flexGrow: 1, height: "calc(100vh - 200px)" }}
        >
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
