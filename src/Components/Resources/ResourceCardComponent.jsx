import QuantityControlComponent from "@Components/Cart/QuantityControlComponent";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
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
  useTheme,
} from "@mui/joy";
import { ArrowUpRightIcon } from "lucide-react";
import React, { Fragment, useState } from "react";
import CartPreviewComponent from "./CartPreviewComponent";

import { isAopDisabled } from "../../Utils/AopStatus";
import defaultItem from "../../assets/item.jpg";

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
  onQtyChange,
  onDelete,
  options = [],
  purchase_type,
  onPurchaseTypeChange,
}) {
  const theme = useTheme();
  const color = theme.palette;

  const total = quantity * price;
  const [openModal, setOpenModal] = useState(false); // ← modal state
  const [selectedPurchaseType, setSelectedPurchaseType] =
    useState(purchase_type);

  return (
    <Fragment>
      <Card
        variant="outlined"
        sx={{
          maxWidth: "100%",
          boxShadow: "lg",
          transition: "0.3s",
          "&:hover": { boxShadow: "md", transform: "translateY(-4px)" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardOverflow>
          <AspectRatio sx={{ minWidth: 200 }}>
            <img
              src={defaultItem}
              srcSet="https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286&dpr=2 2x"
              loading="lazy"
              alt=""
            />
          </AspectRatio>
          <IconButton
            aria-label="delete"
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
            onClick={() => onDelete(resource_id)}
            disabled={isAopDisabled(status)}
          >
            <Delete />
          </IconButton>
        </CardOverflow>

        <CardContent
          sx={{
            flex: 1, // fill remaining space
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between", // pushes prices to bottom
            gap: 2,
          }}
        >
          <Stack
            direction={"row"}
            justifyContent="space-between"
            alignItems="flex-start"
            mt={2}
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
                <IconButtonComponent
                  icon={<ArrowUpRightIcon />}
                  size={"xs"}
                  color={"#323232"}
                  onClick={() => setOpenModal(true)}
                />
              </Stack>
            </Box>

            {/* Quantity Controls */}

            <Box>
              <QuantityControlComponent
                quantity={quantity}
                onDecrease={() => onQtyChange(resource_id, quantity - 1)}
                onIncrease={() => onQtyChange(resource_id, quantity + 1)}
                disabled={isAopDisabled(status)}
              />
            </Box>
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
              <Typography level="body-lg" fontWeight={600}>
                ₱{price?.toLocaleString()}.00
              </Typography>
              <Typography level="body-xs">per item</Typography>
            </Box>
            <Box textAlign="right">
              <Typography level="body-lg" fontWeight={600} color="primary">
                ₱{total?.toLocaleString()}.00
              </Typography>
              <Typography level="body-xs">Total Cost</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <CartPreviewComponent
        open={openModal}
        onClose={() => setOpenModal(false)}
        price={price}
        name={name}
        category={category}
        specifications={specifications}
        unit={unit}
        qty={quantity}
        isAddToCart={false}
      />
    </Fragment>
  );
}
