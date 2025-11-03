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
}) => {
  const theme = useTheme();
  const color = theme.palette;

  return (
    <Fragment>
      <Card
        variant="plain"
        sx={{
          borderRadius: "lg",
          "&:hover": {
            boxShadow: "lg",
            transform: "scale(1.02)",
            transition: "0.2s ease-in-out",
          },
        }}
      >
        <CardOverflow>
          <AspectRatio minHeight={120} maxHeight={200}>
            <img
              src={item?.image ?? image}
              role="button"
              loading="lazy"
              alt={item?.name}
              onClick={itemInfoAction}
            />
          </AspectRatio>

          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <IconButton size="sm" variant="soft" sx={{ opacity: 0.6 }}>
              <ZoomOutMap />
            </IconButton>
          </Box>

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
              startDecorator={<Circle style={{ fontSize: 11 }} />}
            />
          </Box>
        </CardOverflow>

        <CardContent>
          <Typography level="body-xs">
            {item?.item_category?.name} <CircleSmall size={8} />{" "}
            {item?.item_unit?.name}
          </Typography>

          <Typography level="title-sm">{item?.name}</Typography>
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
      </Card>
    </Fragment>
  );
};

export default ItemCardComponent;
