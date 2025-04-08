import { useEffect, useState } from "react";
import { Table, Sheet, Box, Typography, Input, Select, Option } from "@mui/joy";

const EditableTableComponent = ({

  columns = [],
  tableRow = [],
  maxHeight,
  stripe,
  hoverRow,
  bordered = false,
  border = 'none',
  stickLast = false,
  textWrap,
}) => {

  useEffect(() => (
    console.log(stickLast)
  ), [])

  const lastColumnWidth = columns[columns.length - 1]?.width || "144px";

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Sheet
        variant="outlined"
        sx={() => ({
          "--TableCell-height": "40px",
          // the number is the amount of the header rows.
          "--TableHeader-height": "calc(1 * var(--TableCell-height))",
          "--Table-firstColumnWidth": columns[0]?.width, //set the width of the first column in px
          "--Table-lastColumnWidth": lastColumnWidth, //set the width of the first column in px
          // background needs to have transparency to show the scrolling shadows
          "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
          "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
          overflow: "auto",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "local, local, scroll, scroll",
          backgroundPosition:
            "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
          backgroundColor: "background.surface",
        })}
      >
        <Table
          borderAxis="bothBetween"
          stripe={stripe}
          hoverRow
          sx={{
            tableLayout: "fixed",
            "& tr > *:first-child": {
              position: "sticky",
              left: 0,
              boxShadow: "1px 0 var(--TableCell-borderColor)",
              bgcolor: "background.surface",
            },
            ...(stickLast && {
              "& tr > *:last-child": {
                position: "sticky",
                right: 0,
                bgcolor: "var(--TableCell-headBackground)",
              },
            }),
          }}
        >
          <thead>
            {/* First row - parent headers */}
            <tr>
              {columns.map((header, index) => {
                const isFirstColumn = index === 0;
                const isLastColumn = index === columns.length - 1
                return (
                  header.children ? (
                    <th
                      key={header.id}
                      aria-label={isLastColumn && stickLast ? "last" : ""}
                      colSpan={header.children.length}
                      align={header.align || 'center'}
                      style={{
                        width: isFirstColumn
                          ? "var(--Table-firstColumnWidth)"
                          : isLastColumn && stickLast
                            ? "var(--Table-lastColumnWidth)"
                            : header.width || 200,
                        fontSize: 13,
                        textAlign: header.align,
                        backgroundColor: "rgba(240, 240, 240, 1)",
                        whiteSpace: textWrap ? "normal" : "nowrap",
                      }}
                    >
                      {header.name}
                    </th>
                  ) : (
                    <th
                      key={header.id}
                      aria-label={isLastColumn && stickLast ? "last" : ""}
                      rowSpan={2}
                      align={header.align || 'center'}
                      style={{
                        width: header.width
                      }}
                    >
                      {header.name}
                    </th>
                  )
                )
              })}
            </tr>

            {/* Second row - child headers (only for parents with children) */}
            <tr>
              {columns.flatMap(header =>
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
      </Sheet >
    </Box>
  );
};

export default EditableTableComponent;
