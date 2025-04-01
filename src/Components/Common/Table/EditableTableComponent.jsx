import { useState } from "react";
import { Table, Sheet, Typography, Input, Select, Option } from "@mui/joy";

const EditableTableComponent = ({ tableHeader, tableRow }) => {
  return (
    <Sheet variant="outlined" sx={{ p: 2, borderRadius: "md" }}>
      <Table>
        <thead>
          <tr>
            {tableHeader.map(({ header, id }) => (
              <th key={id}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableRow}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default EditableTableComponent;
