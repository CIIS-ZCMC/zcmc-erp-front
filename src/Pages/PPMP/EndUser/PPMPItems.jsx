import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { Stack, Typography, Snackbar, Alert, Box, Card } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import usePPMPHook from "../../../Hooks/PPMP/PPMPHook";
import useItemsHook from "../../../Hooks/ItemsHook";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import useModalHook from "../../../Hooks/ModalHook";
import userErrorInputHook from "../../../Hooks/ErrorInputHook";
import AlertDialogComponent from "../../../Components/Common/Dialog/AlertDialogComponent";
import { InfoIcon, PlusIcon } from "lucide-react";
import { useAuth } from "../../../Store/AuthStore";
import { socket } from "../../../Services/Socket";
import { usePPMPTotalStore } from "../../../Hooks/PPMP/PPMPItemsHook";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import ChipComponent from "@Components/Common/ChipComponent";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import CollapsibleTable from "./CollapsibleTable";
import { PPMP_HEADERS } from "../../../Data/Columns";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import SearchBarComponentv2 from "@Components/SearchBarWithdeBounce";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import DrawerComponent from "@Components/Common/DrawerComponent";
import { blue, grey } from "@mui/material/colors";
import moment from "moment";
import { ArrowBack, Circle } from "@mui/icons-material";
import CommentContainerComponent from "@Components/Comments/CommentContainerComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import IconButtonComponent from "@Components/Common/IconButtonComponent";
import CountUp from "react-countup";
import { usePPMPApplicationActions } from "../../../Hooks/PPMP/PPMPApplicationHook";
import {
  usePPMPComments,
  usePPMPCommentsActions,
} from "../../../Hooks/PPMP/PPMPCommentsHook";
import NoResultComponent from "@Components/Common/Table/NoResultComponent";

function PPMPItems(props) {
  const navigate = useNavigate();
  const {
    modes,
    status,
    ppmp_id,
    ppmp,
    ppmp_total,
    pagination,
    getPPMPItems,
    postPPMP,
    postItemRequest,
    exportPPMP,
    updatePPMP,
    removeActivity,
    removeItem,
  } = usePPMPHook();
  const {
    setAlertDialog,
    setConfirmationModal,
    closeConfirmation,
    closeAlertDialog,
  } = useModalHook();
  const { errors, setError, clearErrors } = userErrorInputHook();
  const { getPPMPComments, postPPMPComment } = usePPMPCommentsActions();
  const { ppmpComments } = usePPMPComments();

  const { showSnack } = useSnackbarHook();
  const [pageLoader, setPageLoader] = useState(false);
  const [dlLoader, setDlLoader] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [show, setShow] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [editor, setEditor] = useState(null);
  const [editingRows, setEditingRows] = useState({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const updatedRowData = React.useRef({});
  const [selectedRow, setSelectedRow] = useState({});
  const [localRows, setLocalRows] = useState([]);

  const location = useLocation();
  const { user } = useAuth();
  const { name, id, assignedArea } = user ?? {};

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  // const { is_draft } = location.state || {};

  // Filter results when search changes
  const filteredPPMPItems = useMemo(() => {
    if (!search) return localRows;
    return localRows?.filter((item) =>
      item.item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, localRows]);

  //SNACKBAR
  const notify = () => setOpenNotify(true);
  const handleCloseSnack = () => {
    setEditor(null);
    setOpenNotify(false);
  };

  const editSignal = () => {
    socket.emit("start-edit", {
      userId: id,
      name: name,
      area: assignedArea?.name,
    });
  };

  const disconnectSignal = () => {
    socket.emit("stop-edit", {
      userId: id,
      area: assignedArea?.name,
    });
    setShow(false);
    handleCloseSnack();
  };

  const handleEditing = ({ editable, showEdit, editorName, editorId }) => {
    setDisabled(!editable);
    setShow(showEdit);
    setOpenNotify(editable ? false : true);
    setEditor(() => {
      return { editorName: editorName, editorId: editorId };
    });

    if (!editable) {
      return notify();
    }
  };

  const handleEditToggle = async (rowId, onToggle, isSaveClick) => {
    const isEditing = editingRows[rowId];

    if (isEditing && !isSaveClick) {
      return;
    }
    if (isEditing && isSaveClick) {
      const getDataFunc = updatedRowData.current[rowId];
      if (!getDataFunc) return;

      const updatedData = getDataFunc();

      try {
        updatePPMP(rowId, updatedData, (status, body) => {
          if (status === 200) {
            showSnack(200, body.message);

            // collapse row only on success
            onToggle(false);

            setEditingRows((prev) => ({
              ...prev,
              [rowId]: false,
            }));
          } else {
            console.log(body);
            setAlertDialog({
              status: "danger",
              title: "Failed to save.",
              description: "",
            });
            // do nothing — keep row open
          }
        });
      } catch (err) {
        setAlertDialog({
          status: "danger",
          title: "Save error.",
          description: err,
        });
        // do nothing — keep row open
      }
      return;
    }
    // Enter edit mode
    setEditingRows((prev) => ({
      ...prev,
      [rowId]: true,
    }));
    // Force open row when entering edit
    onToggle(true);
  };

  const handleDeleteItem = async (id) => {
    await removeItem(id, (status, message) => {
      // setLoading(false);

      if (status === 200) {
        showSnack(200, message);
      } else {
        showSnack(500, message);
      }
    });
  };

  //SAVE CHANGES
  const isEmptyObject = (obj) =>
    obj && typeof obj === "object" && Object.keys(obj).length === 0;

  const exportToCSV = () => {
    setDlLoader(true);
    exportPPMP({ export: true }, (status, message) => {
      if (status === 200) {
        setDlLoader(false);
        setAlertDialog({
          status: "success",
          title: "PPMP Downloaded",
          description: "Your PPMP has been successfully downloaded.",
        });
      } else {
        setDlLoader(false);
        setAlertDialog({
          status: "error",
          title: "PPMP Download failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  const handleComments = (row) => {
    setSelectedRow(row);
    setOpenDrawer(true);
  };

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
      perPage
    );
  }, [page, perPage]);

  useEffect(() => {
    if (!assignedArea?.name) return;

    socket.emit("register-user", {
      userId: id,
      name: name,
      area: assignedArea.name,
    });
  }, [assignedArea]);

  useEffect(() => {
    socket.connect(); // Connect every time component mounts
    socket.emit("authenticate", { id: id, area: assignedArea?.name });

    socket.on("editing", handleEditing);

    return () => {
      socket.off("editing");
      // socket.disconnect();
    };
  }, []);

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

  return (
    <Fragment>
      <PageTitle
        title={`PPMP for Fiscal Year ${currentFiscalYear}`}
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
          <Stack spacing={1}>
            <Stack direction={"row"} gap={1.5}>
              <Typography level="body-md" sx={{ fontWeight: 600 }}>
                Manage Resources for{" "}
              </Typography>
              <ChipComponent
                label={`PPMP Fiscal Year ${currentFiscalYear}`} // change to dynamic activity name
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

          {(status?.name === "draft" || status?.name === 'returned') && (
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
          alignItems={"center"}
        >
          <SearchBarComponentv2
            value={search}
            setValue={setSearch}
            placeholder="Search resources..."
            fullWidth
          />
          <BoxComponent px={2} py={0.5} bgColor={"white"} borderRadius={10}>
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
              level="title-lg"
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
      <CollapsibleTable
        isLoading={pageLoader}
        columns={PPMP_HEADERS(status, editingRows, handleComments)}
        rows={filteredPPMPItems}
        editingRows={editingRows}
        onEditToggle={handleEditToggle}
        onGetUpdatedData={(rowId, getDataFunc) => {
          updatedRowData.current[rowId] = getDataFunc;
        }}
        onRemoveActivity={removeActivity}
        ppmpId={ppmp_id}
        currentPage={pagination?.current_page}
        totalPages={pagination?.last_page}
        totalRows={pagination?.total}
        onNextPage={() => {
          if (page < pagination?.last_page) setPage(page + 1);
        }}
        onPrevPage={() => {
          if (page > 1) setPage(page - 1);
        }}
        onDeletePPMP={handleDeleteItem}
      />

      <AlertDialogComponent leftButtonAction={() => handleClose()} />
      <Snackbar
        open={openNotify}
        // autoHideDuration={2000}
        onClose={handleCloseSnack}
        color="success"
      >
        <Alert
          onClose={handleCloseSnack}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {editor?.editorName} is currently editing
        </Alert>
      </Snackbar>
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
