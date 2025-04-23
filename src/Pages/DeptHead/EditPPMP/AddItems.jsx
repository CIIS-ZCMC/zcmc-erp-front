import { Box, Grid, Stack, Typography } from "@mui/joy";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import SearchBarComponent from "../../../Components/SearchBarComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import empty_cart from "../../../assets/empty-cart.png";
import useItemsHook from "../../../Hooks/ItemsHook";
import { productNames } from "../../../Data/dummy";
import { categories } from "../../../Data/dummy";
import { images } from "../../../Data/dummy";
import useItemCartHook from "../../../Hooks/ItemCartHook";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import PageLoader from "../../../Components/Loading/PageLoader";
import Item from "../../Items/Item";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import { usePPMPItemsHook } from "../../../Hooks/PPMPItemsHook";

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

const products = new Array(50).fill(0).map((_, i) => {
  const randomIndex = Math.floor(Math.random() * productNames.length);
  return {
    id: i + 3,
    item_code: "ITM006",
    activity_code: "ACT001",
    activity_id: 1,
    expense_class_id: "MOOE",
    description: productNames[randomIndex],
    classification: "Type A",
    variant: "High-end",
    estimated_budget: Math.floor(Math.random() * 10000) + 1000, // Price between 1000 and 11000,
    category: categories[Math.floor(Math.random() * categories.length)],
    aop_quantity: 0,
    quantity: 0,
    unit: "pcs",
    total_amount: 0,
    target_by_quarter: {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    },
    fund_source: "Fund A",
    remarks: "No remarks",
    image: images[randomIndex],
  };
});

function AddItems(props) {
  const { items, getItems } = useItemsHook();
  const {
    setCartMeta,
    addToCart,
    updateQuantity,
    cart,
    removeFromCart,
    clearCart,
  } = useItemCartHook();
  const { setAlertDialog, setConfirmationModal, closeConfirmation } =
    useModalHook();
  const navigate = useNavigate();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.estimated_budget,
    0
  );
  const { activityId, expenseId } = useParams();
  const [displayedProducts, setDisplayedProducts] = useState(
    products.slice(0, 8)
  );
  const [hasMore, setHasMore] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const activity = activityData.find(
    (item) => item.value === Number(activityId)
  );

  const activityInfo = activity
    ? {
        code: activity.label,
        description: activity.description,
      }
    : null;

  const handleCollapseClick = () => {
    setIsCollapsed((prev) => !prev);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenItemDialog = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const add = () => {
    addToCart(selectedItem, quantity);
    setIsDialogOpen(false);
  };

  const handleConfirmationModal = () => {
    const data = {
      status: "error",
      title: "Discard selection?",
      description:
        "Discarding will forfeit your current item selection fot the selected activity. You’ll need to re-select again later if you discard now.",
    };

    setConfirmationModal(data);
  };

  const handleCancel = () => {
    setIsLoading(true); // Show loader
    clearCart();

    setTimeout(() => {
      closeConfirmation(); // Close modal

      window.location.href = "/edit-ppmp"; // This reloads + navigates
    }, 1000);
  };
  const handleSave = () => {
    const { cart, clearCart } = useItemCartHook.getState();
    const { setTableData, tableData, setLoading } = usePPMPItemsHook.getState();

    setLoading(true);

    const existingIds = new Set(tableData.map((item) => item.id));
    const filteredCart = cart.filter((item) => !existingIds.has(item.id));

    const mergedTableData = [...tableData, ...filteredCart];
    setTableData(mergedTableData);

    clearCart();

    setTimeout(() => {
      // Stop loading indicator and navigate to "/edit-ppmp"
      setLoading(false);
      navigate("/edit-ppmp");
    }, 500);
  };

  const fetchMoreData = () => {
    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const more = products.slice(currentLength, currentLength + 8);
      if (more.length === 0) {
        setHasMore(false);
        return;
      }
      setDisplayedProducts((prev) => [...prev, ...more]);
    }, 1000); // simulate loading delay
  };

  useEffect(() => {
    setCartMeta({
      activity_id: activityId,
      expense_class_id: expenseId,
    });
    setTimeout(() => {
      getItems((status, message, data) => {
        if (status === 200) {
          console.log("Items fetched successfully:", data);
        } else {
          console.error("Error fetching items:", message);
        }
      });
    }, 1000); // simulate loading delay
  }, [getItems]);
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
                onClick={() => handleConfirmationModal()}
              />
              <ButtonComponent
                label={"Save items"}
                onClick={() => handleSave()}
              />
            </Stack>
          </>
        }
      >
        <Grid
          container
          spacing={2}
          sx={{
            // height: "100%",
            height: isCollapsed ? "54vh" : "62vh", // Sets a fixed height
            flexWrap: "nowrap", // Prevents wrapping of columns
            overflow: "hidden", // Hide extra scrollbars from container
          }}
        >
          {/* Left: Scrollable Item Cards */}
          <Grid xs>
            <BoxComponent sx={{ position: "sticky", top: 0 }}>
              <SearchBarComponent />
            </BoxComponent>
            <Box
              id="scrollableItemsBox"
              sx={{
                mt: 1,
                p: 2,
                border: 1,
                borderColor: "neutral.100",
                borderRadius: 10,
                height: "83%",
                overflow: "auto",
              }}
            >
              <InfiniteScroll
                dataLength={displayedProducts.length} // This is important field to render the next data
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <Typography sx={{ mt: 2, fontSize: 13, textAlign: "center" }}>
                    Loading more items....
                  </Typography>
                }
                scrollableTarget="scrollableItemsBox"
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    gap: 4,
                  }}
                >
                  {displayedProducts.map((item, index) => (
                    <ItemCardComponent
                      key={index}
                      item={item}
                      btnAction={() => addToCart(item)}
                      itemInfoAction={() => {
                        handleOpenItemDialog(item);
                      }}
                    />
                  ))}
                </Box>
              </InfiniteScroll>
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
              {cart?.length > 0 ? (
                [...cart]
                  .reverse()
                  .map((item) => (
                    <ItemsCart
                      key={item.id}
                      item={item}
                      onQuantityChange={updateQuantity}
                      onRemove={() => removeFromCart(item.id)}
                    />
                  ))
              ) : (
                <Stack
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <img
                    src={empty_cart}
                    alt="Not found"
                    style={{ width: 140 }}
                  />
                  <Typography
                    fontSize={14}
                    fontWeight={600}
                    sx={{ color: "gray" }}
                  >
                    Your cart is empty
                  </Typography>
                  <Typography
                    fontSize={13}
                    sx={{ color: "gray" }}
                    textAlign={"center"}
                  >
                    Looks like you haven't added any items yet.
                  </Typography>
                </Stack>
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
              <Typography
                textAlign={"right"}
                sx={{
                  color: "gray",
                }}
                fontSize={13}
                fontWeight={600}
              >
                Total cost:
              </Typography>
              <Typography fontSize={20} fontWeight="lg" textAlign={"right"}>
                &#8369; {totalPrice.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </ContainerComponent>
      <ConfirmationModalComponent
        leftButtonLabel="Back to selection"
        rightButtonLabel="Discard and proceed"
        rightButtonAction={() => handleCancel()}
        onClose={() => closeConfirmation()}
      />
      <ModalComponent
        handleClose={handleCloseItemDialog}
        hasActionButtons={false}
        isOpen={isDialogOpen}
        title={"Preview Item"}
        description={
          "Select a request status and reasons (if returned) to continue. You may add remarks if necessary."
        }
        maxWidth={"766px"}
        content={
          <Box overflow={"hidden"}>
            <Item
              addAction={() => add()}
              item={selectedItem}
              quantity={quantity}
              onDecrease={() => setQuantity(quantity - 1)}
              onIncrease={() => setQuantity(quantity + 1)}
            />
          </Box>
        }
      />
      <PageLoader isLoading={isLoading} />
    </Fragment>
  );
}

export default AddItems;
