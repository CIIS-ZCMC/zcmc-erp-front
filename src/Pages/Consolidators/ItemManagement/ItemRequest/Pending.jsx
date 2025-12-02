import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import { ITEMS_REQUESTS } from "../../../../Data/Columns";
import React, { useEffect, useState } from "react";
import useItemRequestHook from "../../../../Hooks/ItemRequest/ItemRequestHook";
import { Box, Sheet, Typography } from "@mui/joy";
import { ExtensionOutlined } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import ItemRequestModal from "./ItemRequestModal";

export default function Pending() {
  const { requests, getItemRequests } = useItemRequestHook();
  const [openApprove, setOpenApprove] = useState(false);
  const [status, setStatus] = useState();
  const [row, setRow] = useState({});

  const handleOpen = (status, row) => {
    setStatus(status);
    setRow(row);
    setOpenApprove(true);
  };

  const { data } = requests;

  useEffect(() => {
    getItemRequests((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    }, 3);
  }, []);

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  return (
    <div>

      <ExpandableTable
        columns={ITEMS_REQUESTS(handleOpen)}
        rows={data}
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

      <ItemRequestModal
        open={openApprove}
        handleClose={() => setOpenApprove(false)}
        status={status}
        row={row}
      />
    </div>
  );
}
