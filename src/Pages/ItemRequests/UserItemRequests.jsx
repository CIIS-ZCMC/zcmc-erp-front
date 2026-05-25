import BoxComponent from "@Components/Common/Card/BoxComponent";
import PageTitle from "@Components/Common/PageTitle";
import TabComponent from "@Components/Common/TabComponent";
import { userItmRequestTabs } from "../../Data/Options";
import { Stack, Typography } from "@mui/joy";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useItemRequestsHook, {
  useItemRequestActions,
  useItemRequestLoading,
  useItemRequestsByUser,
} from "@Hooks/ItemRequest/ItemRequestHook";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import { itemRequestCols } from "@Data/Columns";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import ButtonComponent from "@Components/Common/ButtonComponent";
import {
  Add,
  InsertLinkOutlined,
  ListOutlined,
  PersonOutline,
} from "@mui/icons-material";
import NewRequestModal from "@Pages/PPMP/EndUser/Modal/AddItemRequest/NewRequestModal";
import ItemDetailsRow from "./ItemDetailsRow";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import InputComponent from "@Components/Form/InputComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import useSnackbarHook from "@Hooks/SnackbarHook";

export default function UserItemRequests() {
  const location = useLocation();
  const navigate = useNavigate();

  const { getItemRequestByUser, cancelItemRequest } = useItemRequestActions();
  const requestsByUser = useItemRequestsByUser();
  const { showSnack } = useSnackbarHook();
  const isLoading = useItemRequestLoading();

  const [selectedData, setSelectedData] = React.useState(null);
  const [search, setSearch] = useState("");
  const [openRequest, setOpenRequest] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [authorizationPin, setAuthorizationPin] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [page, setPage] = useState(1);

  const index = useMemo(() => {
    const path = location.pathname;

    const found = userItmRequestTabs.find((tab) =>
      tab.path === ""
        ? path.endsWith("/new-item-requests")
        : path.includes(tab.path),
    );

    return found?.value ?? userItmRequestTabs[0].value;
  }, [location.pathname]);

  /** --------------------------------
   *  Handle tab navigation
   * -------------------------------- */
  const handleTabChange = (newValue) => {
    const selectedTab = userItmRequestTabs.find(
      (tab) => tab.value === newValue,
    );
    if (selectedTab) navigate(selectedTab.path);
  };

  const handleCancelRequest = (item_request_id, pin, reason) => {
    cancelItemRequest(
      item_request_id,
      { authorization_pin: pin, reason: reason },
      (status, message) => {
        if (status !== 200) {
          console.error("Failed to cancel item request:", message);
        } else {
          setCancelReason("");
          setAuthorizationPin("");
          setOpenCancel(false);
          showSnack(status, message);
        }
      },
    );
  };

  useEffect(() => {
    getItemRequestByUser(
      { status: index, search: search || undefined },
      (status, message) => {
        if (status !== 200) {
          console.error("Failed to fetch item requests:", message);
        }
      },
    );
  }, [index, search]);
  return (
    <Fragment>
      <PageTitle title={"My Item Requests"} />
      <BoxComponent
        bgColor={"#F9FAFB"}
        my={2}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
      >
        <Stack>
          <Typography level="body-md" sx={{ fontWeight: 600 }}>
            My Item Requests{" "}
          </Typography>
          <Typography level="body-xs">
            Track the approval status of new items you have requested from
            Dispensing Units.
          </Typography>
        </Stack>
      </BoxComponent>

      <Stack spacing={2}>
        <TabComponent
          tabs={userItmRequestTabs}
          index={index}
          handleTabChange={handleTabChange}
        />
        <Stack direction={"row"} justifyContent={"space-between"} py={1}>
          <SearchBarComponentv2 setValue={setSearch} value={search} />
          <ButtonComponent
            label={"Request New Item"}
            startDecorator={<Add />}
            onClick={() => setOpenRequest(true)}
          />
        </Stack>
        <ExpandableTable
          rows={requestsByUser.data}
          columns={itemRequestCols(
            setSelectedData,
            setOpenCancel,
            !["all", "approved", "declined"].includes(index),
          )}
          renderExpanded={(row) => <ItemDetailsRow row={row} />}
          currentPage={requestsByUser?.current_page}
          totalPages={requestsByUser?.last_page}
          totalRows={requestsByUser?.total}
          onNextPage={() => {
            if (page < requestsByUser?.last_page) setPage(page + 1);
          }}
          onPrevPage={() => {
            if (page > 1) setPage(page - 1);
          }}
          stickyFooter
        />
      </Stack>

      {openRequest && (
        <NewRequestModal
          openNewRequest={openRequest}
          setOpenNewRequest={setOpenRequest}
        />
      )}

      {openCancel && (
        <ModalComponent
          isOpen={openCancel}
          handleClose={() => setOpenCancel(false)}
          maxWidth={"500px"}
          minWidth={"500px"}
          title={"Cancel Item Request"}
          description={
            "Please provide a reason for cancellation and enter your authorization pin to proceed with the cancellation. "
          }
          content={
            <Fragment>
              <Stack spacing={2}>
                <TextareaComponent
                  label="Reason for Cancellation"
                  placeholder={"Reason.."}
                  setValue={setCancelReason}
                  value={cancelReason}
                />
                <AuthorizationPinComponent setPin={setAuthorizationPin} />
              </Stack>
            </Fragment>
          }
          hasActionButtons
          isLoading={isLoading}
          rightButtonAction={() =>
            handleCancelRequest(selectedData.id, authorizationPin, cancelReason)
          }
        />
      )}
    </Fragment>
  );
}
