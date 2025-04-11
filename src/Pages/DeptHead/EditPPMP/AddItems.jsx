import { Box, Grid, Stack, Typography } from "@mui/joy";
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import IconButtonComponent from "../../../Components/Common/IconButtonComponent";
import { ChevronDown, ChevronUp } from "lucide-react";
import SheetComponent from "../../../Components/Common/SheetComponent";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import ItemsList from "../../../Layout/Items/ItemsList";
import ItemCardComponent from "../../../Components/Resources/ItemCardComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { MdOpenInNew } from "react-icons/md";
import ItemsCart from "../../../Layout/Items/ItemsCart";

const activityData = [
  {
    value: 1,
    label: "#0001",
    description: "Sample description for activity 1",
  },
  {
    value: 2,
    label: "#0002",
    description: "Sample description for activity 2",
  },
  {
    value: 3,
    label: "#0003",
    description: "Sample description for activity 3",
  },
];

const products = new Array(16).fill(0).map((_, i) => ({
  id: i + 1,
  name: "Cradle Pro Ergonomic Office Chair",
  category: "Appliances - Complete Set",
  price: 12000,
  image: "/chair.png",
}));

function AddItems(props) {
  const { activityId, expenseId } = useParams();

  const activity = activityData.find(
    (item) => item.value === Number(activityId)
  );

  const activityInfo = activity
    ? {
        code: activity.label,
        description: activity.description,
      }
    : null;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cart, setCart] = useState([]);

  const handleCollapseClick = () => {
    setIsCollapsed((prev) => !prev);
  };

  const addToCart = (item) => {
    console.log(item);
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists
        ? prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalQty = cart.length;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  return (
    <Fragment>
      <ContainerComponent
        title={`You are managing resources for Activity: ${activityInfo?.code}`}
        description={
          "Collapse this card to view more information about the selected activity."
        }
        sx={{ mt: 2 }}
        actions={
          <Stack>
            <IconButtonComponent
              variant={"text"}
              icon={isCollapsed ? <ChevronUp /> : <ChevronDown />}
              onClick={(e) => {
                e.stopPropagation();
                handleCollapseClick();
              }}
            />
          </Stack>
        }
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {isCollapsed && (
            <Box>
              <Stack
                direction={"row"}
                gap={2}
                sx={{
                  justifyContent: "space-between",
                }}
              >
                <BoxComponent variant={"outlined"}>
                  <Typography fontSize={14} fontWeight={600}>
                    Activity code:
                  </Typography>
                  <Box width={"200px"} mt={1}>
                    <Typography fontSize={12} color="primary">
                      {activityInfo?.code}
                    </Typography>
                  </Box>
                </BoxComponent>

                <BoxComponent variant={"outlined"}>
                  <Typography fontSize={14} fontWeight={600}>
                    Activity:
                  </Typography>
                  <Box width={"80%"} mt={1}>
                    <Typography fontSize={12}>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book.
                    </Typography>
                  </Box>
                </BoxComponent>

                <BoxComponent variant={"outlined"}>
                  <Typography fontSize={14} fontWeight={600}>
                    Activity:
                  </Typography>
                  <Box width={"200px"} mt={1}>
                    <Typography fontSize={12}>{expenseId}</Typography>
                  </Box>
                </BoxComponent>
              </Stack>
            </Box>
          )}
        </Box>
      </ContainerComponent>

      <ContainerComponent
        title="Select items to add on PPMP"
        sx={{ mt: 2 }}
        actions={
          <>
            <Stack direction="row" gap={1}>
              <ButtonComponent
                label={"Request new item"}
                endDecorator={<MdOpenInNew />}
                variant={"outlined"}
              />
              <ButtonComponent
                label={"Cancel selection"}
                endDecorator={<MdOpenInNew />}
                variant={"outlined"}
              />
              <ButtonComponent label={"Save items"} />
            </Stack>
          </>
        }
      >
        <Grid
          container
          spacing={2}
          sx={{
            height: isCollapsed ? "54vh" : "63vh", // Sets a fixed height
            flexWrap: "nowrap", // Prevents wrapping of columns
            overflow: "hidden", // Hide extra scrollbars from container
          }}
        >
          {/* Left: Scrollable Item Cards */}
          <Grid xs>
            <BoxComponent sx={{ position: "sticky", top: 0 }}>
              <Typography>Sample</Typography>
            </BoxComponent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                mt: 1,
                gap: 2,
                p: 1,
                border: 1,
                borderColor: "neutral.100",
                borderRadius: 10,
                height: "85%",
                padding: 2,
                overflow: "auto",
              }}
            >
              {products.map((item, index) => (
                <ItemCardComponent
                  key={index}
                  item={item}
                  btnAction={() => addToCart(item)}
                />
              ))}
            </Box>
          </Grid>

          {/* Right: Cart */}
          <Grid
            sx={{
              width: 350,
              height: "100%",
              position: "sticky",

              border: 1,
              borderColor: "neutral.100",
              borderRadius: 10,
              bgcolor: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
              <Typography level="h6">
                {" "}
                <Typography fontSize={14} fontWeight={600}>
                  {totalQty === 0
                    ? "No items"
                    : `${totalQty} Item${totalQty > 1 ? "s" : ""}`}{" "}
                  in cart
                </Typography>
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
              }}
            >
              {console.log(cart)}
              {cart.map((item) => (
                <ItemsCart
                  key={item.id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={() => removeFromCart(item.id)}
                />
              ))}
            </Box>

            <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
              <Typography
                textAlign={"right"}
                sx={{
                  color: "gray",
                }}
                fontSize={14}
                fontWeight={600}
              >
                Total cost:
              </Typography>
              <Typography level="body-lg" fontWeight="lg" textAlign={"right"}>
                &#8369; {totalPrice.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </ContainerComponent>
    </Fragment>
  );
}

export default AddItems;
