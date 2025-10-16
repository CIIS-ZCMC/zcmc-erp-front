import React, { useState, useEffect, use } from "react";
import PageTitle from "../../../Components/Common/PageTitle";
import { Fragment } from "react";
import { LIBRARY_CONSTANTS } from "../../../Data/constants";
import ContainerComponent from "../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../Components/Common/ButtonComponent";
import { Divide, ExternalLink, Plus } from "lucide-react";
import { Stack, Box, Input, Divider } from "@mui/joy";
import { Outlet, useNavigate } from "react-router-dom";
import TabComponent from "../../../Components/Common/TabComponent";
import Typography from "@mui/joy/Typography";
import { useLocation } from "react-router-dom";
import useModalHook from "../../../Hooks/ModalHook";
import { libaryTabs } from "../../../Data/Options";
import ModalComponent from "../../../Components/Common/Dialog/ModalComponent";
import InputComponent from "../../../Components/Form/InputComponent";
import AutocompleteComponent from "../../../Components/Form/AutocompleteComponent";
import TextareaComponent from "../../../Components/Form/TextareaComponent";

const ItemLibrary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [index, setIndex] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    classification: "",
    category: "",
    variant: "",
    unitOfMeasurement: "",
    estimatedBudget: "",
    specs: ["", "", ""],
  });
  const [newData, setNewData] = useState({});
  const [openNew, setOpenNew] = useState(false);

  // 👇 Handle tab change and navigate
  const handleTabChange = (newValue) => {
    setIndex(newValue);
    const selectedTab = libaryTabs.find((tab) => tab.value === newValue);
    if (selectedTab) {
      navigate(selectedTab.path); // Empty string stays on /item-library
    }
  };

  const getModalContent = (index) => {
    switch (index) {
      case "":
        return (
          <Stack direction={"row"} gap={3}>
            <Stack width={"100%"} gap={3}>
              <TextareaComponent
                label="Item Name"
                minRows={2}
                helperText={
                  "Use a specific and descriptive naming convention for best results."
                }
              />
              <Stack direction={"row"} gap={1}>
                <AutocompleteComponent label="Classification" />
                <AutocompleteComponent label="Category" />
              </Stack>
              <AutocompleteComponent label="Variant" />
              <Stack direction={"row"} gap={1}>
                <AutocompleteComponent label="Unit of measurement" />
                <InputComponent label="Estimated budget" />
              </Stack>
            </Stack>

            <Stack width={"100%"} gap={1}>
              <Typography level="title-sm">Specifications</Typography>
              <Stack overflow="auto" maxHeight={"200px"}>
                {newItem.specs.map((spec, index) => (
                  <Stack key={index} mt={1}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography level="body-sm">
                        Specifications {index + 1}
                      </Typography>
                      {index > 0 && (
                        <ButtonComponent
                          label={"Remove"}
                          onClick={() => {
                            const updatedSpecs = newData.specs.filter(
                              (_, i) => i !== index
                            );
                            setNewItem({ ...newItem, specs: updatedSpecs });
                          }}
                          variant="plain"
                          color="danger"
                        />
                      )}
                    </Stack>

                    <TextareaComponent
                      value={spec}
                      onChange={(e) => {
                        const updatedSpecs = [...newItem.specs];
                        updatedSpecs[index] = e.target.value;
                        setNewItem({ ...newItem, specs: updatedSpecs });
                      }}
                      minRows={2}
                    />
                  </Stack>
                ))}
              </Stack>
              <Stack>
                <Divider sx={{ my: 1 }} />
                <ButtonComponent
                  onClick={() =>
                    setNewItem({ ...newItem, specs: [...newItem.specs, ""] })
                  }
                  label={"Add another"}
                  endDecorator={<Plus />}
                  width="150px"
                  variant="plain"
                />
              </Stack>

              <InputComponent
                label={"Authorization PIN"}
                helperText={
                  "Confirm your action by typing-in your authorization PIN."
                }
              />
            </Stack>
          </Stack>
        );
      case "classification":
        return (
          <Stack gap={2}>
            <InputComponent
              label={"Classification Name"}
              value={newData.classification}
              onChange={(e) =>
                setNewData({ ...newData, classification: e.target.value })
              }
              helperText={
                "Use a specific and descriptive naming convention for best results."
              }
            />
            <TextareaComponent
              label={"Description"}
              value={newData.description}
              onChange={(e) =>
                setNewData({ ...newData, description: e.target.value })
              }
            />
            <Divider />
            <InputComponent
              label={"Authorization PIN"}
              helperText={
                "Confirm your action by typing-in your authorization PIN."
              }
            />
          </Stack>
        );
      case "category":
        return (
          <Stack gap={2}>
            <InputComponent
              label={"Category Name"}
              value={newData.category}
              onChange={(e) =>
                setNewData({ ...newData, category: e.target.value })
              }
              helperText={
                "Use a specific and descriptive naming convention for best results."
              }
            />
            <TextareaComponent
              label={"Description"}
              value={newData.description}
              onChange={(e) =>
                setNewData({ ...newData, description: e.target.value })
              }
            />
            <Divider />
            <InputComponent
              label={"Authorization PIN"}
              helperText={
                "Confirm your action by typing-in your authorization PIN."
              }
            />
          </Stack>
        );
      case "variant":
        return (
          <Stack gap={2}>
            <AutocompleteComponent label={"System name"} />
            <InputComponent
              label={"Code"}
              value={newData.description}
              onChange={(e) =>
                setNewData({ ...newData, description: e.target.value })
              }
            />
            <Divider />
            <InputComponent
              label={"Authorization PIN"}
              helperText={
                "Confirm your action by typing-in your authorization PIN."
              }
            />
          </Stack>
        );
      default:
        return null;
    }
  };

  const { openModal, setOpenModal, successDialog, setSuccessDialog } =
    useModalHook();

  return (
    <Fragment>
      {console.log("ItemLibrary", index)}
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
                  setOpenNew(true);
                }}
              />
            </Stack>
          }
        >
          <TabComponent
            tabs={libaryTabs}
            index={index}
            handleTabChange={handleTabChange}
          />

          <br />
          <Outlet />
        </ContainerComponent>
      </Box>
      {openNew && (
        <ModalComponent
          isOpen={openNew}
          height="auto"
          maxWidth={index === "" ? "1060px" : "480px"}
          minWidth={index === "" ? "1060px" : "480px"}
          title={
            index === ""
              ? "Create New Item"
              : index === "classification"
              ? "Add New Classification"
              : index === "category"
              ? "Add New Category"
              : "Add New Variant"
          }
          description={
            index === ""
              ? "Fill-in basic identification of the item you wish to add to the item library."
              : index === "classification"
              ? "Add a new classification to the library."
              : index === "category"
              ? "Add a new category to the library."
              : "Add a new variant to the library."
          }
          handleClose={() => {
            setOpenNew(false);
          }}
          content={getModalContent(index)}
          hasActionButtons
        />
      )}
    </Fragment>
  );
};

export default ItemLibrary;
