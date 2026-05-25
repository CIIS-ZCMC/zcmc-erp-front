import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import { ITEMS_REQUESTS } from "@Data/Columns";
import {
  useItemRequestActions,
  useItemRequestLoading,
  useItemRequests,
} from "@Hooks/ItemRequest/ItemRequestHook";
import { Stack } from "@mui/joy";
import ItemDetailsRow from "@Pages/ItemRequests/ItemDetailsRow";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Declined() {
  const location = useLocation();
  const pathName = location.pathname;

  const requests = useItemRequests();
  const isLoading = useItemRequestLoading();
  const { getItemRequests } = useItemRequestActions();

  const [openApprove, setOpenApprove] = useState(false);
  const [status, setStatus] = useState();
  const [row, setRow] = useState({});
  const [search, setSearch] = useState("");

  const { data, current_page, next_page_url, per_page, prev_page_url, total } =
    requests || {};

  const handleOpen = (status, row) => {
    setStatus(status);
    setRow(row);
    setOpenApprove(true);
  };

  useEffect(() => {
    const params = { status_id: 5, search };
    getItemRequests(params, (status, message) => {
      // console.log(params)
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  }, [search]);

  return (
    <Fragment>
      <Stack direction={"row"} my={2}>
        <SearchBarComponentv2 value={search} setValue={setSearch} />
      </Stack>
      <ExpandableTable
        columns={ITEMS_REQUESTS(handleOpen, pathName, false)}
        rows={data}
        isLoading={isLoading}
        currentPage={current_page}
        totalPages={total}
        totalRows={per_page}
        onNextPage={next_page_url}
        onPrevPage={prev_page_url}
        renderExpanded={(row) => <ItemDetailsRow row={row} />}
      />
    </Fragment>
  );
}
