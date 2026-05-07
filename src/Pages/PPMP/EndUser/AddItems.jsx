import { Box, Divider, Stack, Typography, useTheme } from "@mui/joy";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import IconButtonComponent from "../../../Components/Common/IconButtonComponent";
import { X } from "lucide-react";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import useItemsHook from "../../../Hooks/ItemManagementHook";
import useModalHook from "../../../Hooks/ModalHook";
import PageTitle from "@Components/Common/PageTitle";
import AddToCartLayout from "@Components/Resources/AddToCartLayout";
import useCartStore from "../../../Hooks/ItemCartHook";
import { useAuth } from "../../../Store/AuthStore";
import useSearchHook from "../../../Hooks/SearchHook";
import { usePPMPActions, usePPMPState } from "../../../Hooks/PPMP/PPMPHook";
import AlertDialogComponent from "@Components/Common/Dialog/AlertDialogComponent";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import AddItemRequest from "./AddItemRequest";

function AddItems(props) {
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();

  const theme = useTheme();
  const color = theme.palette;
  const { activity } = location.state || {};
  const isPPMP = true;

  const { activities } = usePPMPState();
  const { getActivities, postItems } = usePPMPActions();
  const { getItems } = useItemsHook();
  const { setAlertDialog, closeAlertDialog } = useModalHook();
  const { showSnack } = useSnackbarHook();

  const cartStore = useCartStore(user?.id || "guest", isPPMP);
  const { cart, addActivityToItem, removeActivityFromItem, clearCart } =
    cartStore();
  const [displayLoading, setDisplayLoading] = useState(false);
  const [openReq, setOpenReq] = useState(false); // modal visibility state

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

    await postItems(formData, (status, message) => {
      if (status === 201) {
        showSnack(200, message);
        // setAlertDialog({
        //   status: "success",
        //   title: "New resource item successfully added.",
        //   description: message,
        // });
        clearCart();
        navigate(`/ppmp/manage-items/${type}`);
      } else {
        setAlertDialog({
          status: "error",
          title: "Failed to save.",
          description: message,
        });
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDisplayLoading(true);

        const itemsResult = await getItems({
          mode: "selection",
          ...(isPPMP && { type: "ppmp_item" }),
        });
        if (itemsResult.status !== 200) {
          console.error("Failed to fetch items:", itemsResult.message);
          return;
        }

        const activitiesResult = await getActivities();
        if (activitiesResult.status !== 200) {
          console.error(
            "Failed to fetch activities:",
            activitiesResult.message,
          );
          return;
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setDisplayLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Fragment>
      <PageTitle
        title={`PPMP for Fiscal Year ${currentFiscalYear}`}
        description={
          "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        }
        items={[
          {
            label: "PPMP",
            path: () => navigate(`/ppmp/manage-items/${type}`),
          },
          {
            label: "Add New Items",
            current: true,
          },
        ]}
      />
      <br />
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
              label="Request New Item"
              variant={"outlined"}
              onClick={() => setOpenReq(true)} // open modal
            />
            <ButtonComponent
              label="Cancel Selection"
              variant={"outlined"}
              onClick={() => {
                clearCart();
                navigate(`/ppmp/manage-items/${type}`);
              }}
            />
            <ButtonComponent
              label={"Save items"}
              onClick={() => handleSaveItems()}
            />
            <IconButtonComponent
              icon={<X />}
              size={"sm"}
              onClick={() => navigate(`/ppmp/manage-items/${type}`)}
            />
          </Stack>
        </Stack>
        <Divider sx={{ my: 2, bgcolor: color.primary.fontLight }} />
        <AddToCartLayout
          isPPMP={isPPMP}
          options={activities}
          removeActivityFromItem={removeActivityFromItem}
          addActivityToItem={addActivityToItem}
        />
      </ContainerComponent>

      {/* Render modal */}
      {openReq && (
        <AddItemRequest
          openReq={openReq}
          setOpenReq={setOpenReq}
          activities={activities}
        />
      )}
      <AlertDialogComponent noRightButton />
    </Fragment>
  );
}

export default AddItems;
