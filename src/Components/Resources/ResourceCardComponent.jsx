import QuantityControlComponent from "@Components/Cart/QuantityControlComponent";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import { Delete, NorthEast } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import React, { Fragment, useEffect, useState } from "react";
import { isAopDisabled } from "../../Utils/AopStatus";
import { formatPeso } from "../../Utils/FormatPeso";
import ChipComponent from "@Components/Common/ChipComponent";

export default function ResourceCardComponent({
  status,
  image = "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  resource_id,
  category,
  name,
  price,
  quantity,
  unit,
  specifications = [],
  object_category,
  onQtyChange,
  onDelete,
  options = [],
  purchase_type,
  onPurchaseTypeChange,
  onPreview,
}) {
  const theme = useTheme();
  const color = theme.palette;

  const total = quantity * price;
  const [selectedPurchaseType, setSelectedPurchaseType] =
    useState(purchase_type);

  useEffect(() => {
    setSelectedPurchaseType(purchase_type);
  }, [purchase_type]);
  return (
    <Fragment>
      <Card
        variant="plain"
        sx={{
          maxWidth: "100%",
          boxShadow: "lg",
          transition: "0.3s",
          "&:hover": { boxShadow: "md", transform: "translateY(-4px)" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent
          sx={{
            flex: 1, // fill remaining space
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // pushes prices to bottom
            gap: 3,
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"}>
            <ChipComponent
              label={object_category}
              fontSize={12}
              variant={"soft"}
              color={object_category === "MOOE" ? "primary" : "warning"}
              chipRadius={"10px"}
            />
            <Stack direction={"row"} spacing={1}>
              <IconButton
                aria-label="delete"
                size="sm"
                variant="solid"
                color="danger"
                sx={{
                  borderRadius: "50%",
                }}
                onClick={() => onDelete(resource_id)}
                disabled={isAopDisabled(status)}
              >
                <Delete />
              </IconButton>
              <IconButtonComponent
                icon={<NorthEast />}
                size={"sm"}
                color={"#323232"}
                onClick={onPreview}
              />
            </Stack>
          </Stack>

          <Stack
            direction={"row"}
            justifyContent="space-between"
            alignItems="center"
            mt={2}
            spacing={1}
          >
            <Box>
              {category && (
                <Typography level="body-xs" color="neutral">
                  {category}
                </Typography>
              )}

              <Stack direction={"row"} spacing={1} alignItems="center" mt={0.5}>
                <Typography
                  level="title-sm"
                  fontWeight={600}
                  sx={{
                    mb: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {name}
                </Typography>
              </Stack>
            </Box>

            {/* Quantity Controls */}

            <Stack alignItems="flex-end" spacing={2}>
              <QuantityControlComponent
                quantity={quantity}
                onDecrease={() => onQtyChange(resource_id, quantity - 1)}
                onIncrease={() => onQtyChange(resource_id, quantity + 1)}
                disabled={isAopDisabled(status)}
                onChange={(value) => onQtyChange(resource_id, value)}
              />
            </Stack>
          </Stack>

          <Box>
            <Typography level="body-xs">Purchase Type</Typography>
            <AutocompleteComponent
              options={options}
              value={selectedPurchaseType}
              setValue={(val) => {
                setSelectedPurchaseType(val);
                onPurchaseTypeChange(val); // trigger parent update
              }}
              getOptionLabel={(opt) => opt?.description || ""}
              placeholder="Select type"
              disabled={isAopDisabled(status)}
            />
          </Box>

          {/* Prices */}
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography level="title-lg" fontWeight={"bolder"}>
                {formatPeso(price)}
              </Typography>
              <Typography level="body-xs">per item</Typography>
            </Box>
            <Box textAlign="right">
              <Typography
                level="title-lg"
                fontWeight={"bolder"}
                color="primary"
              >
                {formatPeso(total)}
              </Typography>
              <Typography level="body-xs">Total Cost</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Fragment>
  );
}
