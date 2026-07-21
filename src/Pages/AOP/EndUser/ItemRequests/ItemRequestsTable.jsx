import React, { useEffect, useState, Fragment } from "react";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import AuthorizationPinComponent from "@Components/AuthorizationPinComponent";
import ItemDetailsRow from "@Pages/Consolidators/ItemManagement/ItemRequest/ItemDetailsRow";
import { Stack } from "@mui/joy";
import {
  useItemRequestActions,
  useItemRequestLoading,
  useItemRequestsByUser,
} from "@Hooks/ItemRequest/ItemRequestHook";
import { itemRequestCols } from "@Data/Columns";
import useSnackbarHook from "@Hooks/SnackbarHook";

/**
 * Shared table component for all item-request tabs.
 * @param {string} status  – "all" | "pending" | "approved" | "declined"
 * @param {boolean} showActions – whether to render the cancel action column
 */
export default function ItemRequestsTable({ status, showActions = false }) {
  const { getItemRequestByUser, cancelItemRequest } = useItemRequestActions();
  const requestsByUser = useItemRequestsByUser();
  const isLoading = useItemRequestLoading();
  const { showSnack } = useSnackbarHook();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedData, setSelectedData] = useState(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [authorizationPin, setAuthorizationPin] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  // Reset page when filter/search changes
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    getItemRequestByUser(
      { status, search: search || undefined, page },
      (res, message) => {
        if (res !== 200) console.error("Failed to fetch item requests:", message);
      },
    );
  }, [status, search, page]);

  const handleCancelRequest = (item_request_id, pin, reason) => {
    cancelItemRequest(
      item_request_id,
      { authorization_pin: pin, reason },
      (res, message) => {
        if (res !== 200) {
          console.error("Failed to cancel item request:", message);
        } else {
          setCancelReason("");
          setAuthorizationPin("");
          setOpenCancel(false);
          showSnack(res, message);
        }
      },
    );
  };

  return (
    <Fragment>
      <Stack direction={"row"} justifyContent={"flex-start"} mb={1}>
        <SearchBarComponentv2
          value={search}
          setValue={handleSearchChange}
          placeholder="Search requests..."
        />
      </Stack>

      <ExpandableTable
        rows={requestsByUser?.data}
        columns={itemRequestCols(setSelectedData, setOpenCancel, showActions)}
        renderExpanded={(row) => <ItemDetailsRow row={row} />}
        isLoading={isLoading}
        currentPage={requestsByUser?.current_page}
        totalPages={requestsByUser?.last_page}
        totalRows={requestsByUser?.total}
        onNextPage={() => {
          if (page < requestsByUser?.last_page) setPage((p) => p + 1);
        }}
        onPrevPage={() => {
          if (page > 1) setPage((p) => p - 1);
        }}
        stickyFooter
      />

      {openCancel && (
        <ModalComponent
          isOpen={openCancel}
          handleClose={() => setOpenCancel(false)}
          maxWidth={"500px"}
          minWidth={"500px"}
          title={"Cancel Item Request"}
          description={
            "Please provide a reason for cancellation and enter your authorization pin to proceed."
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
            handleCancelRequest(selectedData?.id, authorizationPin, cancelReason)
          }
        />
      )}
    </Fragment>
  );
}
