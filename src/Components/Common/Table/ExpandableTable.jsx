import { Sheet, Table } from "@mui/joy";
import { grey } from "@mui/material/colors";
import React, { useState } from "react";

export default function ExpandableTable({
  columns = [],
  rows = [],
  renderExpanded, // (row) => JSX
  getRowId = (row) => row.id,
}) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <Sheet variant="plain" sx={{ borderRadius: "lg", overflow: "hidden" }}>
      <Table borderAxis="xBetween" stickyHeader hoverRow>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "10px",
                  textAlign: "left",
                  backgroundColor: grey[200],
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            const expanded = openId === id;

            return (
              <React.Fragment key={id}>
                {/* Main Row */}
                <tr>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        cursor: col.expandTrigger ? "pointer" : "default",
                      }}
                      onClick={() => col.expandTrigger && toggle(id)}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>

                {/* Expanded Content Row */}
                {expanded && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{ background: "#fafafa", padding: "16px" }}
                    >
                      {renderExpanded(row)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>
    </Sheet>
  );
}
