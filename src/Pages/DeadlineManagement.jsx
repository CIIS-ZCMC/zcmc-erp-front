import React from "react";
import { Stack, Typography } from "@mui/joy";
import PageTitle from "../Components/Common/PageTitle";

function DeadlineManagement() {

  return (
    <div>
      <Stack gap={3}>
        <PageTitle
          title={
            <Typography>
              DeadlineManagement
            </Typography>
          }
          description={"Manage deadlines for different processes."}
        />
      </Stack>
    </div>
  );
}

export default DeadlineManagement;
