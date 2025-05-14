import { Autocomplete, Box, Sheet, Table, Typography } from "@mui/joy";
import { memo, useEffect, useState } from "react";
import NoResultComponent from "../../../Components/Common/Table/NoResultComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import { ThreeDots } from "react-loader-spinner";
import { flattenColumns } from "../../../Utils/FlattenColumns";
import usePPMPHook from "../../../Hooks/PPMPHook";
import useItemsHook from "../../../Hooks/ItemsHook";
import { ppmpHeaders } from "../../../Data/Columns";

const PPMPTable = memo(
  ({
    stickLast = true,
    stickSecond = true,
    stripe = true,
    // ppmpTable,
    items,
    // setPPMPTable,
    modes,
  }) => {
    const { ppmp, getPPMPItems, getProcModes } = usePPMPHook();
    // const { items, getItems } = useItemsHook();

    const handleDeleteRow = (id) => {
      setLoading(true);
      setTimeout(() => {
        const updated = ppmpTable.filter((row) => row.id !== id);
        setLoading(false);
        setPPMPTable(updated);
        localStorage.setItem("ppmp-items", JSON.stringify(updated));
      }, 1000);
    };

    const columns = ppmpHeaders(handleDeleteRow, items, modes);

    const [ppmpTable, setPPMPTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editRowId, setEditRowId] = useState(null);
    const [editedCell, setEditedCell] = useState({ rowId: null, field: null });
    const childHeaders = flattenColumns(columns);

    const calculateQuantity = (target) => {
      return Object.values(target).reduce((sum, value) => sum + value, 0);
    };

    const handleFieldChange = (fieldName, newValue, row) => {
      if (!row?.id) return;

      const updatedRow = { ...row };

      if (fieldName === "item") {
        setLoading(true);

        const selected = items.find((item) => item.name === newValue.name);
        if (!selected) {
          console.warn("Selected item not found.");
          return;
        }

        updatedRow.item = selected;
        updatedRow.item_code = selected?.code || "";
        updatedRow.classification = selected?.classification || "";
        updatedRow.category = selected?.category || "";
        updatedRow.unit = selected?.unit || "";
        updatedRow.estimated_budget = selected?.estimated_budget || "";

        setLoading(false);
      } else if (fieldName === "procurement_mode") {
        updatedRow.procurement_mode = newValue;
      } else {
        if (
          [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
          ].includes(fieldName)
        ) {
          updatedRow.target_by_quarter = {
            ...updatedRow.target_by_quarter,
            [fieldName]: parseInt(newValue) || 0,
          };
          updatedRow.quantity = calculateQuantity(updatedRow.target_by_quarter);
          updatedRow.total_amount =
            updatedRow.quantity *
            (parseFloat(updatedRow.estimated_budget) || 0);
        } else if (fieldName === "quantity") {
          updatedRow.quantity = parseFloat(newValue) || 0;
          updatedRow.total_amount =
            updatedRow.quantity *
            (parseFloat(updatedRow.estimated_budget) || 0);
        } else {
          updatedRow[fieldName] = newValue;
        }
      }

      const updatedData = ppmpTable.map((r) =>
        r.id === row.id ? updatedRow : r
      );
      setPPMPTable(updatedData);
      localStorage.setItem("ppmp-items", JSON.stringify(updatedData));
    };

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

    const renderCell = (header, row, isEditing) => {
      const getFieldValue = () => {
        if (
          [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
          ].includes(header.field)
        ) {
          return isEditing
            ? row.target_by_quarter[header.field]
            : row.target_by_quarter[header.field];
        }
        return isEditing ? row[header.field] : row[header.field];
      };

      const value = getFieldValue();

      const handleChange = (field, rowId, newValue) => {
        setEditedCell((prev) => ({ ...prev, rowId, field }));
        handleFieldChange(field, newValue, row);
      };

      if (isEditing) {
        if (header.inputType === "dropdown") {
          return (
            <Autocomplete
              options={header.options || []}
              getOptionLabel={(option) => option?.name || "-"}
              value={value}
              onChange={(e, newValue) =>
                handleChange(header.field, row.id, newValue)
              }
            />
          );
        }
        if (header.inputType === "input") {
          return (
            <InputComponent
              value={value}
              onChange={(e) =>
                handleChange(header.field, row.id, e.target.value)
              }
              onBlur={() => setEditRowId(null)}
            />
          );
        }
      }

      return header.render ? (
        header.render(row)
      ) : (
        <Typography>{value ?? "-"}</Typography>
      );
    };

    const lastColumnWidth = columns[columns.length - 1]?.width || "144px";
    useEffect(() => {
      async function fetchPPMPItemsIfNeeded() {
        setLoading(true);

        const localItems = localStorage.getItem("ppmp-items");

        if (localItems) {
          const parsed = JSON.parse(localItems);
          if (parsed.length > 0) {
            setPPMPTable(parsed);
            setLoading(false);
            return; // ✅ Stop here; no need to fetch
          }
        }

        // No valid localStorage, fetch from API
        try {
          await getPPMPItems((status, message, data) => {
            localStorage.setItem(
              "ppmp-items",
              JSON.stringify(data.data.ppmp_items)
            );
            setPPMPTable(data?.data.ppmp_items);
          });
        } catch (error) {
          console.error("Error fetching ppmp_items:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchPPMPItemsIfNeeded();
    }, []);

    useEffect(() => {
      // localStorage.setItem("ppmp-items", JSON.stringify(ppmp.ppmp_items));
      console.log("tableData updated:", ppmpTable); // Logs tableData after it's updated
    }, [ppmp]);
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
            {ppmpTable?.length !== 0 ? <thead>{renderHeader()}</thead> : ""}

            <tbody>
              {loading ? (
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
              ) : ppmpTable?.length > 0 ? (
                ppmpTable.map((row) => (
                  <tr key={row.id}>
                    {childHeaders.map((header) => {
                      const isEditing =
                        editedCell?.rowId === row.id &&
                        editedCell?.field === header.field;

                      return (
                        <td
                          key={header.field}
                          align="center"
                          onClick={() =>
                            setEditedCell({
                              rowId: row.id,
                              field: header.field,
                            })
                          }
                        >
                          {renderCell(header, row, isEditing)}
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
  }
);

export default PPMPTable;
