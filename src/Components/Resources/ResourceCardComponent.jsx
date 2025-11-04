import { Delete } from "@mui/icons-material";
import {
  AspectRatio,
  Box,
  Card,
  CardContent,
  CardOverflow,
  IconButton,
  Stack,
  Typography,
} from "@mui/joy";
import React, { Fragment } from "react";

export default function ResourceCardComponent({
  image = "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  category,
  name,
  price,
  total,
  quantity,
  onIncrease,
  onDecrease,
  onDelete,
}) {
  return (
    <Fragment>
      <Card
        variant="outlined"
        sx={{
          borderRadius: "xl",
          boxShadow: "sm",
          transition: "0.3s",
          "&:hover": { boxShadow: "md", transform: "translateY(-4px)" },
          width: 320,
          position: "relative",
        }}
      >
        <CardOverflow>
          <AspectRatio ratio="2">
            <img src={image} alt={name} loading="lazy" />
          </AspectRatio>
          <IconButton
            aria-label="Like minimal photography"
            size="md"
            variant="solid"
            color="danger"
            sx={{
              position: "absolute",
              zIndex: 2,
              borderRadius: "50%",
              right: "1rem",
              bottom: 0,
              transform: "translateY(50%)",
            }}
          >
            <Delete />
          </IconButton>
        </CardOverflow>

        <CardContent>
          <Typography level="body-xs" color="neutral">
            {category}
          </Typography>

          <Typography level="title-md" fontWeight={600} sx={{ mb: 1 }}>
            {name}
          </Typography>

          {/* Quantity Controls */}
          {/* <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton size="sm" variant="outlined" onClick={onDecrease}>
              <Remove />
            </IconButton>
            <Typography level="body-sm" minWidth={24} textAlign="center">
              {quantity}
            </Typography>
            <IconButton size="sm" variant="outlined" onClick={onIncrease}>
              <Add />
            </IconButton>
          </Stack> */}

          {/* Prices */}
          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Box>
              <Typography fontWeight={600}>
                ₱{price?.toLocaleString()}.00
              </Typography>
              <Typography level="body-xs">per item</Typography>
            </Box>
            <Box textAlign="right">
              <Typography fontWeight={600} color="primary">
                ₱{total?.toLocaleString()}.00
              </Typography>
              <Typography level="body-xs">Total Cost</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Fragment>
  );
}
