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
  ExtensionOutlined,
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

function ViewPPMP() {
  const { id } = useParams();
  const { getPPMPApplicationByID } = usePPMPApplicationActions();
  const { ppmpApplicationItems, ppmpApplication, isLoading } = usePPMP();
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
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [localRows, setLocalRows] = useState([]);

  // const filteredPPMPItems = useMemo(() => {
  //   if (!search) return ppmpApplicationItems;
  //   return ppmpApplicationItems?.filter((item) =>
  //     item.item.name.toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [search, ppmpApplicationItems]);

  const handleComments = (row) => {
    setSelectedRow(row);
    setOpenDrawer(true);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isPostingComment) return;

    setIsPostingComment(true);

    try {
      await postPPMPComment({
        ppmp_item_id: selectedRow?.id,
        comment: newComment,
      });

      // Fetch drawer comments only
      getPPMPComments(selectedRow?.id);

      // 🔥 Update local comment count instantly
      setLocalRows((prev) =>
        prev.map((item) =>
          item.id === selectedRow.id
            ? { ...item, comment_count: (item.comment_count || 0) + 1 }
            : item
        )
      );

      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPostingComment(false);
    }
  };

  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    getPPMPApplicationByID(id, debouncedSearch, page, perPage, () => {});
  }, [id, debouncedSearch, page, perPage, newComment]);

  useEffect(() => {
    if (ppmpApplicationItems) {
      setLocalRows(ppmpApplicationItems);
    }
  }, [ppmpApplicationItems]);

  useEffect(() => {
    if (openDrawer && selectedRow?.id) {
      getPPMPComments(selectedRow.id); // fetch existing comments
    }
  }, [openDrawer, selectedRow?.id]);
  return (
    <Fragment>
      <PageTitle
        title={
          <Typography>
            Manage{" "}
            <Typography textColor={"warning.400"}>{AREA_CODE}'s</Typography>{" "}
            PPMP{" "}
            {/* AOP <Typography textColor={"warning.400"}>#{id} </Typography> */}
            for Fiscal Year{" "}
            <Typography textColor={"warning.400"}>{FISCAL_YEAR}</Typography>
          </Typography>
        }
        description={
          "Each objective has its own list of activities. Mark each activity as reviewed and process the request to continue."
        }
        items={[
          {
            label: "AOP",
            to: `/aop-approval/objectives/${AOP_APPLICATION_ID}`,
          },
          {
            label: "PPMP",
            current: true,
          },
        ]}
      />

      <BoxComponent my={2} bgColor={"#FAFAF9"} boxShadow="xs" p={2}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
        >
          <Stack>
            <Stack direction={"row"} gap={1.5}>
              <Typography level="body-md" sx={{ fontWeight: 600 }}>
                List of PPMP Resources
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
          <BoxComponent px={2} py={2} bgColor={"white"} borderRadius={10}>
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
      <ExpandableTable
        columns={PPMP_APPROVER_HEADERS(handleComments)}
        rows={localRows}
        loading={isLoading}
        renderExpanded={(row) => {
          const totalQuantity = row?.activities?.reduce(
            (sum, act) => sum + (Number(act.resources_quantity) || 0),
            0
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

                      <BoxComponent p={2} width={350} height={250}>
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
                              <ChipComponent
                                label={row?.procurement_mode?.name}
                                sx={{
                                  color: "#7008E7",
                                  bgcolor: "#DDD6FF",
                                }}
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
                      <BoxComponent p={2} width={350} height={250}>
                        <Stack>
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
                            <Box height={"300px"} sx={{ overflowY: "scroll" }}>
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
                                      <Stack width={"40%"}>
                                        <ChipComponent
                                          label={act.activity_code}
                                          color={"primary"}
                                          fontSize={11}
                                        />
                                      </Stack>

                                      <Stack width={"60%"}>
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
                                            • ₱
                                            {(
                                              row?.item?.estimated_budget *
                                              Number(act.resources_quantity)
                                            ).toLocaleString("en-PH", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
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
                    <BoxComponent bgColor={"white"} p={2} borderRadius={20}>
                      <ProcurementSchedule
                        editing={false}
                        initialData={row?.target_by_month}
                      />
                    </BoxComponent>
                  </TabPanel>
                </Tabs>
              </React.Fragment>
            </>
          );
        }}
        currentPage={ppmpApplication?.pagination?.current_page}
        totalPages={ppmpApplication?.pagination?.last_page}
        totalRows={ppmpApplication?.pagination?.total}
        onNextPage={() => {
          if (page < ppmpApplication?.pagination?.last_page) setPage(page + 1);
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
