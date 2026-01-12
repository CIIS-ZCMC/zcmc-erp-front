import React, { Fragment, useEffect, useState } from "react";
import { variantCols } from "../../../Data/Columns";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import useModalHook from "../../../Hooks/ModalHook";
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";
import ServerTableComponent from "../../../Components/Common/Table/ServerTableComponent";
import useTerminologyHooks from "../../../Hooks/Libraries/LibTerminology";
import SearchBarComponentv2 from "../../../Components/SearchBarWithdeBounce";
import { Stack } from "@mui/material";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import usePinHook from "../../../Hooks/PinHook";
import ExpandableTable from "@Components/Common/Table/ExpandableTable";
import StatusSwitch from "@Components/StatusSwitchComponent";
import SearchWithSuggestions from "@Components/SearchWithSuggestions";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { AddOutlined } from "@mui/icons-material";
import { Typography } from "@mui/joy";
import useItemsHook from "../../../Hooks/ItemManagementHook";
import useSnackbarHook from "../../../Hooks/SnackbarHook";

export const Variant = () => {
  const {
    terminology,
    pagination,
    search_Query,
    selectedData,
    setSelectedData,
    setSearchQuery,
    getPaginatedTerminology,
    getArchivedTerminology,
    postNewTerminology,
    updateTerminology,
    archiveTerminology,
    unarchiveTerminology,
  } = useItemsHook();
  const { showSnack } = useSnackbarHook();
  const { setOpenModal, setConfirmationModal } = useModalHook();
  const { pin, setPin } = usePinHook();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [active, setActive] = useState(true);
  const [page, setPage] = useState(1);

  function transformData(data) {
    console.log("Transforming category data:", data);
    return data.map((item) => ({
      id: item.id,
      name: item.system,
      code: item.code,
      description: item.description,
      created_at: item.meta.created_at.split("T")[0],
      updated_at: item.meta.updated_at.split("T")[0],
    }));
  }

  const handleUpdate = (params) => {
    setOpenUpdate(true);
  };

  const handleDelete = (params) => {
    setOpenDel(true);
    const data = {
      status: "error",
      title: `Archive this terminology (${params?.name}) ?`,
      description:
        "This action cannot be undone. However, you may still restore the item anytime from the Archived view.",
    };
    setConfirmationModal(data);
  };

  const deleteTerminology = async (id) => {
    const form = {
      authorization_pin: pin,
    };
    if (!active) {
      await unarchiveTerminology(selectedData.id, form, (status, message) => {
        // setLoading(false);

        if (status === 200) {
          setOpenDel(false);
          showSnack(200, message);
        } else {
          showSnack(500, message);
        }
      });
    } else {
      await archiveTerminology(selectedData.id, form, (status, message) => {
        // setLoading(false);

        if (status === 200) {
          setOpenDel(false);
          showSnack(200, message);
        } else {
          showSnack(500, message);
        }
      });
    }
  };

  useEffect(() => {
    if (active) {
      setLoading(true);
      getPaginatedTerminology({
        page,
        per_page: 10,
        search: search_Query,
        callBack: (status, message) => {
          setLoading(false);
          console.log("Response:", status, message);
        },
      });
    }
  }, [page, search_Query, active]);

  useEffect(() => {
    if (!active) {
      // When switching to archived, fetch page 1 of archived classifications
      setPage(1); // optional: reset page to first page for archived
      setLoading(true);

      getArchivedTerminology({
        page: page,
        per_page: 10,
        search: search_Query,
        callBack: (status, message) => {
          setLoading(false);
          console.log("Archived classifications fetched:", status, message);
        },
      });
    }
  }, [page, search_Query, active]);

  return (
    <Fragment>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"flex-start"}
        >
          <Typography level="body-sm">View:</Typography>
          <StatusSwitch checked={active} onChange={setActive} />
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <SearchBarComponentv2
            placeholder="Search categories"
            setValue={setSearchQuery}
            value={search_Query}
          />{" "}
          <ButtonComponent
            label={"Add New Terminology"}
            startDecorator={<AddOutlined />}
          />
        </Stack>
      </Stack>

      <ExpandableTable
        isLoading={loading}
        rows={transformData(terminology)}
        columns={variantCols(
          active,
          setSelectedData,
          handleUpdate,
          handleDelete
        )}
        currentPage={pagination?.current_page}
        totalPages={pagination?.last_page}
        onNextPage={() => {
          if (page < pagination?.last_page) setPage(page + 1);
        }}
        onPrevPage={() => {
          if (page > 1) setPage(page - 1);
        }}
        totalRows={pagination?.total}
        stickyFooter
        height="62vh"
      />

      {/* {openUpdate && (

      )} */}
      {openDel && (
        <ConfirmationModalComponent
          status="error"
          rightButtonAction={() => deleteTerminology()}
          withAuthPin
          setAuthPin={setPin}
        />
      )}
    </Fragment>
  );
};
