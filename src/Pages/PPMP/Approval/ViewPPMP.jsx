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
import { useUserTypes } from "../../../Store/AuthStore";
import ItemRowComponent from "@Components/Resources/ItemRowComponent";
import ProcurementTimeline from "../EndUser/ProcurementTimeline";
import formattedPrice from "../../../Utils/formattedPrice";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import useModalHook from "../../../Hooks/ModalHook";
import EllipsisText from "../../../Utils/EllipsisText";
import { ExpandableRow } from "../EndUser/ExpandableRow";

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
  const { ppmpComments, isLoading: isCommentsLoading } = usePPMPComments();

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
  const [activeTab, setActiveTab] = useState("all");
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
    if (isBudget) getSourceOfFunds(() => {});
  }, [id, effectiveTab, page, perPage, debouncedSearch]);

  // Keep localRows in sync for optimistic updates
  useEffect(() => {
    setLocalRows(ppmpApplicationItems || []);
  }, [ppmpApplicationItems]);

  useEffect(() => setPage(1), [activeTab, debouncedSearch]);

  // Fetch comments when drawer opens
  useEffect(() => {
    if (selectedRow?.id) getPPMPComments(selectedRow.id);
  }, [selectedRow?.id]);

  const handleComments = (row) => {
    setSelectedRow(row);
    setOpenDrawer(true);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isPostingComment || !selectedRow) return;

    setIsPostingComment(true);

    try {
      await postPPMPComment({
        ppmp_item_id: selectedRow.id,
        comment: newComment,
      });
      // Optimistically update comment count in table
      setLocalRows((prev) =>
        prev.map((item) =>
          item.id === selectedRow.id
            ? { ...item, comments_count: (item.comments_count || 0) + 1 }
            : item,
        ),
      );
      setNewComment("");
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
        renderExpanded={(row) => (
          <ExpandableRow
            row={row}
            editing={false}
            isBudget={isBudget}
            sourceOfFunds={sourceOfFunds}
            onUpdateSource={handleUpdateSource}
          />
        )}
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
        title={<EllipsisText text={selectedRow?.item?.name} />}
        description={`The following are comments specifically commented in this item.`}
        size="md"
        content={
          isCommentsLoading ? (
            <Box
              sx={{
                height: "45vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThreeDotsLoader />
            </Box>
          ) : ppmpComments.length > 0 ? (
            <Box
              sx={{
                maxHeight: "460px", // adjust as needed
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
                height: "45vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NoResultComponent />
            </Box>
          )
        }
        footer={
          <>
            <Stack width={"100%"} spacing={2}>
              <TextareaComponent
                placeholder={"Comment here .. "}
                maxRows={3}
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
