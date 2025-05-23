import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Sheet,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { useMemo, useState } from "react";
import NoResultComponent from "./NoResultComponent";
import PaginationComponent from "./PaginationComponent";
import { ThreeDots } from "react-loader-spinner";
import get from "lodash.get";
import InputComponent from "../../Form/InputComponent";

function ServerTableComponent({
  data = [],
  columns,
  paginationMeta = {},
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  isLoading,
  withCount,
  stickLast = false,
  bordered = false,
  footer,
  stripe,
  fieldsToSearch = [],
  hoverRow,
  highlightedRowId,
}) {
  const [search, setSearch] = useState("");

  const lastColumnWidth = columns[columns.length - 1]?.width || "144px";

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      fieldsToSearch.some((field) => {
        const value = get(item, field); // e.g., "objective.description"
        return (
          typeof value === "string" &&
          value.toLowerCase().includes(search.toLowerCase())
        );
      })
    );
  }, [search, data, fieldsToSearch]);
  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      <Stack gap={1} mb={2} justifyContent="space-between">
        <InputComponent
          label="Search"
          width="30%"
          value={search}
          setValue={setSearch}
        />
      </Stack>
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
          }}
        >
          {data?.length !== 0 ? (
            <thead>
              <tr>
                {columns?.map((column, index) => {
                  const isFirstColumn = index === 0;
                  const isLastColumn = index === columns.length - 1;

                  return column?.children ? (
                    <th
                      key={index}
                      colSpan={column?.children?.length}
                      style={{
                        width: column.width || 200,
                        fontSize: 13,
                        textAlign: column.align || "left",
                        backgroundColor: "rgba(240, 240, 240, 1)",
                      }}
                    >
                      {column.name}
                    </th>
                  ) : (
                    <th
                      key={index}
                      aria-label={isLastColumn && stickLast ? "last" : ""}
                      rowSpan={2}
                      style={{
                        width: isFirstColumn
                          ? "var(--Table-firstColumnWidth)"
                          : isLastColumn && stickLast
                          ? "var(--Table-lastColumnWidth)"
                          : column.width || 200,
                        fontSize: 13,
                        textAlign: column.align || "left",
                        backgroundColor: "rgba(240, 240, 240, 1)",
                      }}
                    >
                      {column.name}
                    </th>
                  );
                })}
              </tr>

              <tr>
                {columns.map((column) =>
                  column?.children
                    ? column?.children?.map((child, childIndex) => (
                        <th
                          key={`${column.id}-${childIndex}`}
                          style={{
                            width: child.width || 200,
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
          ) : (
            ""
          )}

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns?.length} style={{ padding: 0 }}>
                  <Box
                    sx={{
                      py: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ThreeDots
                      visible={true}
                      width="80"
                      color="#4fa94d"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </Box>
                </td>
              </tr>
            ) : filteredData?.length > 0 ? (
              filteredData?.map((row, rowIndex) => {
                console.log(row.id, highlightedRowId);
                const isHighlighted = row.id === highlightedRowId;
                return (
                  <tr
                    key={rowIndex}
                    style={{
                      backgroundColor: isHighlighted ? "#d2f0ff" : "none",
                      transition: "background-color 0.3s ease-in-out",
                    }}
                  >
                    {columns.map(({ field, render, align }, colIndex) => {
                      return (
                        <td key={colIndex} style={{ textAlign: align }}>
                          {render ? render(row) : row[field] ?? "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns?.length} style={{ padding: 0 }}>
                  <Box
                    sx={{
                      py: 7,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px", // Adjust as needed for vertical centering
                      width: "100%",
                    }}
                  >
                    <NoResultComponent />
                  </Box>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      {/* Pagination Component */}
      {paginationMeta?.total > 0 && (
        <PaginationComponent
          currentPage={paginationMeta.current_page}
          totalPages={paginationMeta.last_page}
          onNextPage={() =>
            paginationMeta.current_page < paginationMeta.last_page &&
            onPageChange(paginationMeta.current_page + 1)
          }
          onPrevPage={() =>
            paginationMeta.current_page > 1 &&
            onPageChange(paginationMeta.current_page - 1)
          }
          totalRows={paginationMeta.total}
        />
      )}
    </Box>
  );
}

export default ServerTableComponent;
