import React, { useState, useEffect } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { Fragment } from "react";
import { LIBRARY_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { ExternalLink } from "lucide-react";
import { Stack, Box } from "@mui/joy";
import { Outlet } from "react-router-dom";
import TabsComponent from "../../../Components/Common/TabsComponent";
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
const ItemLibrary = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const UrllastSegment = location.pathname.split("/").filter(Boolean).pop();
  const ModalContent = () => {
    switch (UrllastSegment) {
      case "classification":
        return <ClassificationModalContent />;
      case "category":
        return <CategoryModalContent />;
      case "variant":
        return <VariantModalContent />;
      default:
        return <ItemModalContent />;
    }
  };
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
                  setOpen(true);
                }}
              />
            </Stack>
          }
        >
          <TabsComponent
            tabs={["Items", "Classification", "Category", "Variant"]}
            pathMap={["", "classification", "category", "variant"]}
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
        open={open}
        onClose={() => setOpen(false)}
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
    </Fragment>
  );
};

export default ItemLibrary;
