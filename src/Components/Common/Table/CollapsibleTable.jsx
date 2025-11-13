import * as React from "react";
import PropTypes from "prop-types";
import { Sheet, Table, Typography, IconButton, Box } from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { grey } from "@mui/material/colors";

/**
 * ExpandableTable Component
 *
 * @param {Array} columns - Columns definition [{ id, label, align }]
 * @param {Array} rows - Data array
 * @param {Function} renderExpanded - Function(row) => JSX to show when expanded
 * @param {number} initialOpenRowIndex - Optional index to open by default
 */
export default function CollapsibleTable({
  columns,
  rows,
  renderExpanded,
  initialOpenRowIndex = null,
}) {
  return (
    <Sheet
      sx={{
        borderRadius: "md",
        overflow: "hidden",
      }}
    >
      <Table
        aria-label="collapsible table"
        sx={{
          "& thead th": { fontWeight: 600 },
          "--TableCell-headBackground": "#E5E5E5",

          "& tbody tr": {
            transition: "background-color 0.2s ease",
          },
          "--TableCell-paddingY": "13px",
        }}
        hoverRow
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.id} style={{ textAlign: col.align || "left" }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <ExpandableRow
              key={index}
              row={row}
              columns={columns}
              renderExpanded={renderExpanded}
              initialOpen={index === initialOpenRowIndex}
            />
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}

CollapsibleTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  renderExpanded: PropTypes.func.isRequired,
  initialOpenRowIndex: PropTypes.number,
};

/* ------------------------------------------------------------------ */

function ExpandableRow({ row, columns, renderExpanded, initialOpen }) {
  const [open, setOpen] = React.useState(initialOpen || false);
  const toggleRow = () => setOpen((prev) => !prev);

  return (
    <React.Fragment>
      <tr
        onClick={toggleRow}
        style={{
          cursor: "pointer",
        }}
      >
        {columns.map((col) => (
          <td
            key={col.id}
            style={{
              textAlign: col.align || "left",
              backgroundColor: open ? grey[100] : "",
            }}
          >
            {col.render ? col.render(row) : row[col.id]}
          </td>
        ))}
      </tr>

      <tr>
        <td style={{ height: 0, padding: 0 }} colSpan={columns.length}>
          {open && (
            <Sheet
              sx={{
                p: 1.5,

                backgroundColor: grey[100],
              }}
            >
              {renderExpanded(row)}
            </Sheet>
          )}
        </td>
      </tr>
    </React.Fragment>
  );
}

ExpandableRow.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  renderExpanded: PropTypes.func.isRequired,
  initialOpen: PropTypes.bool,
};
