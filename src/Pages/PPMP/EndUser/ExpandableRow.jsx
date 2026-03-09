import * as React from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Box,
  Tabs,
  TabList,
  Tab,
  ListItemDecorator,
  TabPanel,
  Stack,
} from "@mui/joy";
import { blue, grey, orange, red } from "@mui/material/colors";
import {
  CancelOutlined,
  ExtensionOutlined,
  InfoOutline,
  TextSnippetOutlined,
  TodayOutlined,
} from "@mui/icons-material";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import ProcurementSchedule from "./ProcurementSchedule";
import InputComponent from "@Components/Form/InputComponent";
import usePPMPHook, {
  usePPMP,
  usePPMPActions,
} from "../../../Hooks/PPMP/PPMPHook";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import defaultItem from "../../../assets/item.jpg";
import formattedPrice from "../../../Utils/formattedPrice";
import ProcurementTimeline from "./ProcurementTimeline";
import TextareaComponent from "@Components/Form/TextareaComponent";
import ItemCardComponent from "@Components/Resources/ItemCardComponent";
import ItemRowComponent from "@Components/Resources/ItemRowComponent";

const ExpandableRowComponent = ({
  row,
  columns,
  editing,
  onEditToggle,
  open,
  onToggle,
  onGetUpdatedData,
  onRemoveActivity,
  onDeletePPMP,
  lockedRows,
  userId,
  isLocked,
}) => {
  const { setAlertDialog } = useModalHook();
  const { modes, activities } = usePPMP();
  const { getProcModes, getActivities } = usePPMPActions();
  const [procurementMode, setProcurementMode] = React.useState(
    row?.procurement_mode || null,
  );
  const [activity, setActivity] = React.useState(null);
  const [linkedActivities, setLinkedActivities] = React.useState(
    row?.activities || [],
  );
  const [scheduleData, setScheduleData] = React.useState(
    row?.target_by_month || {},
  );
  const [procTimeline, setProcTimeline] = React.useState(
    row?.ppmp_item_timeline || {},
  );
  const [itemRemarks, setItemRemarks] = React.useState(row?.item_remarks || "");
  const { showSnack } = useSnackbarHook();
  const { timelineDates } = usePPMP();

  // Fetch modes & activities once
  React.useEffect(() => {
    getProcModes((status, message) => {
      if (status !== 200) console.error("Failed to fetch items:", message);
    });
    getActivities((status, message) => {
      if (status !== 200) console.error("Failed to fetch items:", message);
    });
  }, []);

  // Keep linkedActivities in sync with row.activities
  React.useEffect(() => {
    if (row?.activities) setLinkedActivities(row.activities);
  }, [row.activities]);

  // Memoized values
  const totalQuantity = React.useMemo(
    () =>
      linkedActivities.reduce(
        (sum, act) => sum + (Number(act.resources_quantity) || 0),
        0,
      ),
    [linkedActivities],
  );

  const unit = React.useMemo(() => row?.item?.item_unit?.name || "", [row]);

  const getUpdatedData = React.useMemo(
    () => () => ({
      procurement_mode_id: procurementMode?.id || null,
      schedule: scheduleData,
      quantity: totalQuantity,
      activity_quantities: linkedActivities.map((act) => ({
        activity_id: act.activity_id,
        quantity: Number(act.resources_quantity) || 0,
      })),
      ppmp_item_timeline: procTimeline,
      item_remarks: itemRemarks,
    }),
    [
      procurementMode,
      scheduleData,
      linkedActivities,
      totalQuantity,
      procTimeline,
      itemRemarks,
    ],
  );

  React.useEffect(() => {
    if (onGetUpdatedData) onGetUpdatedData(row.id, getUpdatedData);
  }, [getUpdatedData]);

  const handleAddActivity = (selected) => {
    if (!selected) return;

    const exists = linkedActivities.some(
      (a) => a.activity_code === selected.activity_code,
    );
    if (exists) {
      showSnack(500, "Activity has already been selected.");
      return;
    }

    const newAct = {
      ...selected,
      resources_quantity: 1,
      total_amount: row?.item?.estimated_budget,
      unit: selected.unit || "",
    };

    setLinkedActivities((prev) => [newAct, ...prev]);
    setActivity(null);
  };

  const handleDeleteActivity = async (id, actID) => {
    if (linkedActivities.length <= 1) {
      setAlertDialog({
        status: "danger",
        title: "Cannot remove the last remaining activity.",
        isGlobal: false,
        description: "PPMP Item must have at least one activity.",
      });
      return;
    }
    await onRemoveActivity(id, actID, (status, message) => {
      showSnack(status === 200 ? 200 : 500, message);
    });
  };

  const handleQuantityChange = (activityCode, value) => {
    const qty = Number(value) || 0;
    setLinkedActivities((prev) =>
      prev.map((item) =>
        item.activity_code === activityCode
          ? { ...item, resources_quantity: qty }
          : item,
      ),
    );
  };

  // Memoized render of linked activities to avoid re-rendering when not needed
  const renderedActivities = React.useMemo(
    () =>
      linkedActivities?.length > 0 ? (
        linkedActivities.map((act, index) => (
          <BoxComponent
            bgColor={"#F5F5F4"}
            p={1}
            key={index}
            mb={1}
            display="flex"
            justifyContent="space-between"
          >
            <Stack
              direction={"row"}
              width={"100%"}
              spacing={2}
              alignItems={"center"}
            >
              <Stack>
                <ChipComponent
                  label={act.activity_code}
                  color={"primary"}
                  fontSize={11}
                />
              </Stack>
              <Stack>
                <Stack
                  direction={editing && "row"}
                  justifyContent={editing && "space-between"}
                  alignItems={editing && "center"}
                >
                  <Typography level="body-sm" fontWeight={600}>
                    {act.activity_name}
                  </Typography>
                </Stack>
                <Stack direction={"row"} alignItems={"flex-end"} spacing={1}>
                  {editing ? (
                    <InputComponent
                      type="number"
                      width="30%"
                      size="sm"
                      value={act.resources_quantity}
                      onChange={(e) =>
                        handleQuantityChange(act.activity_code, e.target.value)
                      }
                      disabled={isLocked}
                    />
                  ) : (
                    <Typography level="body-sm">{`${act.resources_quantity} ${act.unit}(s)`}</Typography>
                  )}
                  <Typography>
                    • {formattedPrice(row?.item?.estimated_budget)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack>
              {editing && (
                <IconButtonComponent
                  icon={<CancelOutlined sx={{ fontSize: 15 }} />}
                  onClick={() => handleDeleteActivity(row.id, act.activity_id)}
                  size={"xs"}
                />
              )}
            </Stack>
          </BoxComponent>
        ))
      ) : (
        <Typography level="body-md">No activities found.</Typography>
      ),
    [linkedActivities, editing, row],
  );

  return (
    <>
      <Box
        sx={{
          maxHeight: "800px",
          opacity: 1,
          overflow: "hidden",
          transition: "max-height .35s ease, opacity .25s ease",
          backgroundColor: grey[50],
          p: 1,
        }}
      >
        {editing && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: red[50],
              p: 0.5,
              mb: 1,
            }}
          >
            <Typography
              level="body-sm"
              sx={{ color: red[800], fontWeight: 500 }}
            >
              You are in editing mode. Click the save button (✓) to save
              changes.
            </Typography>
          </Box>
        )}

        <Tabs defaultValue="a" sx={{ bgcolor: grey[50] }} variant="soft">
          <TabList>
            <Tab
              value="a"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: blue[50],
                  color: blue[800],
                },
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <ListItemDecorator>
                <TextSnippetOutlined />
              </ListItemDecorator>
              Item Information
            </Tab>
            <Tab
              value="b"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: blue[50],
                  color: blue[800],
                },
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <ListItemDecorator>
                <ExtensionOutlined />
              </ListItemDecorator>
              Linked Activities{" "}
            </Tab>
            <Tab
              value="c"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: blue[50],
                  color: blue[800],
                },
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <ListItemDecorator>
                <TodayOutlined />
              </ListItemDecorator>
              Procurement Schedule
            </Tab>
          </TabList>

          <TabPanel value="a">
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BoxComponent p={2} width={350} height={250} overflow="hidden">
                <ItemRowComponent
                  item={row?.item}
                  withContent={false}
                  minHeight={250}
                />
              </BoxComponent>

              <BoxComponent p={2} width={550} height={250}>
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

                  <Stack spacing={1}>
                    <Typography level="body-sm">Mode of Procurement</Typography>
                    {editing ? (
                      <AutocompleteComponent
                        label="Procurement Mode"
                        options={modes}
                        value={procurementMode}
                        getOptionLabel={(option) => option.name}
                        handleSelect={setProcurementMode}
                        color="danger"
                      />
                    ) : row?.procurement_mode ? (
                      <Stack direction={"column"} gap={2}>
                        <ChipComponent
                          label={row?.procurement_mode?.name}
                          sx={{ color: "#7008E7", bgcolor: "#DDD6FF" }}
                          size="md"
                        />
                        <Typography
                          level="body-sm"
                          startDecorator={<InfoOutline />}
                          gap={0.3}
                        >
                          Pre-Procurement Conference:{"  "}
                          <b>
                            {row?.pre_procurement_conference ? " YES " : " NO "}
                          </b>
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography level="body-sm" color="danger">
                        No Mode of Procurement Yet.{" "}
                        <i>Edit Resource to update.</i>
                      </Typography>
                    )}
                  </Stack>

                  <Stack spacing={0.5}>
                    <Typography level="body-sm">Specifications</Typography>
                    {row?.item?.item_specifications?.length > 0 ? (
                      row?.item?.item_specifications?.map((spec, index) => (
                        <Typography
                          key={index}
                          level="body-sm"
                          sx={{ color: "black" }}
                        >
                          ● {spec?.description}
                        </Typography>
                      ))
                    ) : (
                      <Typography level="body-md">
                        No specifications provided.
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </BoxComponent>
              <BoxComponent p={2} width={410} height={250}>
                <Typography
                  startDecorator={
                    <TextSnippetOutlined
                      sx={{ color: blue[800], fontSize: 20 }}
                    />
                  }
                  level="title-md"
                  mb={2}
                >
                  Remarks
                </Typography>

                {editing ? (
                  <TextareaComponent
                    color={"danger"}
                    value={itemRemarks}
                    setValue={setItemRemarks}
                    placeholder={"Add your remarks here..."}
                  />
                ) : (
                  <Typography level="body-sm" sx={{ color: "black" }}>
                    {row?.item_remarks || "No remarks provided."}
                  </Typography>
                )}
              </BoxComponent>
            </Box>
          </TabPanel>
          <TabPanel value="b">
            <Stack direction={"row"} gap={2}>
              <BoxComponent p={2} width={500} height={250} overflow="hidden">
                <ItemRowComponent
                  item={row?.item}
                  withContent={false}
                  minHeight={250}
                />
              </BoxComponent>
              <BoxComponent p={2} width={"100%"} height={250}>
                <Stack height={"100%"} spacing={1}>
                  <Typography
                    fontWeight={600}
                    startDecorator={
                      <ExtensionOutlined
                        style={{ color: orange[800], fontSize: 20 }}
                      />
                    }
                  >
                    Linked Activities ({linkedActivities?.length})
                  </Typography>
                  {editing && (
                    <Box
                      sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        backgroundColor: "white",
                        pb: 1,
                      }}
                    >
                      <AutocompleteComponent
                        label="Select an activity"
                        options={activities}
                        value={activity}
                        getOptionLabel={(option) => option.activity_code}
                        handleSelect={handleAddActivity}
                        color="danger"
                        disabled={isLocked}
                      />
                    </Box>
                  )}
                  <Box sx={{ flex: 1, overflowY: "auto" }}>
                    {renderedActivities}
                  </Box>
                  <Typography textAlign={"right"} level="body-sm">
                    Total: {totalQuantity}{" "}
                    <b>
                      {unit}
                      {totalQuantity > 1 ? "s" : ""}
                    </b>
                  </Typography>
                </Stack>
              </BoxComponent>
            </Stack>
          </TabPanel>
          <TabPanel value="c">
            <Stack direction={"row"} width={"100%"} gap={2}>
              <BoxComponent width="30%" borderRadius={20}>
                <ProcurementTimeline
                  timelines={timelineDates}
                  onChange={setProcTimeline}
                  value={procTimeline}
                  editing={editing}
                />
              </BoxComponent>
              <BoxComponent
                bgColor={"white"}
                p={2}
                borderRadius={20}
                width="70%"
              >
                <ProcurementSchedule
                  editing={editing}
                  value={scheduleData}
                  onChange={setScheduleData}
                />
              </BoxComponent>
            </Stack>
          </TabPanel>
        </Tabs>
      </Box>
    </>
  );
};

// Wrap in React.memo to avoid unnecessary re-renders
export const ExpandableRow = React.memo(
  ExpandableRowComponent,
  (prev, next) =>
    prev.row === next.row &&
    prev.open === next.open &&
    prev.editing === next.editing,
);

ExpandableRow.propTypes = {
  row: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  editing: PropTypes.bool,
  onEditToggle: PropTypes.func,
  open: PropTypes.bool,
  onToggle: PropTypes.func,
  onGetUpdatedData: PropTypes.func,
  onRemoveActivity: PropTypes.func,
  onDeletePPMP: PropTypes.func,
  timelines: PropTypes.object,
};
