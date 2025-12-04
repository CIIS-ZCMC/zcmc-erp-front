import { Box, Sheet, Stack, Table } from "@mui/joy";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import PaginationComponent from "./PaginationComponent";
import NoResultComponent from "./NoResultComponent";

import { ThreeDotsLoader } from "../Loading/ThreeDotsLoader";

export default function ExpandableTable({
  columns = [],
  rows = [],
  renderExpanded, // (row) => JSX
  getRowId = (row) => row.id,
  isLoading,
  currentPage,
  totalPages,
  totalRows,
  onNextPage,
  onPrevPage,
  loading,
}) {
  const [openId, setOpenId] = useState(null);
  const [heights, setHeights] = useState({}); // store row heights

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const onRef = (id, node) => {
    if (node && !heights[id]) {
      const h = node.scrollHeight;
      setHeights((prev) => ({ ...prev, [id]: h }));
    }
  };

  useEffect(() => {
    // console.log(isLoading)
    // console.log(rows)
    // console.log(columns)
  }, [rows, columns, isLoading])

  return (
    <>
      {isLoading ?
        <Stack
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          my={2}
          height={"65vh"}
        >
          <ThreeDotsLoader />
        </Stack>
        :
        rows.length === 0 ?
          <>
            <NoResultComponent />
          </>
          :
          <Sheet
            sx={{
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <Table
              borderAxis="xBetween"
              sx={{
                "--TableCell-headBackground": "#E5E5E5",
                "--TableCell-paddingY": "10px",
                "--TableCell-paddingX": "20px",
                "--TableCell-borderColor": grey[200],
              }}
              stickyHeader
              hoverRow
            >
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        textAlign: col.align ?? "left",
                        backgroundColor: grey[200],
                        width: col.width ?? "200px", // ⬅️ add this
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      style={{ textAlign: "center", padding: "40px 0" }}
                    >
                      <ThreeDotsLoader />
                    </td>
                  </tr>
                ) : (
                  rows?.map((row) => {
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
                                width: col.width ?? "200px",
                                textAlign: col.align ?? "left",
                                cursor: col.expandTrigger ? "pointer" : "default",
                                background: expanded && grey[100],
                                borderBottom: expanded && "none",
                              }}
                              onClick={() => col.expandTrigger && toggle(id)}
                            >
                              {col.render ? col.render(row) : row[col.key]}
                            </td>
                          ))}
                        </tr>

                        {/* EXPANDED ROW WITH TRANSITION */}
                        <tr>
                          <td
                            style={{ height: 0, padding: 0 }}
                            colSpan={columns.length}
                          >
                            <div
                              ref={(node) => onRef(id, node)}
                              style={{
                                overflow: "hidden",
                                maxHeight: expanded ? heights[id] : 0,
                                opacity: expanded ? 1 : 0,
                                padding: expanded ? "16px" : "0px", // <--- avoid spacing when closed
                                background: expanded && grey[100],
                                transition:
                                  "max-height 0.35s ease, opacity 0.25s ease, padding 0.2s ease",
                              }}
                            >
                              <Box sx={{ p: 2 }}>{renderExpanded(row)}</Box>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </Table>

            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              totalRows={totalRows}
              onNextPage={onNextPage}
              onPrevPage={onPrevPage}
            />
          </Sheet>
      }

    </>
  );
}
