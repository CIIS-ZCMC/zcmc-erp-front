import {
  Autocomplete,
  Box,
  Divider,
  Sheet,
  Stack,
  Table,
  Typography,
} from "@mui/joy";
import { memo, useEffect, useRef, useState } from "react";
import NoResultComponent from "../../../Components/Common/Table/NoResultComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import { ThreeDots } from "react-loader-spinner";
import { flattenColumns } from "../../../Utils/FlattenColumns";
import usePPMPHook from "../../../Hooks/PPMP/PPMPHook";
import useItemsHook from "../../../Hooks/ItemsHook";
import { ppmpHeaders } from "../../../Data/Columns";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import PaginationComponent from "../../../Components/Common/Table/PaginationComponent";
import AlertDialogComponent from "../../../Components/Common/Dialog/AlertDialogComponent";
import useModalHook from "../../../Hooks/ModalHook";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import ConfirmationModal from "../../../Components/Common/Dialog/ConfirmationModal";
import PageLoader from "../../../Components/Loading/PageLoader";
import { ThreeDotsLoader } from "../../../Components/Common/Loading/ThreeDotsLoader";
import { InfoIcon } from "lucide-react";

const PPMPTable = memo(
  ({
    stickLast = true,
    stickSecond = true,
    stripe = true,
    items = [],
    modes = [],
    categories = [],
    classifications = [],
    openDel,
    setOpenDel,
    setOpensave,
    id,
    setSelectedID,
    loading,
    setLoading,
    isEditing,
    setIsEditing,
    reloadFlag,
  }) => {
    const { removeItem, search } = usePPMPHook();
    const {
      setAlertDialog,
      setConfirmationModal,
      closeConfirmation,
      closeAlertDialog,
    } = useModalHook();
    // const { items, getItems } = useItemsHook();

    const [ppmpTable, setPPMPTable] = useState([]);

    const [btnLoad, setBtnLoad] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const [selectedClass, setSelectedClass] = useState({});
    const [selectedCat, setSelectedCat] = useState({});
    const [editedCell, setEditedCell] = useState({ rowId: null, field: null });
    const [pin, setPin] = useState("");

    //HANDLEOPEN
    const handleOpenDel = (params) => {
      setSelectedID(params.id);
      setOpensave(false);
      setOpenDel(true);
      const data = {
        status: "error",
        title: ` Are you sure you want to delete item ${params?.item?.code}?`,
        description:
          "The selected item will be removed from the table. Please input authorization pin to proceed.",
      };

      setConfirmationModal(data);
    };

    //COLUMN HEADER
    const columns = ppmpHeaders(handleOpenDel, items, modes, isEditing);
    const childHeaders = flattenColumns(columns);

    //FILTER
    const filteredTable = ppmpTable?.filter((item) => {
      const matchesClass =
        !selectedClass?.name || item?.classification === selectedClass?.name;
      const matchesCat =
        !selectedCat?.name || item?.category === selectedCat?.name;
      return matchesClass && matchesCat;
    });
    const handleClear = () => {
      setSelectedCat({});
      setSelectedClass({});
    };

    //PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const paginatedData = filteredTable.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
    const totalPages = Math.ceil(filteredTable.length / pageSize);

    const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
      if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    //DELETE ITEM
    const handleDeleteRow = async () => {
      try {
        setBtnLoad(true);

        const formData = new FormData();
        formData.append("pin", pin);

        const result = await new Promise((resolve) => {
          removeItem(formData, (status, message) =>
            resolve({ status, message })
          );
        });

        const { status, message } = result;

        if (status === 200) {
          const updated = ppmpTable?.filter((row) => row.id !== id);
          setPPMPTable(updated);
          localStorage.setItem("ppmp-items", JSON.stringify(updated));
          setAlertDialog({
            status: "success",
            title: message,
            description: message,
          });
          setSelectedID(null);
          setOpenDel(false);
          closeConfirmation();
        } else {
          setAlertDialog({
            status: "error",
            title: message,
            description: message,
          });
        }
      } catch (err) {
        setAlertDialog({
          status: "error",
          title: "Unexpected error",
          description: "Something went wrong. Please try again.",
        });
      } finally {
        setBtnLoad(false);
      }
    };

    //CHANGES IN TABLE
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
          const newQuarterValue = parseInt(newValue) || 0;

          const updatedTargets = {
            ...row.target_by_quarter,
            [fieldName]: newQuarterValue,
          };

          const newQuantity = calculateQuantity(updatedTargets);

          // if (row.aop_quantity && newQuantity > row.aop_quantity) {
          //   const data = {
          //     status: "error",
          //     title: "Exceeded quantity",
          //     description: `Total quantity (${newQuantity}) exceeds AOP quantity (${row.aop_quantity}).`,
          //   };
          //   setAlertDialog(data);
          //   return; // Stop further updates if invalid
          // }

          updatedRow.target_by_quarter = updatedTargets;
          updatedRow.quantity = newQuantity;
          updatedRow.total_amount =
            newQuantity * (parseFloat(updatedRow.estimated_budget) || 0);
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

    //SEARCH
    const handleSearch = async () => {
      if (searchVal) {
        await search(searchVal, (status, message, data) => {
          const currentPPMP = localStorage.getItem("ppmp-items");
          localStorage.setItem("ppmp-edits", currentPPMP);
          localStorage.setItem("search-value", searchVal); // Save searchVal
          if (data?.ppmp_items.length > 0) {
            setPPMPTable(data?.ppmp_items);
            localStorage.setItem(
              "ppmp-items",
              JSON.stringify(data?.ppmp_items)
            );
          } else {
            const data = {
              status: "error",
              title: `Item ${searchVal} not found.`,
              description: "",
            };
            setAlertDialog(data);
          }
        });
      } else {
        const data = {
          status: "error",
          title: `Invalid search value`,
          description: "Please input first a search value.",
        };
        setAlertDialog(data);
      }
    };

    //CLEAR SEARCH
    const handleResetSearch = async () => {
      setSearchVal("");
      localStorage.removeItem("search-value");

      setLoading(true);
      setTimeout(() => {
        const ppmp_items_raw = localStorage.getItem("ppmp-edits");
        const ppmp_items = JSON.parse(ppmp_items_raw || "[]"); // safely parse

        setPPMPTable(ppmp_items);
        localStorage.setItem("ppmp-items", JSON.stringify(ppmp_items));
        setLoading(false);
      }, 300);
    };

    //RENDER TABLE HEADER
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
                      width: column.width || 100,
                      fontSize: 12,
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
                    fontSize: 12,
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
                    width: child.width,
                    fontSize: 12,
                    textAlign: child.align,
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

    //RENDER TABLE CELL
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
            />
          );
        }
      }

      return header.render ? (
        header.render(row)
      ) : (
        <Typography fontSize={12}>{value ?? "-"}</Typography>
      );
    };

    const lastColumnWidth = columns[columns.length - 1]?.width || "144px";

    //USEEFFECT
    useEffect(() => {
      setLoading(true); // start loading
      const storedItems = localStorage.getItem("ppmp-items");
      if (storedItems) {
        setPPMPTable(JSON.parse(storedItems));
      }
      setLoading(false); // finish loading
    }, [reloadFlag]);

    useEffect(() => {
      const storedSearch = localStorage.getItem("search-value");
      if (storedSearch) {
        setSearchVal(storedSearch);
      }
    }, []);

    return (
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Stack direction="row" mb={2} justifyContent="space-between">
          <Stack direction="row" alignItems="flex-end" gap={1}>
            <InputComponent
              label="Search"
              placeholder="Search for an item"
              width="auto"
              value={searchVal}
              setValue={setSearchVal}
            />
            <ButtonComponent label="Search" onClick={() => handleSearch()} />
            <ButtonComponent
              variant="outlined"
              label="Clear search"
              onClick={() => handleResetSearch()}
            />
          </Stack>
          <Stack direction="row" gap={1} alignItems="flex-end">
            <AutocompleteComponent
              label={"Filter by classification"}
              placeholder={"Select classification"}
              size="md"
              options={classifications}
              getOptionLabel={(option) => option.name || ""}
              value={
                classifications?.find((el) => el.id === selectedClass?.id) ||
                null
              }
              setValue={setSelectedClass}
            />
            <AutocompleteComponent
              label={"Filter by category"}
              placeholder={"Select category"}
              size="md"
              options={categories}
              getOptionLabel={(option) => option.name || ""}
              value={
                categories?.find((el) => el.id === selectedCat?.id) || null
              }
              setValue={setSelectedCat}
            />
            <ButtonComponent
              label={"Clear filters"}
              variant="plain"
              width="100%"
              onClick={() => handleClear()}
            />
          </Stack>
        </Stack>

        <Sheet
          variant="outlined"
          sx={() => ({
            "--TableCell-height": "40px",
            "--TableHeader-height": "calc(1 * var(--TableCell-height))",
            "--Table-firstColumnWidth": columns[0]?.width, //set the width of the first column in px
            "--Table-lastColumnWidth": lastColumnWidth, //set the width of the first column in px
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
                  zIndex: 10,
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
            {filteredTable?.length !== 0 ? <thead>{renderHeader()}</thead> : ""}

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns?.length} style={{ padding: 0 }}>
                    <ThreeDotsLoader />
                  </td>
                </tr>
              ) : filteredTable?.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id}>
                    {childHeaders.map((header) => {
                      return (
                        <td
                          key={header.field}
                          align={header.align}
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
        {ppmpTable?.length >= pageSize && (
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            totalRows={ppmpTable?.length}
          />
        )}

        {openDel && (
          <ConfirmationModalComponent
            withAuthPin={true}
            leftButtonLabel="Cancel"
            leftButtonAction={() => {
              setOpenDel(false);
              closeConfirmation();
            }}
            rightButtonLabel="Proceed"
            rightButtonAction={() => handleDeleteRow()}
            setAuthPin={setPin}
            isLoading={btnLoad}
          />
        )}

        <AlertDialogComponent />
      </Box>
    );
  }
);

export default PPMPTable;
