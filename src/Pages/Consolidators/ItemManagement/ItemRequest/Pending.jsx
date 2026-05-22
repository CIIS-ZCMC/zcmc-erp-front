import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import { ITEMS_REQUESTS } from "../../../../Data/Columns";
import React, { useEffect, useState } from "react";
import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { ExtensionOutlined } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { useLocation } from "react-router-dom";

import ItemRequestModal from "./ItemRequestModal";
import {
  useItemRequestActions,
  useItemRequestLoading,
  useItemRequests,
} from "@Hooks/ItemRequest/ItemRequestHook";
import ItemDetailsRow from "@Pages/ItemRequests/ItemDetailsRow";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";

export default function Pending() {
  const location = useLocation();
  const pathName = location.pathname;

  const requests = useItemRequests();
  const isLoading = useItemRequestLoading();
  const { getItemRequests } = useItemRequestActions();

  const [openApprove, setOpenApprove] = useState(false);
  const [status, setStatus] = useState();
  const [row, setRow] = useState({});
  const [isDecline, setIsDecline] = useState(false);
  const [search, setSearch] = useState("");

  // const data = requests?.data || []
  const { data, current_page, next_page_url, per_page, prev_page_url, total } =
    requests || {};

  const handleOpen = (status, row) => {
    setStatus(status);
    setRow(row);
    setOpenApprove(true);
  };

  const handleClose = () => {
    setOpenApprove(false);
  };

  useEffect(() => {
    const params = { status_id: 3, search };
    getItemRequests(params, (status, message) => {
      // console.log(params)
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  }, [search]);

  useEffect(() => {
    console.log("request data", requests);
    console.log("row", data);
  }, [requests]);

  return (
    <div>
      <Stack direction={"row"} my={2}>
        <SearchBarComponentv2 value={search} setValue={setSearch} />
      </Stack>
      <ExpandableTable
        columns={ITEMS_REQUESTS(handleOpen, pathName, true)}
        rows={data}
        isLoading={isLoading}
        currentPage={current_page}
        totalPages={total}
        totalRows={per_page}
        onNextPage={next_page_url}
        onPrevPage={prev_page_url}
        renderExpanded={(row) => <ItemDetailsRow row={row} />}
      />

      <ItemRequestModal
        open={openApprove}
        handleClose={() => setOpenApprove(false)}
        status={status}
        row={row}
      />
    </div>
  );
}
