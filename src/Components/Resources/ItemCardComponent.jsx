import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardCover,
  CardOverflow,
  Stack,
  Typography,
} from "@mui/joy";
import { Circle, CircleSmall } from "lucide-react";
import React, { Fragment } from "react";
import ButtonComponent from "../Common/ButtonComponent";
import ChipComponent from "../Common/ChipComponent";

const ItemCardComponent = ({
  item_name = "LCD Projector: Mounted UIn",
  category = "Medical Equipment",
  unit = "Piece",
  variant = "High-end",
  image = "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  // quantity = 2,
  amount = 12000,
}) => {
  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <Card
        sx={{
          border: 1,
          borderColor: "neutral.50",
          // backgroundColor: "neutral.300",
          height: "156px",
          padding: 0,
        }}
      >
        <CardCover>
          {/* <AspectRatio ratio="1"> */}
          <img src={image} srcSet={image} loading="lazy" alt="" />
          {/* </AspectRatio> */}
        </CardCover>

        <CardContent sx={{ justifyContent: "flex-end", padding: 1 }}>
          <ChipComponent
            label={variant}
            size="sm"
            color={"success"}
            startDecorator={<CircleSmall size={12} />}
          />
        </CardContent>
      </Card>

      {/* CONTENT */}
      <Stack my={1.2} gap={0.5}>
        <Typography level="body-xs" fontWeight={400}>
          {category} <CircleSmall size={8} /> {unit}
        </Typography>
        <Typography sx={{ fontSize: "sm", fontWeight: "lg" }}>
          {item_name}
        </Typography>
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography sx={{ fontSize: "md", fontWeight: "lg" }}>
          &#8369; {amount.toLocaleString()}
        </Typography>

        <ButtonComponent
          label={"Add to cart"}
          size={"sm"}
          variant={"outlined"}
        />
      </Stack>
    </Box>
  );
};

export default ItemCardComponent;
