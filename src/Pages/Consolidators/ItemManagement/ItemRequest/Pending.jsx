import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import { ITEMS_REQUESTS } from "../../../../Data/Columns";
import React, { useEffect } from "react";
import useItemRequestHook from "../../../../Hooks/ItemRequest/ItemRequestHook";
import { Box, Sheet } from "@mui/joy";

export default function Pending() {
  const { requests, getItemRequests } = useItemRequestHook();

  useEffect(() => {
    getItemRequests((status, message) => {
      if (status !== 200) {
        console.error("Failed to fetch items:", message);
      }
    });
  }, []);
  return (
    <div>
      {console.log(requests)}
      <ExpandableTable
        columns={ITEMS_REQUESTS()}
        rows={requests}
        renderExpanded={(row) => (
          <Box sx={{ display: "flex", gap: 2 }}>
            {row?.item_specifications?.map((spec, i) => (
              <Sheet
                key={i}
                variant="outlined"
                sx={{ p: 2, borderRadius: "md", minWidth: 260 }}
              >
                {spec.description}
              </Sheet>
            ))}
          </Box>
        )}
      />
    </div>
  );
}
