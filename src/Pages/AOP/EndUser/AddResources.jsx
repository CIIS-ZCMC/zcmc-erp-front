import ButtonComponent from "@Components/Common/ButtonComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import PageTitle from "@Components/Common/PageTitle";
import useItemsHook from "../../../Hooks/ItemsHook";
import { Divider, Grid, Skeleton, Stack, Typography, useTheme } from "@mui/joy";
import { X } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import ContainerComponent from "@Components/Common/ContainerComponent";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import ItemCardComponent from "@Components/Resources/ItemCardComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import AddToCartLayout from "@Components/Resources/AddToCartLayout";
import useResourcesHook from "../../../Hooks/AOP/ResourcesHook";
import useCartStore from "../../../Hooks/ItemCartHook";
import useModalHook from "../../../Hooks/ModalHook";
import { useAuth } from "../../../Store/AuthStore";
import useSearchHook from "../../../Hooks/SearchHook";

export default function AddResources() {
  const { user } = useAuth();

  const theme = useTheme();
  const color = theme.palette;
  const navigate = useNavigate();
  const location = useLocation();
  const { activityId } = location.state;

  const { items, getItems, getSearchResults } = useItemsHook();
  const { postAOPResources } = useResourcesHook();
  const { getSearchSuggestions, suggestions } = useSearchHook();
  const cartStore = useCartStore(user?.id || "guest");
  const { cart, clearCart } = cartStore();
  const {
    setAlertDialog,
    setConfirmationModal,
    closeConfirmation,
    closeAlertDialog,
  } = useModalHook();

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  const [displayLoading, setDisplayLoading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const handleOpenItemDialog = (item) => {
    console.log(item);
    setSelectedItem(item);
    setOpenPreview(true);
  };
  const handleCloseItemDialog = () => {
    setOpenPreview(false);
    setSelectedItem(null);
  };

  const handleSaveItems = async () => {
    const formData = new FormData();

    formData.append("activity_id", activityId);

    cart.forEach((item, index) => {
      formData.append(`items[${index}][item_id]`, item.id);
      formData.append(`items[${index}][quantity]`, item.qty);
    });

    await postAOPResources(formData, (status, message) => {
      if (status === 201) {
        setAlertDialog({
          status: "success",
          title: `${message}`,
          description: "",
        });
        clearCart();
        navigate(`/manage-resources/${activityId}`, {
          state: { activityId: activityId },
        });
        return;
      } else {
        setAlertDialog({
          status: "error",
          title: `${message}`,
          description: "",
        });
        return;
      }
    });
  };

  useEffect(() => {
    setDisplayLoading(true);

    getItems((status, message, data) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
      setDisplayLoading(false);
    });
  }, []);
  return (
    <Fragment>
      <PageTitle
        title={`AOP for Fiscal Year ${currentFiscalYear}`}
        description="The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
        items={[
          { label: "Objectives", path: "/objectives" },
          { label: "Activities", path: "/activities" },
          {
            label: "Resources",
            path: `/manage-resources/${activityId}`,
            state: { activityId },
          },
          {
            label: "Select Resources",
            path: `/select-resources/${activityId}`,
            state: { activityId },
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
                  navigate(`/manage-resources/${activityId}`, {
                    state: { activityId: activityId },
                  });
                }}
              />
              <ButtonComponent
                label={"Save items"}
                onClick={() => handleSaveItems()}
              />
              <IconButtonComponent
                icon={<X />}
                size={"sm"}
                onClick={() =>
                  navigate(`/manage-resources/${activityId}`, {
                    state: { activityId: activityId },
                  })
                }
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
          />
        </ContainerComponent>
      </Stack>
    </Fragment>
  );
}
