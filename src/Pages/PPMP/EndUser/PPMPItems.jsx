import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { Stack, Typography, Box, Card, CircularProgress } from "@mui/joy";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePPMPActions, usePPMPState } from "../../../Hooks/PPMP/PPMPHook";
import useModalHook from "../../../Hooks/ModalHook";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import AlertDialogComponent from "../../../Components/Common/Dialog/AlertDialogComponent";
import { InfoIcon, PlusIcon } from "lucide-react";
import { useAuth } from "../../../Store/AuthStore";
import { useRowEditingLock } from "../../../Hooks/Socket/useRowEditingLock";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import { PPMP_HEADERS } from "../../../Data/Columns";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import DrawerComponent from "@Components/Common/DrawerComponent";
import CommentContainerComponent from "@Components/Comments/CommentContainerComponent";
import CountUp from "react-countup";
import {
  usePPMPComments,
  usePPMPCommentsActions,
} from "../../../Hooks/PPMP/PPMPCommentsHook";
import NoResultComponent from "@Components/Common/Table/NoResultComponent";
import { nextYear } from "../../../Utils/Functions";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import AutocompleteComponent from "@Components/Form/AutocompleteComponent";
import useItemsHook from "../../../Hooks/ItemManagementHook";
import { ExpandableRow } from "./ExpandableRow";
import { FileDownload } from "@mui/icons-material";
import CommentsSkeleton from "@Components/Comments/CommentsSkeleton";
import useAOPStore from "@Store/AOPStore";

function PPMPItems(props) {
  const navigate = useNavigate();
  const {
    status,
    ppmp_id,
    ppmp,
    ppmp_items,
    ppmp_total,
    pagination,
    isLocked,
  } = usePPMPState();
  const {
    getPPMPItems,
    exportPPMP,
    updatePPMP,
    removeActivity,
    removeItem,
    getProcTimelines,
    getProcModes,
    getActivities,
  } = usePPMPActions();
  const { fiscalYear } = useAOPStore();
  const { dispensingCategories, getDispensingCategories } = useItemsHook();
  const { setAlertDialog } = useModalHook();
  const { getPPMPComments } = usePPMPCommentsActions();
  const { ppmpComments, isLoading } = usePPMPComments();
  const { showSnack } = useSnackbarHook();
  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};
  const { type } = useParams();

  const [pageLoader, setPageLoader] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const updatedRowData = React.useRef({});
  const [selectedRow, setSelectedRow] = useState({});
  const [localRows, setLocalRows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const editingRowsRef = useRef({});

  useEffect(() => {
    editingRowsRef.current = editingRows;
  }, [editingRows]);

  useEffect(() => {
    setPageLoader(true);
    getPPMPItems(
      type,
      (status, message) => {
        if (status !== 200) {
          console.error("Failed to fetch items:", message);
        }
        setPageLoader(false);
      },
      page,
      perPage,
      search,
      selectedCategory?.id,
      fiscalYear,
    );
  }, [page, perPage, search, selectedCategory?.id, fiscalYear, getPPMPItems]);

  useEffect(() => {
    if (ppmp_items) {
      setLocalRows(ppmp_items);
    }
  }, [ppmp_items]);

  useEffect(() => {
    if (openDrawer && selectedRow?.id) {
      getPPMPComments(selectedRow.id); // fetch existing comments
    }
  }, [openDrawer, selectedRow?.id]);

  const { lockedRows, startEditLock, stopEditLock } = useRowEditingLock({
    room: {
      joinEvent: "ppmp:join",
      leaveEvent: "ppmp:leave",
      payload: { ppmpId: ppmp_id },
    },
    events: {
      lock: "ppmp:lock",
      unlock: "ppmp:unlock",
      editing: "ppmp:editing",
      editingStopped: "ppmp:editing-stopped",
      locked: "ppmp:locked",
    },
    idKey: "rowId",
    startEditEvent: "ppmp:start-edit",
    stopEditEvent: "ppmp:stop-edit",
    currentUserId: id,
    currentUserName: name,
    onNotify: (status, msg) => showSnack(status, msg, "soft"),
    enabled: Boolean(ppmp_id),
  });

  useEffect(() => {
    getProcTimelines("start", () => {});
    getProcTimelines("end", () => {});
    getProcTimelines("delivery", () => {});
    getProcModes((status, message) => {
      if (status !== 200) console.error("Failed to fetch items:", message);
    });
    getActivities((status, message) => {
      if (status !== 200) console.error("Failed to fetch items:", message);
    });
    if (type === "dispensed") {
      getDispensingCategories((status, message) => {
        if (status !== 200) console.error("Failed to fetch items:", message);
      });
    }
  }, [type]);

  const handleEditToggle = (rowId, openRow, isSaveClick) => {
    const isEditable = status?.name === "draft" || status?.name === "returned";
    if (!isEditable) return;

    const isEditing = editingRows[rowId];
    const lockedByOther =
      lockedRows[rowId] && lockedRows[rowId].editorId !== id;

    if (!isEditing && lockedByOther) return;
    if (isEditing && !isSaveClick) return;

    // SAVE
    if (isEditing && isSaveClick) {
      const getDataFunc = updatedRowData.current[rowId];
      if (!getDataFunc) return;

      const updatedData = getDataFunc();
      updatePPMP(rowId, updatedData, (status, message) => {
        if (status === 200) {
          stopEditLock(rowId);
          showSnack(status, message);
          setEditingRows((prev) => ({ ...prev, [rowId]: false }));
          // 🔴 DO NOT TOUCH EXPANSION
        } else {
          console.log(status, message);
          setAlertDialog({
            status: "danger",
            title: message,
            description: "",
          });
        }
      });
      return;
    }

    // START EDITING
    startEditLock(rowId);

    setEditingRows((prev) => ({ ...prev, [rowId]: true }));

    if (openRow) {
      openRow(rowId);
    }
  };

  const handleDeleteItem = (id) => {
    removeItem(id, (status, message) => showSnack(status, message));
  };

  const handleComments = useCallback((row) => {
    setSelectedRow(row);
    setOpenDrawer(true);
  }, []);

  const isDraft = status?.name === "draft";
  const isReturned = status?.name === "returned";

  const columns = useMemo(
    () =>
      PPMP_HEADERS(
        status,
        editingRows,
        handleComments,
        handleDeleteItem,
        handleEditToggle,
        lockedRows,
        id,
        isLocked,
      ),
    [
      status,
      editingRows,
      handleComments,
      handleDeleteItem,
      handleEditToggle,
      lockedRows,
      id,
      isLocked,
    ],
  );

  const skeletonCount = ppmpComments?.length || 3;

  return (
    <Fragment>
      <PageTitle
        title={`PPMP for Fiscal Year ${fiscalYear}`}
        description={""}
        items={[
          {
            label: "PPMP",
            current: true,
          },
        ]}
        withArrowBack
        onClickArrow={() => navigate("/ppmp")}
      />
      <BoxComponent my={2} bgColor={"#FAFAF9"} boxShadow="xs" p={2}>
        <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
          <Stack>
            <Stack direction={"row"} gap={1.5}>
              <Typography level="body-md" sx={{ fontWeight: 600 }}>
                Manage Resources for{" "}
              </Typography>
              <ChipComponent
                label={`PPMP Fiscal Year ${fiscalYear}`}
                color={"success"}
                variant={"outlined"}
                fontSize={12}
                size={"sm"}
              />
            </Stack>
            <Typography level="body-xs">
              The below contains a list of resources synced from your submitted
              AOP request. Click a row to expand and view more details.
            </Typography>
          </Stack>

          <Stack direction={"row"} gap={2}>
            {(isDraft || isReturned) && (
              <ButtonComponent
                label={"Add an Item"}
                startDecorator={<PlusIcon />}
                onClick={() => navigate(`/ppmp/add-item/${type}`)}
                disabled={isLocked}
              />
            )}

            <ButtonComponent
              label={"Export PPMP"}
              loadingLabel={"Exporting..."}
              startDecorator={<FileDownload />}
              onClick={() => {
                setIsExporting(true);
                exportPPMP(ppmp, (status, message) => {
                  setIsExporting(false);
                  showSnack(status, message);
                });
              }}
              variant={"outlined"}
              isLoading={isExporting}
              disabled={isExporting}
            />
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
        >
          <Stack direction={"row"} gap={2}>
            <SearchBarComponentv2
              value={search}
              setValue={setSearch}
              placeholder="Search resources..."
              size="sm"
              fullWidth
            />
            {type === "dispensed" && (
              <AutocompleteComponent
                placeholder="Filter by category"
                options={dispensingCategories}
                getOptionLabel={(opt) => opt?.name || ""}
                value={selectedCategory}
                setValue={(value) => {
                  setSelectedCategory(value);
                  setPage(1);
                }}
              />
            )}
          </Stack>

          <BoxComponent px={2} py={1} bgColor={"white"} borderRadius={10}>
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
              fontSize={25}
              color="primary"
              textAlign={"right"}
              fontWeight={600}
            >
              &#8369;{" "}
              <CountUp
                start={0}
                end={ppmp_total || 0}
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
        columns={columns}
        rows={localRows}
        isLoading={pageLoader}
        stickyFooter
        editingRows={editingRows}
        minHeight={400}
        renderExpanded={(row) => (
          <ExpandableRow
            row={row}
            columns={columns}
            editing={editingRows?.[row.id]} // your edit state
            onToggle={() => toggle(row.id)} // optional callback
            onEditToggle={handleEditToggle} // your edit toggle handler
            onGetUpdatedData={(rowId, getDataFunc) => {
              updatedRowData.current[rowId] = getDataFunc;
            }}
            onRemoveActivity={removeActivity}
            onDeletePPMP={handleDeleteItem}
            lockedRows={lockedRows}
            userId={id}
            isLocked={isLocked}
            handleEditToggle={handleEditToggle}
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

      <AlertDialogComponent leftButtonAction={() => handleClose()} />
      <DrawerComponent
        open={openDrawer}
        setOpen={setOpenDrawer}
        title={`PPMP Item: ${selectedRow?.item?.name}`}
        description={`The following are comments specifically commented in this ppmp item.`}
        size="md"
        content={
          isLoading ? (
            <Stack width="100%" gap={1.5}>
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <CommentsSkeleton key={index} />
              ))}
            </Stack>
          ) : ppmpComments?.length > 0 ? (
            <Box
              sx={{
                maxHeight: "595px", // adjust as needed
                overflowY: "auto",
                pr: 1, // optional: add padding for scrollbar
              }}
            >
              <Stack width="100%" gap={1.5}>
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

        //no post for END - USER
        // footer={
        //   <>
        //     <Stack width={"100%"} spacing={2}>
        //       <TextareaComponent
        //         placeholder={"Comment here .. "}
        //         maxRows={3}
        //         label={"Add a comment"}
        //       />
        //       <Stack direction={"row"} justifyContent={"right"}>
        //         <ButtonComponent label={"Post Comment"} width="200px" />
        //       </Stack>
        //     </Stack>
        //   </>
        // }
      />
    </Fragment>
  );
}

export default PPMPItems;
