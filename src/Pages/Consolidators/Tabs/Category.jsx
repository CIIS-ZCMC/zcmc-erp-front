import React, { Fragment } from "react";
import { objHeaders } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { Typography } from "@mui/joy";

export const Category = () => {
  const data = [
    {
      id: 1,
      function: "Alice Johnson",
      objective: "alice@example.com",
      role: "Admin",
    },
    { id: 2, name: "Bob Smith", objective: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "Editor",
    },
    {
      id: 4,
      name: "Diana Prince",
      objective: "diana@example.com",
      role: "User",
    },
    {
      id: 5,
      name: "Ethan Hunt",
      objective: "ethan@example.com",
      role: "Moderator",
    },
    {
      id: 6,
      name: "Fiona Gallagher",
      objective: "fiona@example.com",
      role: "User",
    },
    {
      id: 7,
      name: "George Bailey",
      objective: "george@example.com",
      role: "Admin",
    },
    {
      id: 8,
      name: "Hannah Montana",
      objective: "hannah@example.com",
      role: "Editor",
    },
    { id: 9, name: "Ian Curtis", objective: "ian@example.com", role: "User" },
    { id: 10, name: "Jane Doe", objective: "jane@example.com", role: "User" },
  ];

  return (
    <Fragment>
      <ScrollableTableComponent
        data={data}
        columns={objHeaders}
        pageSize={5}
        stripe="even"
        bordered
        hoverRow
        isLoading={false}
        stickLast
      />
    </Fragment>
  );
};
