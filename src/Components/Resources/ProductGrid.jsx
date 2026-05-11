import BoxComponent from "@Components/Common/Card/BoxComponent";
import { Box, Grid, Skeleton, Typography, useTheme } from "@mui/joy";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import ItemCardComponent from "./ItemCardComponent";
import useItemsHook from "../../Hooks/ItemManagementHook";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMediaQuery } from "@mui/material";

export default function ProductGrid({
  onAddToCart,
  onItemInfo,
  columnWidth = 300,
  height = "64vh",
  loading = false,
  items = [],
}) {
  const parentRef = useRef();
  const rowRef = useRef(null);

  const [rowHeight, setRowHeight] = useState(360);

  // Example: 3 columns
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const columns = isXs ? 1 : isSm ? 2 : 3;
  const rowCount = Math.ceil(items.length / columns);

  useEffect(() => {
    if (rowRef.current) {
      setRowHeight(rowRef.current.offsetHeight);
    }
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight, // estimated row height
    overscan: 3, // render a few extra rows for smooth scrolling
  });
  return (
    <Fragment>
      <BoxComponent
        mt={2}
        height="100%"
        boxShadow="sm"
        sx={{ position: "relative" }}
      >
        {loading ? (
          <Grid container spacing={2}>
            {[...Array(9)].map((_, index) => (
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
              height: "100%",
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
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
                      display: "grid",
                      gridTemplateColumns: `repeat(${columns}, 1fr)`,
                      gap: 1,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      width: "100%",
                    }}
                  >
                    {rowItems.map((item, index) => (
                      <ItemCardComponent
                        key={item?.id || index}
                        item={item}
                        btnAction={() => onAddToCart?.(item)}
                        itemInfoAction={() => onItemInfo?.(item)}
                      />
                    ))}
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
