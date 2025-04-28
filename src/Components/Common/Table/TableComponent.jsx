import {
  Box,
  CircularProgress,
  IconButton,
  Input,
  Sheet,
  Table,
} from "@mui/joy";
import { Fragment, useMemo, useState } from "react";
import PaginationComponent from "./PaginationComponent";
import NoResultComponent from "./NoResultComponent";

const TableComponent = ({
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
}) => {
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

  return (
    <Fragment>
      {withSearch && (
        <Box display="flex" alignItems="center" pb={5}>
          <Input
            fontSize="13px"
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user"
            width="400px"
            _hover={{ borderColor: "green" }}
            _focus={{
              boxShadow: "none",
              outline: "none",
              borderColor: "green",
            }}
            bgColor="white"
          />
        </Box>
      )}

      {/* Table */}
      <Sheet
        sx={{
          // width: "100%",
          border: 1,
          // p: 0.3,
          borderColor: "neutral.200",
          borderRadius: 10,
          maxHeight: maxHeight ?? "100%",
          overflow: "auto",
        }}
      >
        <Table
          stickyHeader
          stripe={stripe}
          borderAxis={bordered ? "bothBetween" : border}
          hoverRow={hoverRow}
          sx={{
            "& tr > *:first-child": {
              position: "sticky",
              left: 0,
              boxShadow: "1px 0 var(--TableCell-borderColor)",
              bgcolor: "background.surface",
            },
          }}
        >
          {!pageSize ? (
            <thead>
              {withCount && (
                <th
                  width="auto"
                  style={{
                    fontSize: 13,
                    backgroundColor: "rgba(249, 250, 251, 1)",
                  }}
                >
                  #
                </th>
              )}
              {columns?.map((column, index) => (
                <th
                  key={index}
                  width={column.width}
                  style={{
                    fontSize: 13,
                    textAlign: column.align,
                    backgroundColor: "rgba(240, 240, 240, 1)",
                    whiteSpace: textWrap ? "normal" : "nowrap",
                  }}
                >
                  {column.name}
                </th>
              ))}
            </thead>
          ) : (
            <tr>
              {withCount && (
                <th
                  width="auto"
                  style={{
                    fontSize: 13,
                    backgroundColor: "rgba(249, 250, 251, 1)",
                  }}
                >
                  #
                </th>
              )}
              {columns?.map((column, index) => (
                <th
                  key={index}
                  width={column.width}
                  style={{
                    fontSize: 13,
                    textAlign: column.align,
                    backgroundColor: "rgba(240, 240, 240, 1)",
                    whiteSpace: textWrap ? "normal" : "nowrap",
                  }}
                >
                  {column.name}
                </th>
              ))}
            </tr>
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
                <tr
                  key={rowIndex}
                  style={{
                    backgroundColor: stripe
                      ? stripe === "odd"
                        ? rowIndex % 2 === 0
                          ? "white"
                          : "rgba(247, 247, 247, 1)"
                        : rowIndex % 2 === 0
                        ? "rgba(247, 247, 247, 1)"
                        : "white"
                      : "white",
                  }}
                >
                  {withCount && <td width={"2%"}>{rowIndex + 1}</td>}
                  {columns.map(
                    ({ field, render, width = "auto", align }, colIndex) => {
                      if (field === "action") {
                        return (
                          <td width={width} key={colIndex}>
                            <IconButton
                              onClick={() =>
                                actions.action(row["transaction_code"])
                              }
                              size="md"
                              color={actions.color}
                              variant="soft"
                            >
                              {actions.icon}
                            </IconButton>
                          </td>
                        );
                      }
                      return (
                        <td key={colIndex} style={{ textAlign: align }}>
                          {render ? render(row) : row[field] ?? "-"}
                        </td>
                      );
                    }
                  )}
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
          {footer && <tfoot>{footer}</tfoot>}
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
    </Fragment>
  );
};

export default TableComponent;
