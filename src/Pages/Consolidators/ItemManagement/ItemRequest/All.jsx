import React, { useState, useEffect } from 'react';

import { Typography, Box, Sheet } from '@mui/joy';
import { ExtensionOutlined } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

import ExpandableTable from '@Components/Common/Table/ExpandableTable';

import { ITEMS_REQUESTS } from '../../../../Data/Columns';

import useItemRequestStore from '../../../../Store/ItemRequestStore';
import useItemRequestHook from '../../../../Hooks/ItemRequest/ItemRequestHookv2';

const All = () => {


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
    getItemRequests((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    }, 8);
  }, []);

  return (
    <>
      <ExpandableTable
        columns={ITEMS_REQUESTS(handleOpen)}
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