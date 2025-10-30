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
} from "@mui/joy";
import { Circle, CircleSmall, ZoomInIcon } from "lucide-react";
import React, { Fragment, useState } from "react";

import useResourceHook from "../../Hooks/ResourceHook";

import ButtonComponent from "../Common/ButtonComponent";
import ChipComponent from "../Common/ChipComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import { RemoveCircle } from "@mui/icons-material";

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
        onClick={itemInfoAction}
      >
        <CardOverflow>
          <AspectRatio ratio="4/3">
            <img
              src={item?.image ?? image}
              role="button"
              loading="lazy"
              alt={item?.terminology?.name}
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
            <IconButton size="sm" variant="soft" color="neutral">
              <ZoomInIcon />
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
              label={item?.terminology?.name}
              size="sm"
              color={"primary"}
              startDecorator={<CircleSmall size={12} />}
            />
          </Box>
        </CardOverflow>

        <CardContent>
          <Typography level="body-xs">
            {item?.item_category?.description} <CircleSmall size={8} />{" "}
            {item?.item_unit?.name}
          </Typography>

          <Typography level="title-md" noWrap>
            {item?.name}
          </Typography>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"flex-end"}
          >
            <Typography level="title-lg" fontWeight="bold" mt={0.5}>
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
