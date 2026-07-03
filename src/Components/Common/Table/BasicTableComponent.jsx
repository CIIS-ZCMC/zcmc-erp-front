import React from "react";
import { Table, Sheet, Typography } from "@mui/joy";
import { grey } from "@mui/material/colors";

const BasicTableComponent = ({
  columns = [],
  rows = [],
  emptyMessage = "No records found",
  emptyButton,
  maxHeight = "none", // Optional max height for scrolling
  stickyHeader = false, // Optional sticky header
  getRowIndicatorColor,
}) => {
  return (
    <Sheet
      sx={{
        borderRadius: "md",
        display: "flex",
        flexDirection: "column",
        height: "100%", // 🔑 fill available space
        minHeight: 0, // 🔑 allow flex scrolling
        maxHeight: maxHeight, // Dynamic max height
        overflowY: maxHeight !== "none" ? "auto" : "visible", // Dynamic overflow
      }}
    >
      <Table
        aria-label="collapsible table"
        sx={{
          "--TableCell-headBackground": "#E5E5E5",

          "--TableCell-borderColor": grey[200],
          tableLayout: stickyHeader ? "fixed" : "auto",
        }}
        stickyHeader={stickyHeader}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.field || col.id}
                style={{
                  width: col.width,
                  textAlign: col.align || "left",
                  textWrap: "wrap",
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
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                <Typography level="body-sm" textAlign="center" sx={{ py: 2 }}>
                  {emptyMessage}
                </Typography>
                {emptyButton}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => {
              const indicatorColor = getRowIndicatorColor?.(row);

              return (
                <tr key={row.id ?? index}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.field}
                      style={{
                        textAlign: col.align || "left",

                        ...(colIndex === 0 && {
                          borderLeft: `4px solid ${indicatorColor}`,
                        }),
                      }}
                    >
                      {col.render ? col.render(row) : row[col.field]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default BasicTableComponent;
