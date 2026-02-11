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
import { Stack, Typography, Snackbar, Alert, Box, Card } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import usePPMPHook from "../../../Hooks/PPMP/PPMPHook";
import useModalHook from "../../../Hooks/ModalHook";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import AlertDialogComponent from "../../../Components/Common/Dialog/AlertDialogComponent";
import { InfoIcon, PlusIcon } from "lucide-react";
import { useAuth } from "../../../Store/AuthStore";
import { socket } from "../../../Services/Socket";
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
import { ExpandableRow } from "./ExpandableRow";

function PPMPItems(props) {
  const navigate = useNavigate();
  const {
    status,
    ppmp_id,
    ppmp,
    ppmp_total,
    pagination,
    getPPMPItems,
    exportPPMP,
    updatePPMP,
    removeActivity,
    removeItem,
  } = usePPMPHook();
  const { setAlertDialog } = useModalHook();
  const { errors, setError, clearErrors } = userErrorInputHook();
  const { getPPMPComments, postPPMPComment } = usePPMPCommentsActions();
  const { ppmpComments } = usePPMPComments();
  const { showSnack } = useSnackbarHook();
  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};

  const [pageLoader, setPageLoader] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const updatedRowData = React.useRef({});
  const [selectedRow, setSelectedRow] = useState({});
  const [localRows, setLocalRows] = useState([]);
  const [lockedRows, setLockedRows] = useState({});
  const editingRowsRef = useRef({});

  // Filter results when search changes
  const filteredPPMPItems = useMemo(() => {
    if (!search) return localRows;
    return localRows?.filter((item) =>
      item.item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, localRows]);

  useEffect(() => {
    editingRowsRef.current = editingRows;
  }, [editingRows]);

  useEffect(() => {
    setPageLoader(true);
    getPPMPItems(
      (status, message) => {
        if (status !== 200) {
          console.error("Failed to fetch items:", message);
        }
        setPageLoader(false);
      },
      page,
      perPage,
    );
  }, [page, perPage]);

  useEffect(() => {
    if (ppmp) {
      setLocalRows(ppmp);
    }
  }, [ppmp]);

  useEffect(() => {
    if (openDrawer && selectedRow?.id) {
      getPPMPComments(selectedRow.id); // fetch existing comments
    }
  }, [openDrawer, selectedRow?.id]);

  useEffect(() => {
    if (!ppmp_id) return;

    socket.emit("ppmp:join", { ppmpId: ppmp_id });

    return () => {
      socket.emit("ppmp:leave", { ppmpId: ppmp_id });
    };
  }, [ppmp_id]);

  useEffect(() => {
    const handleLocked = ({ rowId, editorId, editorName }) => {
      setLockedRows((prev) => ({
        ...prev,
        [rowId]: { editorId, editorName },
      }));

      showSnack(
        "warning",
        `This row is currently being edited by ${editorName}.`,
      );
    };

    socket.on("ppmp:locked", handleLocked);

    return () => {
      socket.off("ppmp:locked", handleLocked);
    };
  }, [showSnack]);

  useEffect(() => {
    const handleUnload = () => {
      Object.keys(editingRowsRef.current).forEach((rowId) => {
        if (editingRowsRef.current[rowId]) {
          socket.emit("ppmp:stop-edit", {
            ppmpId: ppmp_id,
            rowId,
            userId: id,
          });
        }
      });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [ppmp_id, id]);

  const handleEditToggle = (rowId, openRow, isSaveClick) => {
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
      updatePPMP(rowId, updatedData, (status, body) => {
        if (status === 200) {
          socket.emit("ppmp:stop-edit", { ppmpId: ppmp_id, rowId, userId: id });
          showSnack(200, body.message);
          setEditingRows((prev) => ({ ...prev, [rowId]: false }));
          // 🔴 DO NOT TOUCH EXPANSION
        } else {
          setAlertDialog({
            status: "danger",
            title: "Failed to save.",
            description: "",
          });
        }
      });
      return;
    }

    // START EDITING
    socket.emit("ppmp:start-edit", {
      ppmpId: ppmp_id,
      rowId,
      userId: id,
      name,
    });

    setEditingRows((prev) => ({ ...prev, [rowId]: true }));

    // ✅ FORCE OPEN — no toggle, no collapse
    openRow(rowId);
  };

  const handleDeleteItem = (id) => {
    removeItem(id, (status, message) => showSnack(status, message));
  };

  const handleComments = useCallback((row) => {
    setSelectedRow(row);
    setOpenDrawer(true);
  }, []);

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
      ),
    [
      status,
      editingRows,
      handleComments,
      handleDeleteItem,
      handleEditToggle,
      lockedRows,
      id,
    ],
  );

  return (
    <Fragment>
      <PageTitle
        title={`PPMP for Fiscal Year ${nextYear}`}
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
                label={`PPMP Fiscal Year ${nextYear}`} // change to dynamic activity name
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

          {(status?.name === "draft" || status?.name === "returned") && (
            <ButtonComponent
              label={"Add an Item"}
              startDecorator={<PlusIcon />}
              onClick={() => navigate("/ppmp/add-item")}
            />
          )}
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-end"}
        >
          <SearchBarComponentv2
            value={search}
            setValue={setSearch}
            placeholder="Search resources..."
            fullWidth
          />
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
        rows={filteredPPMPItems}
        loading={pageLoader}
        stickyFooter
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
        title={`${selectedRow?.item?.name}`}
        description={`The following comments were submitted by reviewing offices regarding this resource item.`}
        size="md"
        content={
          ppmpComments?.length > 0 ? (
            <Box
              sx={{
                maxHeight: "595px", // adjust as needed
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
