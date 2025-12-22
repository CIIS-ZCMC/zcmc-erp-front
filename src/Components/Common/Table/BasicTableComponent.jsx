import React from "react";
import { Table, Sheet, Typography } from "@mui/joy";

const BasicTableComponent = ({
  columns = [],
  rows = [],
  emptyMessage = "No records found",
}) => {
  return (
    <Sheet
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: "sm",
        overflow: "auto",
      }}
    >
      <Table
        hoverRow
        stickyHeader
        size="sm"
        sx={{
          width: "100%",
          tableLayout: "fixed",
          "--TableCell-paddingX": "0.5rem",
          "--TableCell-paddingY": "0.375rem",
          "& th": {
            fontSize: "0.75rem",
            fontWeight: "lg",
          },
          "& td": {
            fontSize: "0.75rem",
          },
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.field}
                style={{
                  width: col.width,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <Typography level="body-sm" textAlign="center" sx={{ py: 2 }}>
                  {emptyMessage}
                </Typography>
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id ?? index}>
                {columns.map((col) => (
                  <td key={col.field}>
                    {col.render ? col.render(row) : row[col.field]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default BasicTableComponent;
