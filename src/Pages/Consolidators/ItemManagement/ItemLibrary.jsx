import React, { useState, useEffect } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { Fragment } from "react";
import { LIBRARY_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { ExternalLink } from "lucide-react";
import { Stack, Box, Input } from "@mui/joy";
import { Outlet, useNavigate } from "react-router-dom";
import TabComponent from "../../../Components/Common/TabComponent";
import ScrollableTableComponent from "../../../Components/Common/Table/ScrollableTableComponent";
import { objHeaders } from "../../../Data/Columns";
import SearchBarComponent from "../../../Components/SearchBarComponent";

import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { useLocation } from "react-router-dom";

import { CategoryModalContent } from "../Modals/CategoryModalContent";
import { ClassificationModalContent } from "../Modals/ClassificationModalContent";
import { VariantModalContent } from "../Modals/VariantModalContent";
import { ItemModalContent } from "../Modals/ItemModalContent";
import useModalHook from "../../../Hooks/ModalHook";
import RenderDialog from "../Modals/RenderDialog";
import useClassificationHooks from "../../../Hooks/Libraries/LibClassificationHooks";
import useCategoryHooks from "../../../Hooks/Libraries/LibCategoryHooks";
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";
import { libaryTabs } from "../../../Data/Options";
import SearchBarComponentv2 from "../../../Components/SearchBarWithdeBounce";
import useClassificationDataTable from "../../../Hooks/Libraries/dataTable/dataClassification";
const ItemLibrary = () => {
  const [index, setIndex] = useState("");

  const setTypeclassi = useClassificationHooks((state) => state.setType);
  const setTypecateg = useCategoryHooks((state) => state.setType);
  const setTypevariant = useVariantHooks((state) => state.setType);

  const setSearchQuery = useClassificationDataTable(
    (state) => state.setSearchQuery
  );
  const { search_Query } = useClassificationDataTable();

  // Unified setter
  const setAllTypes = (type) => {
    setTypeclassi(type);
    setTypecateg(type);
    setTypevariant(type);
  };
  const { openModal, setOpenModal, successDialog, setSuccessDialog } =
    useModalHook();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const UrllastSegment = location.pathname.split("/").filter(Boolean).pop();
  const closeModal = () => {
    setSuccessDialog(false);
  };

  const ModalContent = () => {
    switch (UrllastSegment) {
      case "classification":
        return <ClassificationModalContent />;
      case "category":
        return <CategoryModalContent />;
      case "variant":
        return <VariantModalConttent />;
      default:
        return <ItemModalContent />;
    }
  };

  useEffect(() => {
    navigate(index);
  }, [index]);

  return (
    <Fragment>
      <PageTitle
        title={LIBRARY_CONSTANTS.LIBRARY_TITLE}
        description={LIBRARY_CONSTANTS.LIBRARY_SUBTITLE}
      />
      <Box sx={{ marginTop: "40px" }}>
        <ContainerComponent
          title={LIBRARY_CONSTANTS.LIBRARY_HEADER}
          description={LIBRARY_CONSTANTS.LIBRARY_SUBHEADER}
          // sx={{ mt: 3 }}
          actions={
            <Stack direction={"row"} gap={2}>
              <ButtonComponent
                label={"Go to requests"}
                variant={"outlined"}
                endDecorator={<ExternalLink />}
                size={"sm"}
              />
              <ButtonComponent
                label={"New record"}
                variant={"solid"}
                size={"sm"}
                onClick={() => {
                  setAllTypes("create");
                  setOpenModal(true, false, true);
                }}
              />
            </Stack>
          }
        >
          <TabComponent tabs={libaryTabs} index={index} setIndex={setIndex} />

          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            {/* {searchQuery} */}

            {/* <SearchBarComponentv2
              value={search_Query}
              setValue={setSearchQuery}
            /> */}
            {/* <DatePickerComponent /> */}
          </Box>
          <Outlet />
        </ContainerComponent>
      </Box>

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={openModal.isOpen}
        onClose={() => setOpenModal(false, false, false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <ModalContent />
        </Sheet>
      </Modal>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={successDialog}
        onClose={() => setSuccessDialog(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <RenderDialog lib={UrllastSegment} closeModal={closeModal} />
        </Sheet>
      </Modal>
    </Fragment>
  );
};

export default ItemLibrary;
