import * as React from "react";
import PropTypes from "prop-types";
import {
  Sheet,
  Table,
  Typography,
  IconButton,
  Box,
  Tabs,
  TabList,
  Tab,
  ListItemDecorator,
  TabPanel,
  Stack,
} from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { blue, grey, orange, red } from "@mui/material/colors";
import {
  ExtensionOutlined,
  TextSnippetOutlined,
  TodayOutlined,
} from "@mui/icons-material";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import ProcurementSchedule from "./ProcurementSchedule";
import InputComponent from "@Components/Form/InputComponent";

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
  initialOpenRowIndex = null,
  editingRows,
  onEditToggle,
}) {
  const [openIndex, setOpenIndex] = React.useState(null);

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
              editing={editingRows?.[row.id]}
              onEditToggle={onEditToggle}
              open={openIndex === index}
              onToggle={(forceState) => {
                if (forceState === true) setOpenIndex(index); // expand
                else if (forceState === false) setOpenIndex(null); // collapse
                else handleToggle(index); // normal click
              }}
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

function ExpandableRow({
  row,
  columns,
  editing,
  onEditToggle,
  open,
  onToggle,
}) {
  const totalQuantity = row?.activities?.reduce(
    (sum, act) => sum + (Number(act.resources_quantity) || 0),
    0
  );

  const unit = row?.activities?.[0]?.unit || "";
  return (
    <React.Fragment>
      <tr
        onClick={() => onToggle()}
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
            {col.render
              ? col.render(row, open, onToggle, onEditToggle)
              : row[col.id]}
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
              <React.Fragment>
                <Tabs defaultValue="a" sx={{ bgcolor: grey[100] }}>
                  <TabList>
                    <Tab value="a">
                      <ListItemDecorator>
                        <TextSnippetOutlined />
                      </ListItemDecorator>
                      Item Information
                    </Tab>
                    <Tab value="b">
                      <ListItemDecorator>
                        <TodayOutlined />
                      </ListItemDecorator>
                      Procurement Schedule
                    </Tab>
                  </TabList>
                  <TabPanel value="a">
                    <Box
                      sx={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(380px, 1fr))",
                        gap: 2,
                      }}
                    >
                      <BoxComponent p={2}>
                        {" "}
                        {/* Set a fixed height or responsive height */}
                        <img
                          src="https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286"
                          srcSet="https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286&dpr=2 2x"
                          loading="lazy"
                          alt=""
                          style={{
                            width: "100%", // Fill the width of the container
                            height: "100%", // Fill the height of the container
                            objectFit: "cover", // Maintain aspect ratio, crop if necessary
                            borderRadius: 10,
                            display: "block", // Remove default inline spacing
                          }}
                        />
                      </BoxComponent>

                      <BoxComponent p={2}>
                        <Stack spacing={2}>
                          <Typography
                            fontWeight={600}
                            startDecorator={
                              <TextSnippetOutlined
                                style={{ color: blue[800], fontSize: 20 }}
                              />
                            }
                          >
                            Item Information
                          </Typography>
                          {console.log(editing)}
                          <Stack spacing={1}>
                            <Typography level="body-sm">
                              Mode of Procurement
                            </Typography>
                            {editing ? (
                              // EDIT MODE → Always show the Autocomplete
                              <AutocompleteComponent
                                placeholder="Select Procurement Mode"
                                color="danger"
                              />
                            ) : row?.item?.procurement_mode ? (
                              // VIEW MODE → Show chip if procurement_mode exists
                              <ChipComponent
                                label={row.item.procurement_mode}
                                sx={{ color: "#7008E7", bgcolor: "#DDD6FF" }}
                                size="md"
                              />
                            ) : (
                              // VIEW MODE → No procurement_mode
                              <Typography level="body-sm" color="danger">
                                No Mode of Procurement Yet.{" "}
                                <i>Edit Resource to update.</i>
                              </Typography>
                            )}
                          </Stack>
                          <Stack spacing={0.5}>
                            <Typography level="body-sm">
                              Specifications
                            </Typography>
                            {row.item.item_specifications.length > 0 ? (
                              row.item.item_specifications.map(
                                (spec, index) => (
                                  <Typography
                                    key={index}
                                    level="body-sm"
                                    alignItems="center"
                                    sx={{ color: "black" }}
                                  >
                                    ● {spec.description}
                                  </Typography>
                                )
                              )
                            ) : (
                              <Typography level="body-md">
                                No specifications provided.
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                      </BoxComponent>
                      <BoxComponent p={2}>
                        <Stack>
                          <Typography
                            fontWeight={600}
                            startDecorator={
                              <ExtensionOutlined
                                style={{ color: orange[800], fontSize: 20 }}
                              />
                            }
                          >
                            Linked Activities ({row.activities.length})
                          </Typography>

                          <Stack
                            mt={2}
                            spacing={1}
                            height={"230px"}
                            overflow={"auto"}
                          >
                            {editing && (
                              <AutocompleteComponent
                                label={"Select/Search Activities"}
                                color="danger"
                              />
                            )}
                            {row?.activities?.length > 0 ? (
                              row?.activities?.map((act, index) => (
                                <BoxComponent
                                  bgColor={"#F5F5F4"}
                                  p={2}
                                  key={index}
                                >
                                  <Stack
                                    direction={"row"}
                                    width={"100%"}
                                    spacing={2}
                                    alignItems={"center"}
                                  >
                                    <ChipComponent
                                      label={act.activity_code}
                                      color={"primary"}
                                      fontSize={12}
                                    />
                                    <Stack width={"100%"}>
                                      <Typography
                                        level="body-md"
                                        fontWeight={600}
                                      >
                                        {act.activity_name}
                                      </Typography>

                                      <Stack
                                        direction={"row"}
                                        alignItems={"flex-end"}
                                        spacing={1}
                                      >
                                        {editing ? (
                                          <InputComponent
                                            type={"number"}
                                            width="30%"
                                            size="sm"
                                            value={act.resources_quantity}
                                          />
                                        ) : (
                                          <Typography level="body-sm">
                                            {`${act.resources_quantity} ${act.unit}(s)`}
                                          </Typography>
                                        )}

                                        <Typography>
                                          {`• ₱
${act.total_amount.toLocaleString("en-PH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})} `}{" "}
                                        </Typography>
                                      </Stack>
                                    </Stack>
                                  </Stack>
                                </BoxComponent>
                              ))
                            ) : (
                              <Typography level="body-md">
                                No activities found.
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                        <Typography textAlign={"right"} level="body-sm" mt={2}>
                          Total: {totalQuantity}{" "}
                          <b>
                            {unit}
                            {totalQuantity > 1 ? "s" : ""}
                          </b>
                        </Typography>
                      </BoxComponent>
                    </Box>
                  </TabPanel>
                  <TabPanel value="b">
                    <BoxComponent bgColor={"white"} p={2}>
                      <ProcurementSchedule />
                    </BoxComponent>
                  </TabPanel>
                </Tabs>
              </React.Fragment>
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
