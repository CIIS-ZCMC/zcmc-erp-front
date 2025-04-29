import { Box, Grid, Stack, Typography } from "@mui/joy";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
const ITEMS_PER_BATCH = 12;

function AddItems(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activityObject } = location.state || {};
  const { expenseId } = useParams();

  const { items, getItems } = useItemsHook();
  const { setTableData, tableData, setLoading } = usePPMPItemsHook();
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

  const loadMoreRef = useRef(null);

  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const totalQty = cart.reduce((sum, item) => sum + item.aop_quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.aop_quantity * item.estimated_budget,
    0
  );
  const handleCollapseClick = () => {
    setIsCollapsed((prev) => !prev);
  };

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
    handleCloseItemDialog();
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
    setIsLoading(true);
    setCartMeta({ activity_id: null, expense_class_id: null });
    clearCart();

    setTimeout(() => {
      closeConfirmation();
      window.location.href = "/edit-ppmp";
    }, 1000);
  };

  const handleSave = () => {
    setLoading(true);

    const lastItemId =
      tableData.length > 0 ? tableData[tableData.length - 1].id : 0;

    // Only add IDs for new cart items
    const mergedCart = [...tableData, ...cart].reduce((map, item, index) => {
      const existing = map.get(item.item_code); // Use item_code!

      if (existing) {
        // If the item already exists (same item_code), combine quantities and activities
        const combinedActivities = [
          ...existing.activities,
          ...(Array.isArray(item.activities)
            ? item.activities
            : [item.activities]),
        ];

        map.set(item.item_code, {
          ...existing,
          aop_quantity: existing.aop_quantity + (item.aop_quantity || 0),
          activities: combinedActivities,
        });
      } else {
        // New item, assign new id if from cart (optional logic)
        const isFromCart = cart.some(
          (cartItem) => cartItem.item_code === item.item_code
        );
        const newId = isFromCart ? lastItemId + map.size + 1 : item.id;

        map.set(item.item_code, {
          ...item,
          id: newId,
          activities: Array.isArray(item.activities)
            ? item.activities
            : [item.activities],
        });
      }

      return map;
    }, new Map());

    setTableData(Array.from(mergedCart.values()));

    setCartMeta({ selectedActivity: null, expense_class_id: null });
    clearCart();

    setTimeout(() => {
      setLoading(false);
      navigate("/edit-ppmp");
    }, 500);
  };

  const fetchMoreItems = useCallback(() => {
    if (!items.length) return;

    setDisplayedItems((prev) => {
      const nextItems = items.slice(prev.length, prev.length + ITEMS_PER_BATCH);
      if (nextItems.length === 0) {
        setHasMore(false);
      }
      return [...prev, ...nextItems];
    });
  }, [items]);

  // Observe loadMoreRef
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreItems();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.disconnect();
      }
    };
  }, [fetchMoreItems, hasMore]);

  useEffect(() => {
    setCartMeta({
      selectedActivity: activityObject,
      expense_class_id: expenseId,
    });

    getItems((status, message, data) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  }, []);

  useEffect(() => {
    if (items.length) {
      setDisplayedItems(items.slice(0, ITEMS_PER_BATCH));
    }
  }, [items]);

  return (
    <Fragment>
      <ContainerComponent
        title={`You are managing resources for Activity: ${activityObject?.activity_code}`}
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
                      {activityObject?.activity_code}
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
                    Expense Class:
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
        sx={{ mt: 2, height: "67vh" }}
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
          columns={{ xs: 12, sm: 12, md: 12 }}
          sx={{
            flexGrow: 1,
            width: "auto",
            p: 1,
          }}
          gap={3}
        >
          {/* Left: Scrollable Item Cards */}
          <Grid
            item
            xs={12} // Full width on extra small screens
            sm={2} // 2 items on small screens
            md={8.1}
          >
            <BoxComponent sx={{ position: "sticky", top: 0 }}>
              <SearchBarComponent />
            </BoxComponent>
            <Grid
              container
              columns={{ xs: 12, sm: 6, md: 12 }}
              gap={4}
              sx={{
                flexGrow: 1,
                mt: 2,
                p: 1,
                border: 1,
                borderColor: "neutral.100",
                borderRadius: 10,
                height: "50vh",
                overflowY: "auto",
              }}
            >
              {displayedItems.map((item, index) => (
                <Grid
                  key={index}
                  item="true"
                  xs={12}
                  sm={2}
                  md={6}
                  lg={4}
                  xl={3.6}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <ItemCardComponent
                    key={index}
                    item={item}
                    btnAction={() => addToCart(item)}
                    itemInfoAction={() => {
                      handleOpenItemDialog(item);
                    }}
                  />
                </Grid>
              ))}
              <div ref={loadMoreRef}>Loading more items...</div>
            </Grid>
          </Grid>

          {/* Right: Cart */}
          <Grid
            item
            xs={12} // Full width on mobile
            sm={4} // 4/12 on small screens
            md={3.7}
            // xs={4}
            sx={{
              width: 350,
              height: "59vh",
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
                      key={item.item_id}
                      item={item}
                      id={item.item_id}
                      onQuantityChange={updateQuantity}
                      onRemove={() => removeFromCart(item.item_id)}
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
