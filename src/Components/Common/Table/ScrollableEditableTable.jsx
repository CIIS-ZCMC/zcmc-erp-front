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
import { useMemo, useState } from "react";
import NoResultComponent from "./NoResultComponent";
import PaginationComponent from "./PaginationComponent";
import InputComponent from "../../Form/InputComponent";

function ScrollableEditableTableComponent({
  stickLast = false,
  stickSecond = false,
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
  onFieldChange,
  options = [],
  nestedOptions = [],
}) {
  // PAGINATION SETUP
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(data);

  const currentData = useMemo(() => {
    const filteredData = search
      ? rows?.filter((item) =>
          fieldsToSearch?.some((field) => {
            const value = item[field]; // Access the field value dynamically
            return (
              typeof value === "string" && // Ensure the value is a string
              value.toLowerCase().includes(search.toLowerCase())
            );
          })
        )
      : rows;

    const totalPages = Math.ceil(filteredData?.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = filteredData?.slice(
      startIndex,
      startIndex + pageSize
    );

    return { paginatedData, totalPages };
  }, [search, rows, pageSize, currentPage, fieldsToSearch]);

  const [editingCell, setEditingCell] = useState({
    rowIndex: null,
    field: null,
  });

  const handleCellClick = (rowIndex, field) => {
    setEditingCell({ rowIndex, field });
  };

  const handleInputChange = (e, rowIndex, field) => {
    const newValue = e.target.value;
    const row = rows[rowIndex];

    console.log(newValue);

    if (onFieldChange) {
      onFieldChange(field, newValue, row, (updatedRow) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex] = updatedRow;
        console.log(updatedRows);
        setRows(updatedRows);
      });
    } else {
      const newRows = [...rows];
      newRows[rowIndex][field] = newValue;
      setRows(newRows);
    }
  };

  const handleAutocompleteChange = (e, rowIndex, field) => {
    const row = rows[rowIndex];
    console.log(e); // Log the selected value from Autocomplete

    if (onFieldChange) {
      onFieldChange(field, e.label, row, (updatedRow) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex] = updatedRow;
        console.log(updatedRows); // Log the updated rows
        setRows(updatedRows);
      });
    } else {
      const newRows = [...rows];
      newRows[rowIndex][field] = e; // Directly update with the new value
      setRows(newRows);
    }
  };

  const handleNestedInputChange = (e, rowIndex, parentField, childField) => {
    const newValue = e.target.value;
    const row = rows[rowIndex];

    if (onFieldChange) {
      onFieldChange(
        `${parentField}.${childField}`,
        newValue,
        row,
        (updatedRow) => {
          const updatedRows = [...rows];
          updatedRows[rowIndex] = updatedRow;
          setRows(updatedRows);
        }
      );
    } else {
      const newRows = [...rows];
      newRows[rowIndex][parentField][childField] = e.target.value;
      setRows(newRows);
    }
  };

  const handleNestedAutocompleteChange = (
    e,
    rowIndex,
    parentField,
    childField
  ) => {
    const row = rows[rowIndex];
    console.log(e); // Log the selected value from Autocomplete

    if (onFieldChange) {
      onFieldChange(
        `${parentField}.${childField}`,
        e.label,
        row,
        (updatedRow) => {
          const updatedRows = [...rows];
          updatedRows[rowIndex] = updatedRow;
          setRows(updatedRows);
        }
      );
    } else {
      const newRows = [...rows];
      newRows[rowIndex][parentField][childField] = e; // Directly update with the new value
      setRows(newRows);
    }
  };

  const handleBlur = () => {
    setEditingCell({ rowIndex: null, field: null });
  };

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
          {paginatedData?.length !== 0 ? (
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
                    <CircularProgress />
                  </Box>
                </td>
              </tr>
            ) : paginatedData?.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => {
                    const isEditing =
                      editingCell.rowIndex === rowIndex &&
                      editingCell.field === column.field;

                    //COLUMN WITH CHILDREN
                    if (column.children) {
                      return column.children.map((child, childIndex) => {
                        const fullField = `${column.field}.${child.field}`;
                        const nestedIsEditing =
                          editingCell.rowIndex === rowIndex &&
                          editingCell.field === fullField;
                        const value = row[column.field]?.[child.field] ?? "";

                        return (
                          <td
                            key={`${colIndex}-${childIndex}`}
                            style={{ textAlign: child.align || column.align }}
                            onClick={() =>
                              setEditingCell({ rowIndex, field: fullField })
                            }
                          >
                            {nestedIsEditing ? (
                              child.inputType === "dropdown" ? (
                                <Autocomplete
                                  autoFocus
                                  value={value}
                                  onChange={(_, event) =>
                                    handleNestedAutocompleteChange(
                                      event,
                                      rowIndex,
                                      column.field,
                                      child.field
                                    )
                                  }
                                  onBlur={handleBlur}
                                  options={nestedOptions}
                                />
                              ) : (
                                <InputComponent
                                  autoFocus
                                  value={value}
                                  onChange={(e) =>
                                    handleNestedInputChange(
                                      e,
                                      rowIndex,
                                      column.field,
                                      child.field
                                    )
                                  }
                                  onBlur={handleBlur}
                                />
                              )
                            ) : (
                              value || "-"
                            )}
                          </td>
                        );
                      });
                    }

                    //NOT COLUMN WITH CHILDREN
                    const value = row[column.field] ?? "";

                    return (
                      <td
                        key={colIndex}
                        style={{ textAlign: column.align }}
                        onClick={() => {
                          if (column.inputType) {
                            handleCellClick(rowIndex, column.field);
                          }
                        }}
                      >
                        {isEditing ? (
                          column.inputType === "dropdown" ? (
                            <Autocomplete
                              autoFocus
                              value={value}
                              onChange={(_, event) =>
                                handleAutocompleteChange(
                                  event,
                                  rowIndex,
                                  column.field
                                )
                              }
                              onBlur={handleBlur}
                              options={options}
                            />
                          ) : (
                            <InputComponent
                              autoFocus
                              value={value}
                              onChange={(e) =>
                                handleInputChange(e, rowIndex, column.field)
                              }
                              onBlur={handleBlur}
                            />
                          )
                        ) : column.render ? (
                          column.render(row)
                        ) : (
                          value || "-"
                        )}
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

export default ScrollableEditableTableComponent;
