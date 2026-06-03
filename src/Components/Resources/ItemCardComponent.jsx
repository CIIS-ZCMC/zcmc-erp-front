import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardCover,
  CardOverflow,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/joy";
import { CircleSmall, ZoomInIcon } from "lucide-react";
import React, { Fragment, useState } from "react";

import useResourceHook from "../../Hooks/ResourceHook";

import ButtonComponent from "../Common/ButtonComponent";
import ChipComponent from "../Common/ChipComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import { Circle, RemoveCircle, ZoomOutMap } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import defaultItem from "../../assets/item.jpg";

const ItemCardComponent = ({
  item,
  // item_name = "LCD Projector: Mounted UIn",
  // category = "Medical Equipment",
  // unit = "Piece",
  // variant = "High-end",
  image = "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  // quantity = 2,
  amount = 12000,
  itemInfoAction,
  btnAction,
  withContent = true,
  minHeight = 120,
  maxHeight = 200,
  showZoom = true,
  showVariant = true,
  onZoom,
  sx = {},
}) => {
  const theme = useTheme();
  const color = theme.palette;

  const imgSrc = item?.image || defaultItem;

  return (
    <Fragment>
      <Card
        variant="outlined"
        sx={{
          borderRadius: "lg",
          transition: "0.2s ease",
          "&:hover": {
            boxShadow: "lg",
            transform: "scale(1.02)",
          },
          bgcolor: "white",
          width: "100%",
          maxWidth: { xs: "100%", sm: 260, md: 290 },
          height: "auto", // ✅ ADD THIS
          display: "flex",
          flexDirection: "column",
          ...sx,
        }}
      >
        {withContent && (
          <CardContent>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography level="body-xs">
                {item?.item_category?.name} <CircleSmall size={8} />{" "}
                {item?.item_unit?.name}
              </Typography>
              {showVariant && (
                <ChipComponent
                  label={item?.terminology ?? "Variant not indicated"}
                  size="sm"
                  color={
                    item?.terminology === "Variant-Regular"
                      ? "success"
                      : "warning"
                  }
                  startDecorator={<Circle sx={{ fontSize: 10 }} />}
                />
              )}
            </Stack>

            <Tooltip title={item?.name}>
              <Typography level="title-sm" noWrap sx={{ cursor: "default" }}>
                {item?.name}
              </Typography>
            </Tooltip>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                level="title-md"
                fontWeight="bold"
                mt={0.5}
                sx={{ color: color.custom.light }}
              >
                ₱
                {item?.estimated_budget.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </Typography>
              <ButtonComponent
                label={"Add to cart"}
                size={"sm"}
                variant={"outlined"}
                onClick={btnAction}
              />
            </Stack>
          </CardContent>
        )}
      </Card>
    </Fragment>
  );
};

export default ItemCardComponent;
