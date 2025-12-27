import React from "react";
import { Table, Sheet, Typography } from "@mui/joy";
import { grey } from "@mui/material/colors";

const BasicTableComponent = ({
  columns = [],
  rows = [],
  emptyMessage = "No records found",
}) => {
  return (
    <Sheet
      sx={{
        borderRadius: "md",
        display: "flex",
        flexDirection: "column",
        height: "100%", // 🔑 fill available space
        minHeight: 0, // 🔑 allow flex scrolling
      }}
    >
      <Table
        aria-label="collapsible table"
        sx={{
          "--TableCell-headBackground": "#E5E5E5",

          "--TableCell-borderColor": grey[200],
        }}
        hoverRow
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
