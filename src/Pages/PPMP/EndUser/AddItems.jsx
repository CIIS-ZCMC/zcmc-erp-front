import { Box, Divider, Stack, Typography, useTheme } from "@mui/joy";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import IconButtonComponent from "../../../Components/Common/IconButtonComponent";
import { X } from "lucide-react";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import useItemsHook from "../../../Hooks/ItemsHook";
import useModalHook from "../../../Hooks/ModalHook";
import PageTitle from "@Components/Common/PageTitle";
import AddToCartLayout from "@Components/Resources/AddToCartLayout";
import useCartStore from "../../../Hooks/ItemCartHook";
import { useAuth } from "../../../Store/AuthStore";
import useSearchHook from "../../../Hooks/SearchHook";
import usePPMPHook from "../../../Hooks/PPMP/PPMPHook";
import AlertDialogComponent from "@Components/Common/Dialog/AlertDialogComponent";

function AddItems(props) {
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const color = theme.palette;
  const { activity } = location.state || {};
  const isPPMP = true;

  const { activities, getActivities, postPPMP } = usePPMPHook();
  const { items, getItems, getSearchResults } = useItemsHook();
  const { getSearchSuggestions, suggestions } = useSearchHook();
  const { setAlertDialog, setConfirmationModal, closeAlertDialog } =
    useModalHook();

  const cartStore = useCartStore(user?.id || "guest", isPPMP);
  const { cart, addActivityToItem, removeActivityFromItem, clearCart } =
    cartStore();
  const [displayLoading, setDisplayLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const handleSaveItems = async () => {
    if (!cart || cart.length === 0) {
      setAlertDialog({
        status: "danger",
        title: "You have no items in your cart.",
        isGlobal: false,
        description: "There is nothing to save. Add items first.",
      });
      return; // stop execution
    }

    let hasError = false;
    cart.forEach((item, index) => {
      if (!item.activities || item.activities.length === 0) {
        console.error(`Item at index ${index} is missing activities!`);
        hasError = true;
      }
    });

    if (hasError) {
      setAlertDialog({
        status: "danger",
        title: "Some items are missing activities.",
        description: "Please add at least one activity to each PPMP item.",
      });
      return; // stop submission
    }

    const formData = new FormData();
    cart.forEach((item, index) => {
      formData.append(`items[${index}][item_id]`, item.id);
      formData.append(`items[${index}][quantity]`, item.qty);
      item.activities?.forEach((act) => {
        formData.append(`items[${index}][activity_id][]`, act.id);
      });
    });

    await postPPMP(formData, (status, message) => {
      if (status === 201) {
        setAlertDialog({
          status: "success",
          title: message,
          description: "",
        });
        clearCart();
        navigate(`/ppmp/manage-items`);
      } else {
        setAlertDialog({
          status: "error",
          title: message,
          description: "",
        });
      }
    });
  };

  useEffect(() => {
    setDisplayLoading(true);

    getItems((status, message, data) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
      getActivities((status, message) => {
        if (status !== 200) {
          console.error("Failed to fetch items:", message);
        }
      });
      setDisplayLoading(false);
    });
  }, []);

  return (
    <Fragment>
      <PageTitle
        title={`AOP for Fiscal Year ${currentFiscalYear}`}
        description={
          "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
        items={[
          {
            label: "PPMP",
            path: () => navigate(`/ppmp/manage-items`),
          },
          {
            label: "Add New Items",
            current: true,
          },
        ]}
      />
      <Stack mt={2}>
        <ContainerComponent>
          <Stack direction={"row"} justifyContent="space-between">
            <Stack>
              <Typography level="body-md" fontWeight={600}>
                Select resources (items) to add
              </Typography>
              <Typography level="body-sm">
                All resources you'll select here only applies to this selected
                activity
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <ButtonComponent
                label="Cancel Selection"
                variant={"outlined"}
                onClick={() => {
                  clearCart();
                  navigate(`/ppmp/manage-items`);
                }}
              />
              <ButtonComponent
                label={"Save items"}
                onClick={() => handleSaveItems()}
              />
              <IconButtonComponent
                icon={<X />}
                size={"sm"}
                onClick={() => navigate(`/ppmp/manage-items`)}
              />
            </Stack>
          </Stack>
          <Divider sx={{ my: 2, bgcolor: color.primary.fontLight }} />
          <AddToCartLayout
            getSearchResults={getSearchResults}
            getSearchSuggestions={getSearchSuggestions}
            getItems={getItems}
            suggestions={suggestions}
            loading={displayLoading}
            items={items}
            isPPMP={isPPMP}
            options={activities}
            removeActivityFromItem={removeActivityFromItem}
            addActivityToItem={addActivityToItem}
          />
        </ContainerComponent>
      </Stack>
      <AlertDialogComponent noRightButton />
    </Fragment>
  );
}

export default AddItems;
