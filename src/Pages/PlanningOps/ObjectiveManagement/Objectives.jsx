import React, { Fragment } from "react";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import PageTitle from "../../../Components/Common/PageTitle";
import TableComponent from "../../../Components/Common/Table/TableComponent";
import { Stack, Typography } from "@mui/joy";
import { objHeaders } from "../../../Data/Columns";

function Objectives({ props }) {
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

  // Dummy action for "Actions" column
  const actions = {
    action: (id) => alert(`Action clicked for ID: ${id}`),
    icon: "📝",
    color: "primary",
  };
  return (
    <Fragment>
      <PageTitle
        title="Objectives and Success Indicators"
        description="This is a subheading. It should add more context to the interaction."
      />

      <ContainerComponent
        title={"List of Objectives and Success Indicators"}
        description={
          "This is a subheading. It should add more context to the interaction."
        }
        actions={<ButtonComponent label="Create new" color="success" />}
        sx={{ mt: 3 }}
      >
        <TableComponent
          data={data}
          columns={objHeaders}
          pageSize={5}
          actions={actions}
          stripe="odd"
          bordered
          hoverRow
          isLoading={false}
        />
      </ContainerComponent>
    </Fragment>
  );
}

export default Objectives;
