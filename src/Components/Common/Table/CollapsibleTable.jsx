import * as React from "react";
import PropTypes from "prop-types";
import { Sheet, Table, Typography, IconButton, Box } from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { grey, red } from "@mui/material/colors";

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
  openIndex,
  setOpenIndex,
}) {
  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

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
          "--TableCell-headBackground": "#E5E5E5",
          "--TableCell-paddingY": "13px",
          "--TableCell-borderColor": grey[200],
        }}
        hoverRow
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.id}
                style={{ textAlign: col.align || "left", width: col.width }}
              >
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
              open={openIndex === index}
              onToggle={() => handleToggle(index)}
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

function ExpandableRow({ row, columns, renderExpanded, open, onToggle }) {
  return (
    <React.Fragment>
      <tr
        onClick={onToggle}
        style={{
          cursor: "pointer",
          transition: "border-bottom .2s",
          "--TableCell-borderColor": open && "transparent",
        }}
      >
        {columns.map((col) => (
          <td
            key={col.id}
            style={{
              textAlign: col.align || "left",
              width: col.width,
              backgroundColor: open ? grey[100] : "",
            }}
          >
            {col.render ? col.render(row, open, onToggle) : row[col.id]}
          </td>
        ))}
      </tr>

      <tr>
        <td style={{ height: 0, padding: 0 }} colSpan={columns.length}>
          <Box
            sx={{
              maxHeight: open ? "600px" : "0px",
              opacity: open ? 1 : 0,

              overflow: "hidden",
              transition: "max-height .35s ease, opacity .25s ease",
              backgroundColor: grey[100],
            }}
          >
            <Box sx={{ p: open ? 1.5 : 0, transition: "padding .3s ease" }}>
              {renderExpanded(row)}
            </Box>
          </Box>
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
