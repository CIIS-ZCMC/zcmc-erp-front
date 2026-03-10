import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import {
  usePPMP,
  usePPMPApplicationActions,
} from "../../../Hooks/PPMP/PPMPApplicationHook";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PPMP_APPROVER_HEADERS } from "../../../Data/Columns";
import {
  Box,
  ListItemDecorator,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import PageTitle from "@Components/Common/PageTitle";
import { localStorageGetter } from "../../../Utils/LocalStorage";
import DrawerComponent from "@Components/Common/DrawerComponent";
import CommentContainerComponent from "@Components/Comments/CommentContainerComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import TabComponent from "@Components/Common/TabComponent";
import { PPMP_COLLAPSE } from "../../../Data/constants";
import ProcurementSchedule from "../EndUser/ProcurementSchedule";
import {
  ExpandLess,
  ExpandMore,
  ExtensionOutlined,
  InfoOutline,
  InfoOutlineRounded,
  TextSnippetOutlined,
  TodayOutlined,
} from "@mui/icons-material";
import ChipComponent from "@Components/Common/ChipComponent";
import { blue, grey, orange } from "@mui/material/colors";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import {
  usePPMPComments,
  usePPMPCommentsActions,
} from "../../../Hooks/PPMP/PPMPCommentsHook";
import NoResultComponent from "@Components/Common/Table/NoResultComponent";
import { useDebounce } from "use-debounce";
import CountUp from "react-countup";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import TableComponent from "@Components/Common/Table/TableComponent";
import { useUserTypes } from "../../../Store/AuthStore";
import { ExpandableRow } from "../EndUser/ExpandableRow";
import ItemRowComponent from "@Components/Resources/ItemRowComponent";
import ProcurementTimeline from "../EndUser/ProcurementTimeline";
import formattedPrice from "../../../Utils/formattedPrice";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import { usePPMPActions, usePPMPState } from "../../../Hooks/PPMP/PPMPHook";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import useModalHook from "../../../Hooks/ModalHook";

function ViewPPMP() {
  const { id } = useParams();
  const { type } = useParams();
  const { getPPMPApplicationByID, getSourceOfFunds, updateSourceOfFunds } =
    usePPMPApplicationActions();
  const {
    ppmpApplicationItems,
    ppmpApplication,
    isLoading,
    pagination,
    sourceOfFunds,
  } = usePPMP();

  const navigate = useNavigate();

  const { getPPMPComments, postPPMPComment } = usePPMPCommentsActions();
  const { ppmpComments } = usePPMPComments();

  const AOP_APPLICATION_ID = localStorageGetter("aop_application_id");
  const AREA_CODE = localStorageGetter("aop_application_area_code");
  const FISCAL_YEAR = new Date().getFullYear() + 1;

  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [newComment, setNewComment] = useState("");
  const [fund, setFund] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [localRows, setLocalRows] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [tabCache, setTabCache] = useState({});
  const { isBudget } = useUserTypes();
  const { showSnack } = useSnackbarHook();
  const { setAlertDialog } = useModalHook();

  const effectiveTab = isBudget ? activeTab : "proc";

  const [debouncedSearch] = useDebounce(search, 500);

  const tabs = [
    { name: "All items", value: "all" },
    { name: "Procurable", value: "proc" },
    { name: "Non-procurable", value: "non-proc" },
  ];

  // Reset page when tab or search changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  // Always fetch data when relevant params change
  useEffect(() => {
    if (!id) return;
    getPPMPApplicationByID(
      id,
      type,
      debouncedSearch,
      page,
      perPage,
      effectiveTab,
    );
    if (!isBudget) return;
    getSourceOfFunds(() => {});
  }, [id, effectiveTab, page, perPage, debouncedSearch]);

  // Keep localRows in sync for optimistic updates
  useEffect(() => {
    setLocalRows(ppmpApplicationItems || []);
  }, [ppmpApplicationItems]);

  const handleComments = (row) => {
    setSelectedRow(row);
    setOpenDrawer(true);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isPostingComment) return;

    setIsPostingComment(true);

    try {
      await postPPMPComment({
        ppmp_item_id: selectedRow.id,
        comment: newComment,
      });

      // Refresh drawer comments
      getPPMPComments(selectedRow.id);
      setNewComment("");

      // Optimistically update comment count in table
      setLocalRows((prev) =>
        prev.map((item) =>
          item.id === selectedRow.id
            ? { ...item, comment_count: (item.comment_count || 0) + 1 }
            : item,
        ),
      );
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleUpdateSource = (row, sourceOfFund) => {
    updateSourceOfFunds(
      row.id,
      {
        source_of_fund_id: sourceOfFund.id,
      },
      (status, message) => {
        if (status === 200) {
          // Refresh data
          showSnack(200, message);
        } else {
          setAlertDialog({
            status: "danger",
            title: message,
            description: "",
          });
        }
      },
    );
  };

  // Fetch comments when drawer opens
  useEffect(() => {
    if (openDrawer && selectedRow?.id) getPPMPComments(selectedRow.id);
  }, [openDrawer, selectedRow?.id]);
  return (
    <Fragment>
      <PageTitle
        title={
          <Typography>
            Manage{" "}
            <Typography textColor={"warning.400"}>
              {" "}
              {type === "regular" ? `${AREA_CODE}'s` : "Dispensing"}
            </Typography>{" "}
            PPMP{" "}
            {/* AOP <Typography textColor={"warning.400"}>#{id} </Typography> */}
            for Fiscal Year{" "}
            <Typography textColor={"warning.400"}>{FISCAL_YEAR}</Typography>
          </Typography>
        }
        items={[
          {
            label: "AOP",
            to: `/approval/objectives/${AOP_APPLICATION_ID}`,
          },
          {
            label: "PPMP",
            current: true,
          },
        ]}
      />

      <BoxComponent my={2} bgColor={"#FAFAF9"} boxShadow="xs" p={2}>
        <Stack direction={"row"} alignItems={"flex-end"} spacing={5}>
          <Stack width={"100%"}>
            <Stack direction={"row"} gap={1.5}>
              <Typography
                level="body-md"
                sx={{ fontWeight: 600 }}
                endDecorator={
                  <ChipComponent
                    label={
                      type === "regular"
                        ? `${AREA_CODE}'s`
                        : "Consolidated Supplies"
                    }
                    color={"success"}
                    variant={"outlined"}
                    size="md"
                  />
                }
              >
                PPMP Resources for
              </Typography>
            </Stack>
            <Typography level="body-sm" sx={{ mb: 2 }}>
              The below contains a list of resources submitted by the requester
              for PPMP.
            </Typography>

            <SearchBarComponentv2
              value={search}
              setValue={setSearch}
              placeholder="Search resources..."
              size="md"
              sx={{ width: "300px" }}
            />
          </Stack>
          <BoxComponent
            px={2}
            py={2}
            bgColor={"white"}
            borderRadius={10}
            width={"250px"}
          >
            <Typography
              textTransform={"uppercase"}
              level="body-xs"
              color="primary"
              textAlign={"right"}
            >
              Total Cost
            </Typography>
            <Typography
              textTransform={"uppercase"}
              level="h3"
              color="primary"
              textAlign={"right"}
              fontWeight={600}
            >
              &#8369;{" "}
              <CountUp
                start={0}
                end={ppmpApplication?.ppmp_total || 0}
                duration={1.5} // duration in seconds
                separator=","
                decimals={2}
                decimal="."
                prefix=""
              />
            </Typography>
          </BoxComponent>
        </Stack>
      </BoxComponent>
      {isBudget && (
        <>
          <TabComponent
            tabs={tabs}
            handleTabChange={(val) => {
              setActiveTab(val);
              setPage(1); // reset pagination when switching tabs
            }}
            index={activeTab}
          />
          <br />
        </>
      )}

      <ExpandableTable
        columns={PPMP_APPROVER_HEADERS(handleComments)}
        rows={localRows}
        loading={isLoading}
        stickyFooter
        renderExpanded={(row) => {
          const totalQuantity = row?.activities?.reduce(
            (sum, act) => sum + (Number(act.resources_quantity) || 0),
            0,
          );

          const unit = row?.unit || row?.item?.unit || ""; // fallback

          return (
            <>
              <React.Fragment>
                <Tabs
                  defaultValue="a"
                  sx={{ bgcolor: grey[100] }}
                  variant="soft"
                >
                  <TabList>
                    <Tab
                      value="a"
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: blue[50], // selected background
                          color: blue[800], // selected text
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
                          backgroundColor: blue[50], // selected background
                          color: blue[800], // selected text
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
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        gap: 2,
                      }}
                    >
                      <BoxComponent
                        p={2}
                        width={350}
                        height={250} // ⬅️ reduce height
                        overflow="hidden"
                      >
                        {" "}
                        {/* Set a fixed height or responsive height */}
                        <ItemRowComponent item={row?.item} minHeight={250} />
                      </BoxComponent>

                      <BoxComponent p={2} width={450} height={250}>
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
                            <Typography level="body-sm">
                              Mode of Procurement
                            </Typography>
                            {row?.procurement_mode ? (
                              // VIEW MODE → Show chip if procurement_mode exists
                              <>
                                <ChipComponent
                                  label={row?.procurement_mode?.name}
                                  sx={{
                                    color: "#7008E7",
                                    bgcolor: "#DDD6FF",
                                  }}
                                  size="md"
                                />

                                <Typography
                                  level="body-sm"
                                  startDecorator={<InfoOutline />}
                                  gap={0.3}
                                >
                                  Pre-Procurement Conference:{"  "}
                                  <b>
                                    {row?.pre_procurement_conference
                                      ? " YES "
                                      : " NO "}
                                  </b>
                                </Typography>
                              </>
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
                                ),
                              )
                            ) : (
                              <Typography level="body-md">
                                No specifications provided.
                              </Typography>
                            )}
                          </Stack>
                        </Stack>
                      </BoxComponent>

                      <Stack width={510} gap={2}>
                        {isBudget && (
                          <BoxComponent height={80}>
                            <Stack
                              direction={"row"}
                              justifyContent={"space-between"}
                              mb={2}
                            >
                              <Typography
                                level="title-md"
                                startDecorator={
                                  <TextSnippetOutlined
                                    sx={{ color: blue[800], fontSize: 20 }}
                                  />
                                }
                              >
                                Source of Funds
                              </Typography>
                              <Typography
                                level="body-sm"
                                startDecorator={
                                  <InfoOutlineRounded
                                    sx={{ fontSize: 15 }}
                                    color="warning"
                                  />
                                }
                              >
                                Action Required
                              </Typography>
                            </Stack>
                            <AutocompleteComponent
                              options={sourceOfFunds}
                              getOptionLabel={(option) => option?.name || ""}
                              value={row?.source_of_fund ?? null}
                              handleSelect={(option) =>
                                handleUpdateSource(row, option)
                              }
                            />
                          </BoxComponent>
                        )}

                        <BoxComponent p={2} height={isBudget ? 115 : 250}>
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

                          <Typography level="body-sm" sx={{ color: "black" }}>
                            {row?.item_remarks || "No remarks provided."}
                          </Typography>
                        </BoxComponent>
                      </Stack>
                    </Box>
                  </TabPanel>
                  <TabPanel value="b">
                    <Stack direction={"row"} spacing={2}>
                      <BoxComponent
                        p={2}
                        width={500}
                        height={250}
                        overflow="hidden"
                      >
                        <ItemRowComponent item={row?.item} minHeight={250} />
                      </BoxComponent>
                      <BoxComponent width={"100%"} height={250}>
                        <Typography
                          fontWeight={600}
                          startDecorator={
                            <ExtensionOutlined
                              style={{ color: orange[800], fontSize: 20 }}
                            />
                          }
                        >
                          Linked Activities ({row?.activities?.length})
                        </Typography>

                        <Stack
                          mt={2}
                          spacing={1}
                          height={"170px"}
                          overflow={"auto"}
                        >
                          <Box height={"250px"} sx={{ overflowY: "scroll" }}>
                            {row?.activities?.length > 0 ? (
                              row?.activities?.map((act, index) => (
                                <BoxComponent
                                  bgColor={"#F5F5F4"}
                                  p={1}
                                  key={index}
                                  mb={1}
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
                                        direction={"row"}
                                        justifyContent={"space-between"}
                                        alignItems={"center"}
                                      >
                                        <Typography
                                          level="body-sm"
                                          fontWeight={600}
                                        >
                                          {act.activity_name}
                                        </Typography>
                                      </Stack>

                                      <Stack
                                        direction={"row"}
                                        alignItems={"flex-end"}
                                        spacing={1}
                                      >
                                        <Typography level="body-sm">
                                          {`${act.resources_quantity} ${act.unit}(s)`}
                                        </Typography>

                                        <Typography>
                                          •{" "}
                                          {formattedPrice(
                                            row?.item?.estimated_budget *
                                              Number(act.resources_quantity),
                                          )}
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
                          </Box>
                        </Stack>
                        <Typography textAlign={"right"} level="body-sm" mt={2}>
                          Total: {totalQuantity}{" "}
                          <b>
                            {unit}
                            {totalQuantity > 1 ? "s" : ""}
                          </b>
                        </Typography>
                      </BoxComponent>
                    </Stack>
                  </TabPanel>
                  <TabPanel value="c">
                    <Stack direction={"row"} width={"100%"} gap={2}>
                      <BoxComponent width={"30%"}>
                        <ProcurementTimeline value={row?.ppmp_item_timeline} />
                      </BoxComponent>
                      <BoxComponent
                        bgColor={"white"}
                        p={2}
                        borderRadius={20}
                        width={"70%"}
                      >
                        <ProcurementSchedule
                          editing={false}
                          value={row?.target_by_month}
                        />
                      </BoxComponent>
                    </Stack>
                  </TabPanel>
                </Tabs>
              </React.Fragment>
            </>
          );
        }}
        currentPage={pagination?.current_page}
        totalPages={pagination?.last_page}
        totalRows={pagination?.total}
        onNextPage={() => {
          if (page < pagination?.last_page) setPage(page + 1);
        }}
        onPrevPage={() => {
          if (page > 1) setPage(page - 1);
        }}
      />

      <DrawerComponent
        open={openDrawer}
        setOpen={setOpenDrawer}
        title={`${selectedRow?.item?.name}`}
        description={`The following are comments specifically commented in this item.`}
        size="md"
        content={
          ppmpComments?.length > 0 ? (
            <Box
              sx={{
                maxHeight: "480px", // adjust as needed
                overflowY: "auto",
                pr: 1, // optional: add padding for scrollbar
              }}
            >
              <Stack width="100%" py={1} spacing={1.5}>
                {ppmpComments.map((c, index) => (
                  <CommentContainerComponent
                    key={index}
                    name={c?.user?.name}
                    comment={c?.comment}
                    area_code={c?.user?.assigned_area?.area_name}
                    date={c.created_at}
                  />
                ))}
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                height: "50vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NoResultComponent />{" "}
            </Box>
          )
        }
        footer={
          <>
            <Stack width={"100%"} spacing={2}>
              <TextareaComponent
                placeholder={"Comment here .. "}
                maxRows={2}
                label={"Add a comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Stack direction={"row"} justifyContent={"right"}>
                <ButtonComponent
                  label={"Post Comment"}
                  width="200px"
                  onClick={() => handleAddComment()}
                  isLoading={isPostingComment}
                  loadingLabel={"posting..."}
                />
              </Stack>
            </Stack>
          </>
        }
      />
    </Fragment>
  );
}

export default ViewPPMP;
