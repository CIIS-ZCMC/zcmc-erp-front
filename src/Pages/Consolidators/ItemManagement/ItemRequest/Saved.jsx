import React, { useState, useEffect } from 'react'
import { Typography, Box, Sheet } from '@mui/joy'
import { ExtensionOutlined } from '@mui/icons-material'
import { grey } from "@mui/material/colors";
import { useLocation } from 'react-router-dom';

import ExpandableTable from '@Components/Common/Table/ExpandableTable'

import { ITEMS_REQUESTS } from '../../../../Data/Columns'

import useItemRequestStore from '../../../../Store/ItemRequestStore'
import useItemRequestsHook from '../../../../Hooks/ItemRequest/ItemRequestHookv2'

const Saved = () => {

  const location = useLocation()
  const pathName = location.pathname;

  const { requests, isLoading } = useItemRequestStore();
  const { getItemRequests } = useItemRequestsHook();

  const [openApprove, setOpenApprove] = useState(false);
  const [status, setStatus] = useState();
  const [row, setRow] = useState({});

  const {
    data,
    current_page,
    next_page_url,
    per_page,
    prev_page_url,
    total
  } = requests || {}

  const handleOpen = (status, row) => {
    setStatus(status);
    setRow(row);
    setOpenApprove(true);
  };

  useEffect(() => {
    const params = { status_id: 4 }
    getItemRequests(params, (status, message) => {
      // console.log(params)
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  }, []);

  return (
    <>
      <ExpandableTable
        columns={ITEMS_REQUESTS(handleOpen, pathName)}
        rows={data}
        isLoading={isLoading}
        currentPage={current_page}
        totalPages={total}
        totalRows={per_page}
        onNextPage={next_page_url}
        onPrevPage={prev_page_url}
        renderExpanded={(row) => (
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
              {row?.item_specifications?.map((spec, i) => (
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
        )}
      />
    </ >
  )
}

export default Saved