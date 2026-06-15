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
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        minHeight: 0,
        px: 1,
        pt: 1,
        pb: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          width: "100%",
          boxSizing: "border-box",
          pb: "24px", // add this
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
    </Box>
  );
}
