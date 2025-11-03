import BoxComponent from "@Components/Common/Card/BoxComponent";
import { Box, Grid, Skeleton, Typography } from "@mui/joy";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import ItemCardComponent from "./ItemCardComponent";
import useItemsHook from "../../Hooks/ItemsHook";

export default function ProductGrid({
  onAddToCart,
  onItemInfo,
  columnWidth = 300,
  rowHeight = 360,
  height = "64vh",
}) {
  const [displayLoading, setDisplayLoading] = useState(false);
  const { items, getItems } = useItemsHook();

  useEffect(() => {
    setDisplayLoading(true);

    getItems((status, message, data) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
      console.log(data);
      setDisplayLoading(false);
    });
  }, []);

  return (
    <Fragment>
      <BoxComponent mt={2} boxShadow="sm" height={height}>
        {displayLoading && items.length === 0 ? (
          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={180}
                  sx={{ borderRadius: 10 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {items.map((item, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <ItemCardComponent
                  item={item}
                  btnAction={() => onAddToCart?.(item)}
                  itemInfoAction={() => onItemInfo?.(item)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </BoxComponent>
    </Fragment>
  );
}
