import React from "react";
import { useAuth } from "../Store/AuthStore";
import { Typography } from "@mui/joy";

function Dashboard(props) {
  const { user } = useAuth();

  const { name, id } = user ?? {};
  return (
    <div>
      <Typography>USER: {name}</Typography>
    </div>
  );
}

export default Dashboard;
