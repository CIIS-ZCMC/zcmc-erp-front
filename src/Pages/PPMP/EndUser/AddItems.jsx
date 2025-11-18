import {
  Box,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import IconButtonComponent from "../../../Components/Common/IconButtonComponent";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import BoxComponent from "../../../Components/Common/Card/BoxComponent";
import ItemCardComponent from "../../../Components/Resources/ItemCardComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { MdOpenInNew } from "react-icons/md";
import ItemsCart from "../../../Components/Resources/ItemsCart";
import SearchBarComponent from "../../../Components/SearchBarComponent";
import empty_cart from "../../../assets/empty-cart.png";
import useItemsHook from "../../../Hooks/ItemsHook";
import useItemCartHook from "../../../Hooks/ItemCartPPMPHook";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import PageLoader from "../../../Components/Loading/PageLoader";
import Item from "../../Items/Item";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import PageTitle from "@Components/Common/PageTitle";
import AddToCartLayout from "@Components/Resources/AddToCartLayout";
import useCartStore from "../../../Hooks/ItemCartHook";
import { useAuth } from "../../../Store/AuthStore";
import useSearchHook from "../../../Hooks/SearchHook";
import usePPMPHook from "../../../Hooks/PPMP/PPMPHook";

function AddItems(props) {
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const color = theme.palette;
  const { activity } = location.state || {};

  const { activities, getActivities } = usePPMPHook();
  const { items, getItems, getSearchResults } = useItemsHook();
  const { getSearchSuggestions, suggestions } = useSearchHook();
  const cartStore = useCartStore(user?.id || "guest", true);
  const { cart, addActivityToItem, removeActivityFromItem, clearCart } =
    cartStore();
  const [displayLoading, setDisplayLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

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
            path: () => navigate(`/ppmp/ppmp-items`),
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
                  navigate(`/ppmp/ppmp-items`);
                }}
              />
              <ButtonComponent
                label={"Save items"}
                onClick={() => handleSaveItems()}
              />
              <IconButtonComponent
                icon={<X />}
                size={"sm"}
                onClick={() => navigate(`/ppmp/ppmp-items`)}
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
            isPPMP={true}
            options={activities}
            removeActivityFromItem={removeActivityFromItem}
            addActivityToItem={addActivityToItem}
          />
        </ContainerComponent>
      </Stack>
    </Fragment>
  );
}

export default AddItems;
