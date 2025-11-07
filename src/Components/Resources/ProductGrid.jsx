import BoxComponent from "@Components/Common/Card/BoxComponent";
import { Box, Grid, Skeleton, Typography } from "@mui/joy";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import ItemCardComponent from "./ItemCardComponent";
import useItemsHook from "../../Hooks/ItemsHook";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function ProductGrid({
  onAddToCart,
  onItemInfo,
  columnWidth = 300,
  rowHeight = 360,
  height = "64vh",
  loading = false,
  items = [],
}) {
  const parentRef = useRef();

  // Example: 3 columns
  const columns = 3;
  const rowCount = Math.ceil(items.length / columns);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 310, // estimated row height
    overscan: 3, // render a few extra rows for smooth scrolling
  });
  return (
    <Fragment>
      <BoxComponent mt={2} boxShadow="sm" height={height}>
        {loading && items.length === 0 ? (
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
          <Box
            ref={parentRef}
            sx={{
              overflow: "auto",
              height,
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const startIndex = virtualRow.index * columns;
                const rowItems = items.slice(startIndex, startIndex + columns);

                return (
                  <Box
                    key={virtualRow.key}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      width: "100%",
                    }}
                  >
                    <Grid container spacing={2}>
                      {rowItems.map((item, index) => (
                        <Grid xs={12} sm={6} md={4} key={index}>
                          <ItemCardComponent
                            item={item}
                            btnAction={() => onAddToCart?.(item)}
                            itemInfoAction={() => onItemInfo?.(item)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </BoxComponent>
    </Fragment>
  );
}
