import React, { useEffect, useState } from "react";

import { Typography, Box, Sheet } from "@mui/joy";
import { ExtensionOutlined } from "@mui/icons-material";

import useItemRequestHook from "../../../../../Hooks/ItemRequest/ItemRequestHook";
import useItemRequestStore from "../../../../../Store/ItemRequestStore";

import TabComponent from "@Components/Common/TabComponent";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import { grey } from "@mui/material/colors";

import { itemRequestsTabs } from "../../../../../Data/Options";
import { ITEMS_REQUESTS } from "../../../../../Data/Columns";

const ExpandedTable = ({ row }) => {
  return (
    <>
      <Typography
        level="body-sm"
        startDecorator={
          <ExtensionOutlined color="primary" sx={{ fontSize: 20 }} />
        }
        alignItems={"center"}
        mb={2}
        fontWeight={600}
        sx={{ color: grey[800] }}
      >
        Specifications
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        {row.item_specifications?.map((spec, i) => (
          <Sheet
            key={i}
            variant="outlined"
            sx={{ p: 2, borderRadius: 15, minWidth: 260 }}
          >
            {spec.description}
          </Sheet>
        ))}
      </Box>
    </>
  );
};

const Content = ({ data, path }) => {
  const { requestsByUser } = useItemRequestStore();
  const { getItemRequestByUser } = useItemRequestHook();

  const [openApprove, setOpenApprove] = useState(false);
  const [status, setStatus] = useState();
  const [row, setRow] = useState({});
  const [index, setIndex] = useState(8);

  useEffect(() => {
    // console.log(index)
    // console.log('row', data)
    // console.log('path', path)
  }, [data, path, index]);

  const {
    data: itemRequestsData,
    current_page,
    next_page_url,
    per_page,
    prev_page_url,
    total,
  } = data || {};

  const handleOpen = (status, row) => {
    setStatus(status);
    setRow(row);
    setOpenApprove(true);
  };

  useEffect(() => {
    const params = { status_id: index };

    (getItemRequestByUser(params),
      (status, message) => {
        console.log(params);
        if (status !== 200) {
          console.error("Failed to fetch items:", message);
        }
      });
  }, [index]);

  return (
    <>
      <TabComponent tabs={itemRequestsTabs} index={index} setIndex={setIndex} />

      <ExpandableTable
        columns={ITEMS_REQUESTS(handleOpen, path)}
        rows={itemRequestsData}
        // isLoading={}
        currentPage={current_page}
        totalPages={total}
        totalRows={per_page}
        onNextPage={next_page_url}
        onPrevPage={prev_page_url}
        renderExpanded={(row) => (
          <>
            <ExpandedTable row={row} />
          </>
        )}
      />
    </>
  );
};

export default Content;
