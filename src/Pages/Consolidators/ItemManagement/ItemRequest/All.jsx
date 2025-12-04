import React, { useState, useEffect } from 'react';

import { Typography, Box, Sheet } from '@mui/joy';
import { ExtensionOutlined } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import { useLocation } from 'react-router-dom';

import ExpandableTable from '@Components/Common/Table/ExpandableTable';

import { ITEMS_REQUESTS } from '../../../../Data/Columns';

import useItemRequestStore from '../../../../Store/ItemRequestStore';
import useItemRequestHook from '../../../../Hooks/ItemRequest/ItemRequestHookv2';

const All = () => {

  const location = useLocation();
  const pathName = location.pathname;

  const { requests, isLoading } = useItemRequestStore();
  const { getItemRequests } = useItemRequestHook();

  const [openApprove, setOpenApprove] = useState(false);
  const [status, setStatus] = useState();
  const [row, setRow] = useState({});

  const handleOpen = (status, row) => {
    setStatus(status);
    setRow(row);
    setOpenApprove(true);
  };

  useEffect(() => {
    const params = { status_id: 8 }
    getItemRequests(params, (status, message) => {
      // console.log(params)
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  }, []);

  // useEffect(() => {
  //   console.log(statuses)
  // }, [statuses])

  return (
    <>
      <ExpandableTable
        columns={ITEMS_REQUESTS(handleOpen, pathName)}
        rows={requests}
        isLoading={isLoading}
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
    </>
  )
}

export default All