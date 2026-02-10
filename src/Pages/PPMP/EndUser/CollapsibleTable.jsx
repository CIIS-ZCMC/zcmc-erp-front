import * as React from "react";
import PropTypes from "prop-types";
import { Sheet, Table } from "@mui/joy";
import { grey } from "@mui/material/colors";
import PaginationComponent from "@Components/Common/Table/PaginationComponent";
import NoResultComponent from "@Components/Common/Table/NoResultComponent";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import { ExpandableRow } from "./ExpandableRow";

export default function CollapsibleTable({
  columns,
  rows,
  initialOpenRowIndex = null,
  editingRows,
  onEditToggle,
  onGetUpdatedData,
  currentPage,
  totalPages,
  totalRows,
  onNextPage,
  onPrevPage,
  onRemoveActivity,
  onDeletePPMP,
  isLoading,
}) {
  const [openIndex, setOpenIndex] = React.useState(initialOpenRowIndex);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Memoize row rendering to avoid rerendering all rows unnecessarily
  const renderedRows = React.useMemo(() => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            style={{ textAlign: "center", padding: "40px 0" }}
          >
            <ThreeDotsLoader />
          </td>
        </tr>
      );
    }

    if (!rows?.length) {
      return (
        <tr>
          <td
            colSpan={columns.length}
            style={{ textAlign: "center", padding: "40px 0" }}
          >
            <NoResultComponent />
          </td>
        </tr>
      );
    }

    return rows.map((row, index) => (
      <ExpandableRow
        key={row.id || index} // prefer row.id if available
        row={row}
        columns={columns}
        editing={editingRows?.[row.id]}
        onEditToggle={onEditToggle}
        open={openIndex === index}
        onToggle={(forceState) => {
          if (forceState === true) setOpenIndex(index);
          else if (forceState === false) setOpenIndex(null);
          else handleToggle(index);
        }}
        onGetUpdatedData={onGetUpdatedData}
        onRemoveActivity={onRemoveActivity}
        onDeletePPMP={onDeletePPMP}
      />
    ));
  }, [
    rows,
    columns,
    editingRows,
    openIndex,
    isLoading,
    onEditToggle,
    onGetUpdatedData,
    onRemoveActivity,
    onDeletePPMP,
  ]);

  return (
    <Sheet sx={{ borderRadius: "md", overflow: "hidden" }}>
      <Table
        aria-label="collapsible table"
        sx={{
          "--TableCell-headBackground": "#E5E5E5",
          "--TableCell-paddingY": "10px",
          "--TableCell-paddingX": "20px",
          "--TableCell-borderColor": grey[200],
        }}
        hoverRow
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                style={{
                  textAlign: col.align || "left",
                  width: col.width,
                  display: col.display && col.display,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderedRows}</tbody>
        <tfoot>
          <tr>
            <td colSpan={columns.length}>
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                onNextPage={onNextPage}
                onPrevPage={onPrevPage}
              />
            </td>
          </tr>
        </tfoot>
      </Table>
    </Sheet>
  );
}

CollapsibleTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  initialOpenRowIndex: PropTypes.number,
  editingRows: PropTypes.object,
  onEditToggle: PropTypes.func,
  onGetUpdatedData: PropTypes.func,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  totalRows: PropTypes.number,
  onNextPage: PropTypes.func,
  onPrevPage: PropTypes.func,
  onRemoveActivity: PropTypes.func,
  onDeletePPMP: PropTypes.func,
  isLoading: PropTypes.bool,
};
