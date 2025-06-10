import React from "react";
import { Stack, Typography } from "@mui/joy";
import PageTitle from "../Components/Common/PageTitle";

function Dashboard() {

  return (
    <div>
      <Stack gap={3}>
        <PageTitle
          title={
            <Typography>
              Dashboard
            </Typography>
          }
          description={"Welcome to the dashboard."}
        />
      </Stack>
    </div>
  );
}

export default Dashboard;
