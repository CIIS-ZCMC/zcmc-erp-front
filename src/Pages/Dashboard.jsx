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
          title={<Typography>Enterprise Resource Planning </Typography>}
          description={
            "The following below serves as the summary of your AOP request. You can open and update your request before the deadline as set by the administrators."
          }
        />
      </Stack>
    </div>
  );
}

export default Dashboard;
