import React, { Fragment } from "react";

import {
  Box,
  Stack,
  Typography,
  Divider,
  Autocomplete,
  ChipDelete,
  Chip,
} from "@mui/joy";
import { LucideDot, Minus, Plus, Trash } from "lucide-react";

import ButtonComponent from "@Components/Common/ButtonComponent";
import QuantityControlComponent from "@Components/Cart/QuantityControlComponent";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import { CancelOutlined } from "@mui/icons-material";
import useSnackbarHook from "../../Hooks/SnackbarHook";

const ItemsCart = ({
  item,
  image = "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318",
  id,
  quantity,
  onRemove,
  onQuantityChange,
  isPPMP = false,
  options = [],
  addActivityToItem,
  removeActivityFromItem,
}) => {
  const { showSnack } = useSnackbarHook();

  return (
    <Fragment>
      <Box display={"flex"} gap={1}>
        <Box
          component="img"
          src={image}
          alt={name}
          loading="lazy"
          sx={{
            width: 65,
            height: 55,
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback-image.png";
          }}
        />

        <Box width={"100%"}>
          <Typography fontSize={13} fontWeight={600}>
            {item?.name}
          </Typography>
          <Typography level="body-xs" display={"flex"} alignItems={"center"}>
            {item?.terminology ? (
              <>
                {item?.terminology} <LucideDot />
              </>
            ) : (
              ""
            )}{" "}
            {item?.category}
          </Typography>
          <Typography fontSize={12} fontWeight={600} textColor={"primary.500"}>
            &#8369; {item?.estimated_budget?.toLocaleString()}
          </Typography>
          <Box
            display={"flex"}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            <QuantityControlComponent
              quantity={item.qty}
              onDecrease={() => onQuantityChange(item.id, item.qty - 1)}
              onIncrease={() => onQuantityChange(item.id, item.qty + 1)}
            />

            <ButtonComponent
              label={"Remove"}
              variant={"plain"}
              color="black"
              endDecorator={<Trash size={12} style={{ paddingLeft: 3 }} />}
              size={"xs"}
              onClick={onRemove}
            />
          </Box>
        </Box>
      </Box>
      {isPPMP && (
        <Fragment>
          <AutocompleteComponent
            label="Select Activity"
            placeholder="Select Activity"
            options={options}
            getOptionLabel={(option) => option.activity_code}
            value={null}
            setValue={(val) => {
              if (!val) return;

              const alreadySelected = item.activities?.some(
                (a) => a.code === val.activity_code
              );

              if (alreadySelected) {
                // show toast, alert, or ignore
                showSnack(500, "Activity already selected");
                return;
              }

              addActivityToItem(item.id, {
                id: val.activity_id,
                code: val.activity_code,
              });
            }}
          />
        </Fragment>
      )}
      {isPPMP && item?.activities && item.activities.length > 0 && (
        <Box
          sx={{
            mt: 1,
            p: 1,
            border: "2px dashed #e0e0e0",
            borderRadius: "8px",
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {item.activities.map((act, idx) => (
            <Chip
              size="sm"
              color="primary"
              endDecorator={
                <ChipDelete
                  onDelete={() => removeActivityFromItem(item.id, act.id)}
                />
              }
            >
              {act.code}
            </Chip>
          ))}
        </Box>
      )}

      <Divider sx={{ my: 1.5 }} />
    </Fragment>
  );
};

export default ItemsCart;
