import BoxComponent from "@Components/Common/Card/BoxComponent";
import { Box, Skeleton } from "@mui/joy";
import React from "react";
import ItemCardComponent from "./ItemCardComponent";

export default function ProductGrid({
  onAddToCart,
  onItemInfo,
  columnWidth = 250,
  height = "100%",
  loading = false,
  items = [],
}) {
  return (
    <BoxComponent
      height={height}
      boxShadow="sm"
      sx={{
        overflow: "auto",
        overflowX: "hidden",
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${columnWidth}px, 1fr))`,
          gap: 3,
          p: 1,
          pb: 5, // add this
        }}
      >
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                animation="wave"
                height={130}
                sx={{ borderRadius: 10 }}
              />
            ))
          : items.map((item) => (
              <ItemCardComponent
                key={item.id}
                item={item}
                btnAction={() => onAddToCart?.(item)}
                itemInfoAction={() => onItemInfo?.(item)}
              />
            ))}
      </Box>
    </BoxComponent>
  );
}
