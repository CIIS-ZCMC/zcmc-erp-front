import { useEffect, useState } from "react";
import { Table, Sheet, Box, Typography, Input, Select, Option } from "@mui/joy";

const EditableTableComponent = ({
  columns = [],
  rows = [],
  maxHeight,
  stripe,
  hoverRow,
  bordered = false,
  border = "none",
  stickLast = false,
  textWrap,
}) => {
  const tableStyles = {
    tableLayout: "fixed",
    "& tr > *:first-child": {
      position: "sticky",
      zIndex: 10,
      left: 0,
      boxShadow: "1px 0 var(--TableCell-borderColor)",
      bgcolor: "background.surface",
    },
    ...(stickLast && {
      "& tr > *:last-child": {
        position: "sticky",
        zIndex: 10,
        right: 0,
        bgcolor: "var(--TableCell-headBackground)",
      },
    }),
  };

  return (
    <Table borderAxis="bothBetween" stripe={stripe} hoverRow sx={tableStyles}>
      <thead>
        {/* First row - parent headers */}
        <tr>
          {columns?.map((header, index) => {
            const isFirstColumn = index === 0;
            const isLastColumn = index === columns.length - 1;

            return header.children ? (
              <th
                key={header.id || index} // Ensure a unique key based on header ID or index
                colSpan={header.children.length}
                style={{
                  width: header.width || 200,
                  fontSize: 13,
                  textAlign: header.align || "left",
                  backgroundColor: "rgba(240, 240, 240, 1)",
                }}
              >
                {header.name}
              </th>
            ) : (
              <th
                key={header.id || index} // Ensure a unique key based on header ID or index
                aria-label={isLastColumn && stickLast ? "last" : ""}
                rowSpan={2}
                style={{
                  width: isFirstColumn
                    ? "var(--Table-firstColumnWidth)"
                    : isLastColumn && stickLast
                      ? "var(--Table-lastColumnWidth)"
                      : header.width || 200,
                  fontSize: 13,
                  textAlign: header.align || "left",
                  backgroundColor: "rgba(240, 240, 240, 1)",
                }}
              >
                {header.name}
              </th>
            );
          })}
        </tr>

        {/* Second row - child headers (only for parents with children) */}
        <tr>
          {columns?.flatMap((header, parentIndex) =>
            header.children
              ? header.children.map((child, childIndex) => (
                <th
                  key={`${parentIndex}-${childIndex}`} // Use a combination of parent and child index
                  style={{
                    fontSize: 13,
                    textAlign: child.align || "center",
                    backgroundColor: "rgba(240, 240, 240, 1)",
                    zIndex: 1,
                  }}
                >
                  {child.name}
                </th>
              ))
              : []
          )}
        </tr>
      </thead>

      <tbody>{rows}</tbody>
    </Table>
  );
};

export default EditableTableComponent;
