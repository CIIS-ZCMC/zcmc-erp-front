import { Fragment, useEffect, useState } from "react";

import { Box, Stack, Grid } from "@mui/joy";
import { useNavigate, useLocation } from "react-router-dom";

import ButtonComponent from "../../Components/Common/ButtonComponent";
import ContainerComponent from "../../Components/Common/ContainerComponent";
import ModalComponent from "../../Components/Common/Dialog/ModalComponent";

//layouts
import ItemSummaryHeader from "../../Layout/Resources/ItemSummaryHeader";
import ItemList from "../../Layout/Resources/ItemList";
import ItemCart from "../../Layout/Resources/ItemCart";
import ItemModalContent from "../../Layout/Resources/ItemModalContent";

import useItemsHook from "../../Hooks/ItemsHook";
import useResourceHook from "../../Hooks/ResourceHook";

import { AOP_CONSTANTS } from "../../Data/constants";

const cartStyles = {
  width: 350,
  height: "59vh",
  position: "sticky",
  border: 1,
  borderColor: "neutral.100",
  borderRadius: 10,
  bgcolor: "white",
  display: "flex",
  flexDirection: "column",
};

const Items = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { items, getItems } = useItemsHook();
  const {
    cart,
    addResourceToCart,
    removeFromCart,
    updateQuantity,
    saveItems,
    cancelResources,
  } = useResourceHook();

  const { setTotalCost } = useResourceHook();

  const [displayedItems, setDisplayedItems] = useState([]);

  const rowNumber = location.state?.activityRowId;
  const objectiveRowId = location.state.objectiveRowId;
  const cost = location.state?.cost;
  const activityId = location.state?.parentId;

  // const objectiveId = location.state.objectiveId;

  // useEffect(() => {
  //     console.log(location.state)
  // }, [])

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemTotal, setItemTotal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false)

  const filteredCart =
    cart?.filter((item) => item.parentId === activityId) || [];

  const totalQty = filteredCart.reduce(
    (sum, item) => sum + item.aop_quantity,
    0
  );

  const totalPrice = filteredCart.reduce(
    (sum, item) => sum + item.aop_quantity * item.estimated_budget,
    0
  );

  useEffect(() => {
    setTotalCost(totalPrice)
  }, [totalPrice])

  useEffect(() => {
    setIsLoading(true)
    getItems((status, message, data) => {
      setIsLoading(false)
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  }, []);

  // useEffect(() => {
  //   if (items.length) {
  //     setDisplayedItems(items);
  //   }
  // }, [items]);

  // useEffect(() => {
  //   console.log(items)
  // }, [items])

  const handleOpenItemDialog = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseItemDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
    setQuantity(1);
  };

  const handleCollapseClick = () => {
    setIsCollapsed((prev) => !prev);
  };

  const add = () => {
    addResourceToCart(selectedItem, activityId, quantity);
    handleCloseItemDialog();
  };

  const handleSaveResources = () => {
    saveItems(activityId, totalPrice, itemTotal);

    //make a condition here if id of aop is exisitng change the route to /aop-edit/id/activities/id/resources/rowNumber
    navigate(
      `/aop-create/activities/${objectiveRowId}/resources/${rowNumber}`,
      {
        state: {
          parentId: activityId,
          objectiveRowId: objectiveRowId,

        },
      }
    ); //navigate with activity row id
  };

  const handleOnCancel = () => {
    // removeFromCart(activityId);
    cancelResources();
    navigate(`/aop-create/activities/${objectiveRowId}`);
  };

  return (
    <Fragment>
      <ItemSummaryHeader
        isCollapsed={isCollapsed}
        rowNumber={rowNumber}
        cost={cost}
        handleCollapseClick={handleCollapseClick}
      />

      <ContainerComponent
        title={`${AOP_CONSTANTS.TABLE_ITEMS_HEADER}`}
        description={`${AOP_CONSTANTS.TABLE_ITEMS_SUBHEADER}`}
        sx={{ mt: 2, height: "67vh" }}
        actions={
          <Fragment>
            <Stack direction={"row"} gap={1}>
              <ButtonComponent
                onClick={() => handleOnCancel()}
                label={"Cancel Selection"}
                size={"md"}
                variant={"outlined"}
              />

              <ButtonComponent
                label={"Save items"}
                size={"md"}
                variant={"solid"}
                disabled={cart.length === 0}
                onClick={() => handleSaveResources()}
              />
            </Stack>
          </Fragment>
        }
      >
        <Grid
          container
          columns={{ xs: 12, sm: 12, md: 12 }}
          sx={{
            flexGrow: 1,
            width: "auto",
            p: 1,
          }}
          gap={3}
        >
          {/* Left: Scrollable Item Cards */}
          <Grid item={"true"} xs={12} sm={2} md={8.1}>
            <ItemList
              isLoading={isLoading}
              quantity={quantity}
              activityId={activityId}
              displayedItems={displayedItems}
              setDisplayedItems={setDisplayedItems}
              handleOpenItemDialog={handleOpenItemDialog}
            />
          </Grid>

          {/* Right: Cart */}
          <Grid item={"true"} xs={12} sm={4} md={3.7} sx={{ ...cartStyles }}>
            <ItemCart
              isLoading={isLoading}
              totalQty={totalQty}
              totalPrice={totalPrice}
              filteredCart={filteredCart}
              onRemove={removeFromCart}
              onQuantityChange={updateQuantity}
            />
          </Grid>
        </Grid>
      </ContainerComponent>

      {/* Item Modal layout */}
      <ModalComponent
        handleClose={handleCloseItemDialog}
        hasActionButtons={false}
        isOpen={isDialogOpen}
        title={"Preview Item"}
        description={
          "Select a request status and reasons (if returned) to continue. You may add remarks if necessary."
        }
        content={
          <Box overflow={"hidden"}>
            <ItemModalContent
              addAction={() => add()}
              item={selectedItem}
              quantity={quantity}
              onDecrease={() => setQuantity((state) => state - 1)}
              onIncrease={() => setQuantity((state) => state + 1)}
            />
          </Box>
        }
      />
    </Fragment>
  );
};

export default Items;
