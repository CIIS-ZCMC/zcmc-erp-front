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
  const parentRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [rowHeight, setRowHeight] = useState(360);

  // --------------------------------------------------
  // DETECT CONTAINER WIDTH
  // --------------------------------------------------

  useEffect(() => {
    const updateWidth = () => {
      if (parentRef.current) {
        setContainerWidth(parentRef.current.offsetWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // --------------------------------------------------
  // DYNAMIC COLUMN COUNT
  // --------------------------------------------------

  const columns = Math.max(1, Math.floor(containerWidth / columnWidth));

  const rowCount = Math.ceil(items.length / columns);

  // --------------------------------------------------
  // VIRTUALIZER
  // --------------------------------------------------

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 3,
  });

  return (
    <Fragment>
      <BoxComponent
        mt={2}
        height={height}
        boxShadow="sm"
        sx={{ position: "relative", overflow: "hidden" }}
      >
        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${columnWidth}px, 1fr))`,
              gap: 2,
            }}
          >
            {[...Array(9)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                animation="wave"
                height={180}
                sx={{ borderRadius: 10 }}
              />
            ))}
          </Box>
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
