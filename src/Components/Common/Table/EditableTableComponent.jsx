import { useState } from "react";
import { Table, Sheet, Typography, Input, Select, Option } from "@mui/joy";

const EditableTableComponent = ({ tableHeader = [], tableRow = [] }) => {
  return (
    <Sheet
      variant="outlined"
      sx={{
        p: 2, borderRadius: "md"
      }}
    >
      <Table
        stickyHeader
      >
        <thead>
          {/* First row - parent headers */}
          <tr>
            {tableHeader.map((header) => (
              header.children ? (
                <th
                  key={header.id}
                  colSpan={header.children.length}
                  align={header.align || 'center'}
                  style={{
                    borderRightWidth: header.noRightBorder ? 0 : undefined,
                    width: header.width
                  }}
                >
                  {header.name}
                </th>
              ) : (
                <th
                  key={header.id}
                  rowSpan={2}
                  align={header.align || 'center'}
                  style={{
                    width: header.width
                  }}
                >
                  {header.name}
                </th>
              )
            ))}
          </tr>

          {/* Second row - child headers (only for parents with children) */}
          <tr>
            {tableHeader.flatMap(header =>
              header.children
                ? header.children.map((child, index) => (
                  <th
                    key={`${header.id}-${index}`}
                    align={child.align || 'center'}
                    style={{
                      borderRightWidth: child.noRightBorder ? 0 : undefined,
                      width: child.width
                    }}
                  >
                    {child.name}
                  </th>
                ))
                : []
            )}
          </tr>
        </thead>

        <tbody>{tableRow}</tbody>
      </Table>
    </Sheet>
  );
};

export default EditableTableComponent;
