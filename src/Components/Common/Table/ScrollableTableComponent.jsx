import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import { useMemo, useState } from "react";
import NoResultComponent from "./NoResultComponent";
import PaginationComponent from "./PaginationComponent";

function ScrollableTableComponent({
  stickLast = false,
  data,
  columns,
  pageSize = 5,
  actions = {},
  withSearch,
  setSearch,
  search = "",
  fieldsToSearch = [],
  textWrap,
  stripe,
  bordered = false,
  footer,
  maxHeight,
  withCount,
  border = "none",
  hoverRow,
  isLoading,
}) {
  // PAGINATION SETUP
  const [currentPage, setCurrentPage] = useState(1);

  const currentData = useMemo(() => {
    const filteredData = search
      ? data?.filter((item) =>
        fieldsToSearch?.some((field) => {
          const value = item[field]; // Access the field value dynamically
          return (
            typeof value === "string" && // Ensure the value is a string
            value.toLowerCase().includes(search.toLowerCase())
          );
        })
      )
      : data;

    const totalPages = Math.ceil(filteredData?.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredData?.slice(
      startIndex,
      startIndex + pageSize
    );

    return { paginatedData, totalPages };
  }, [search, data, pageSize, currentPage, fieldsToSearch]);

  const { paginatedData, totalPages } = currentData;

  // PAGINATION ACTIONS
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

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
          {paginatedData?.length !== 0 ? (
            <thead>
              <tr>
                {columns?.map((column, index) => {
                  const isFirstColumn = index === 0;
                  const isLastColumn = index === columns.length - 1;

                  return (
                    <th
                      key={index}
                      aria-label={isLastColumn && stickLast ? "last" : ""}
                      style={{
                        width: isFirstColumn
                          ? "var(--Table-firstColumnWidth)"
                          : isLastColumn && stickLast
                            ? "var(--Table-lastColumnWidth)"
                            : column.width || 200,
                        fontSize: 13,
                        textAlign: column.align,
                        backgroundColor: "rgba(240, 240, 240, 1)",
                        whiteSpace: textWrap ? "normal" : "nowrap",
                      }}
                    >
                      {column.name}
                    </th>
                  );
                })}
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
                    <CircularProgress />
                  </Box>
                </td>
              </tr>
            ) : paginatedData?.length > 0 ? (
              paginatedData?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map(({ field, render, align }, colIndex) => {
                    return (
                      <td key={colIndex} style={{ textAlign: align }}>
                        {render ? render(row) : row[field] ?? "-"}
                      </td>
                    );
                  })}
                </tr>
              ))
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
      {data?.length > pageSize && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          totalRows={data?.length}
        />
      )}
    </Box>
  );
}

export default ScrollableTableComponent;
