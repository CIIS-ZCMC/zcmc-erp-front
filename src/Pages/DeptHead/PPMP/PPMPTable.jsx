import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import NoResultComponent from "../../../Components/Common/Table/NoResultComponent";
import PaginationComponent from "../../../Components/Common/Table/PaginationComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import debounce from "lodash.debounce";
import { ThreeDots } from "react-loader-spinner";
import { flattenColumns } from "../../../Utils/FlattenColumns";
import { MdDeleteOutline } from "react-icons/md";

const PPMPTable = ({
  stickLast = false,
  stickSecond = false,
  data,
  columns,
  stripe,
  isLoading,
  setData,
}) => {
  const childHeaders = flattenColumns(columns);
  const [editedCells, setEditedCells] = useState({});

  const handleCellEdit = (rowId, field, value) => {
    setEditedCells((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  };
  const handleInputChange = (itemId, field, value) => {
    setData((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleBlur = (rowId, field) => {
    // Apply changes to data and reset editedCells for the specific row
    setData((prevData) =>
      prevData.map((row) => {
        const edits = editedCells[row.id];
        return edits ? { ...row, ...edits } : row;
      })
    );
    setEditedCells((prev) => {
      const { [rowId]: deleted, ...rest } = prev;
      return rest; // Remove the rowId entry from editedCells
    });
  };

  const debouncedHandleBlur = useCallback(
    debounce((rowId, field) => {
      handleBlur(rowId, field);
    }, 300), // Adjust debounce time as needed
    []
  );
  const renderHeader = () => {
    return (
      <>
        {/* First header row (top-level and parent columns) */}
        <tr>
          {columns.map((column, index) => {
            const isFirstColumn = index === 0;
            const isLastColumn = index === columns.length - 1;

            if (column.children) {
              return (
                <th
                  key={column.field}
                  colSpan={column.children.length}
                  style={{
                    width: column.width || 200,
                    fontSize: 13,
                    textAlign: column.align || "left",
                    backgroundColor: "rgba(240, 240, 240, 1)",
                    whiteSpace: "normal", // use whiteSpace instead of textWrap
                  }}
                >
                  {column.name}
                </th>
              );
            }

            return (
              <th
                key={column.field}
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
                  whiteSpace: "normal",
                }}
              >
                {column.name}
              </th>
            );
          })}
        </tr>

        {/* Second header row (only children) */}
        <tr>
          {columns
            .filter((h) => h.children)
            .flatMap((h) => h.children)
            .map((child) => (
              <th
                key={child.field}
                align="center"
                style={{
                  fontSize: 13,
                  textAlign: child.align || "center",
                  backgroundColor: "rgba(240, 240, 240, 1)",
                  zIndex: 1,
                  textWrap: "wrap",
                }}
              >
                {child.name}
              </th>
            ))}
        </tr>
      </>
    );
  };
  const renderCell = (header, row) => {
    const value = row[header.field];

    if (header.inputType === "dropdown") {
      return (
        <Autocomplete
          options={header.options || []}
          getOptionLabel={(option) => option?.name || "-"}
          value={value || null}
          onChange={(e, newVal) => {
            // your onChange logic
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      );
    }

    if (header.inputType === "input") {
      const editedValue =
        editedCells?.[row.id]?.[header.field] ?? row[header.field] ?? "";
      return (
        <InputComponent
          value={editedValue}
          onChange={(e) => {
            handleCellEdit(row.id, header.field, e.target.value);
          }}
          onBlur={() => debouncedHandleBlur(row.id, header.field)} // Apply edits on blur
          fullWidth
        />
      );
    }

    return header.render ? (
      header.render(row)
    ) : (
      <Typography>{value ?? "-"}</Typography>
    );
  };

  const lastColumnWidth = columns[columns.length - 1]?.width || "144px";

  return (
    <Box sx={{ width: "100%", overflow: "auto" }}>
      {console.log("re-render")}
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
            ...(stickSecond && {
              "& tr > *:nth-child(2)": {
                position: "sticky",
                zIndex: 9,
                left: columns[0]?.width, // Adjust to match the width of first column
                boxShadow: "1px 0 var(--TableCell-borderColor)",
                bgcolor: "background.surface",
              },
            }),

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
          {data?.length !== 0 ? <thead>{renderHeader()}</thead> : ""}

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
                      height="80"
                      width="80"
                      color="#4fa94d"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  </Box>
                </td>
              </tr>
            ) : data?.length > 0 ? (
              data.map((row) => (
                <tr key={row.id}>
                  {childHeaders.map((header) => (
                    <td key={header.field} align="center">
                      {renderCell(header, row)}
                    </td>
                  ))}
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
                      height: "200px",
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
      {/* {data?.length >= pageSize && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          totalRows={data?.length}
        />
      )} */}
    </Box>
  );
};

export default PPMPTable;
