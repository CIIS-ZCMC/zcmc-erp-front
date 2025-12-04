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
          <Table
            borderAxis="xBetween" stickyHeader hoverRow
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
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
              {rows?.map((row) => {
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
              })}
            </tbody>
          </Table>

      }


    </>
  );
}
