import ChipComponent from "@Components/Common/ChipComponent";
import { Circle, ZoomOutMap } from "@mui/icons-material";
import { AspectRatio, Box, Card, CardOverflow, IconButton } from "@mui/joy";
import React from "react";
import defaultItem from "../../assets/item.jpg";

export default function ItemRowComponent({
  item,
  itemInfoAction,
  onZoom,
  showZoom = true,
  showVariant = true,
  minHeight = 120,
  maxHeight = 200,
  disableHoverTransform = false,
  sx = {},
}) {
  const imgSrc = item?.image || defaultItem;

  return (
    <Card
      variant="plain"
      sx={{
        borderRadius: "lg",
        transition: "0.2s ease",
        "&:hover": {
          boxShadow: "lg",
          transform: disableHoverTransform ? "none" : "scale(1.02)",
        },
        ...sx,
      }}
    >
      <CardOverflow>
        <AspectRatio minHeight={minHeight} maxHeight={maxHeight}>
          <img
            src={imgSrc}
            role="button"
            loading="lazy"
            alt={item?.name}
            onClick={itemInfoAction}
            style={{
              width: "100%", // Fill the width of the container
              height: "100%", // Fill the height of the container
              objectFit: "cover", // Maintain aspect ratio, crop if necessary
              borderRadius: 10,
              display: "block", // Remove default inline spacing
            }}
          />
        </AspectRatio>

        {/* Zoom Button */}
        {showZoom && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
            }}
          >
            <IconButton
              size="sm"
              variant="soft"
              sx={{ opacity: 0.7 }}
              onClick={onZoom}
            >
              <ZoomOutMap />
            </IconButton>
          </Box>
        )}

        {/* Variant Badge */}
        {showVariant && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
            }}
          >
            <ChipComponent
              label={item?.terminology ?? "High-end"}
              size="sm"
              color={
                item?.terminology === "Variant-Regular" ? "success" : "warning"
              }
              startDecorator={<Circle sx={{ fontSize: 10 }} />}
            />
          </Box>
        )}
      </CardOverflow>
    </Card>
  );
}
