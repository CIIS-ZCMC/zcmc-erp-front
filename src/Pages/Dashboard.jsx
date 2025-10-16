import React from "react";
import { Stack, Typography } from "@mui/joy";
import PageTitle from "../Components/Common/PageTitle";
import { useAuth } from "../Store/AuthStore";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <Stack gap={3}>
        <PageTitle
          title={
            <Typography>
              Hi {user?.name.split(" ")[0]}, welcome to the dashboard!
            </Typography>
          }
          description={
            "Oversee how resource planning-related information has changed over time."
          }
        />
      </Stack>
    </div>
  );
}

export default Dashboard;
