import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { ExternalLink } from "lucide-react";
import { Stack, Box } from "@mui/joy";
import { Outlet, useNavigate } from "react-router-dom";

import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { useLocation } from "react-router-dom";

import PageTitle from "../../../Components/Common/PageTitle";
import useClassificationHooks from "../../../Hooks/Libraries/LibClassificationHooks";
import useCategoryHooks from "../../../Hooks/Libraries/LibCategoryHooks";
import useVariantHooks from "../../../Hooks/Libraries/LibVarianHooks";
import useModalHook from "../../../Hooks/ModalHook";
import { ITEM_SUBMITTED_LIST_CONSTANTS } from "../../../Data/constants";

import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import TabComponent from "../../../Components/Common/TabComponent";
import SearchBarComponent from "../../../Components/SearchBarComponent";
import RenderDialog from "../../Consolidators/Modals/RenderDialog";
import { submittedRequestsTabs } from "../../../Data/Options";
import ConsViewItemRequestedListModalContent from "../Modals/ConsViewItemRequestedListModalContent";
const ItemRequest = () => {
  const [index, setIndex] = useState("");

  const setTypeclassi = useClassificationHooks((state) => state.setType);
  const setTypecateg = useCategoryHooks((state) => state.setType);
  const setTypevariant = useVariantHooks((state) => state.setType);

  // Unified setter
  const setAllTypes = (type) => {
    setTypeclassi(type);
    setTypecateg(type);
    setTypevariant(type);
  };
  const { openModal, setOpenModal, successDialog, setSuccessDialog } =
    useModalHook();
  const location = useLocation();
  const navigate = useNavigate();
  const UrllastSegment = location.pathname.split("/").filter(Boolean).pop();

  // const ModalContent = () => {
  //   switch (UrllastSegment) {
  //     case "classification":
  //       return <ClassificationModalContent />;
  //     case "category":
  //       return <CategoryModalContent />;
  //     case "variant":
  //       return <VariantModalConttent />;
  //     default:
  //       return <ItemModalContent />;
  //   }
  // };

  useEffect(() => {
    navigate(index);
  }, [index]);

  return (
    <Fragment>
      <PageTitle
        title={ITEM_SUBMITTED_LIST_CONSTANTS.ITEM_SUBMITTED_LIST_TITLE}
        description={ITEM_SUBMITTED_LIST_CONSTANTS.ITEM_SUBMITTED_LIST_SUBTITLE}
      />
      <Box sx={{ marginTop: "40px" }}>
        <ContainerComponent
          title={ITEM_SUBMITTED_LIST_CONSTANTS.ITEM_SUBMITTED_LIST_HEADER}
          description={
            ITEM_SUBMITTED_LIST_CONSTANTS.ITEM_SUBMITTED_LIST_SUBHEADER
          }
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
                label={"Request new item"}
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
          <TabComponent
            tabs={submittedRequestsTabs}
            index={index}
            setIndex={setIndex}
          />
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <SearchBarComponent
              size="md"
              placeholder="Find records by document number, year, items, etc."
            />
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
          sx={{ maxWidth: 700, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          {/* <ModalContent /> */}
          <ConsViewItemRequestedListModalContent />
        </Sheet>
      </Modal>

      {/* Success Indicators modal */}
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
          <RenderDialog lib={UrllastSegment} />
        </Sheet>
      </Modal>
    </Fragment>
  );
};

export default ItemRequest;
