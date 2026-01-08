import React, { useState, useEffect, use, useMemo } from "react";
import PageTitle from "../../../../Components/Common/PageTitle";
import { Fragment } from "react";
import { LIBRARY_CONSTANTS } from "../../../../Data/constants";
import ContainerComponent from "../../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../../Components/Common/ButtonComponent";
import { Divide, ExternalLink, Plus } from "lucide-react";
import { Stack, Box, Input, Divider } from "@mui/joy";
import { Outlet, useNavigate } from "react-router-dom";
import TabComponent from "../../../../Components/Common/TabComponent";
import Typography from "@mui/joy/Typography";
import { useLocation } from "react-router-dom";
import useModalHook from "../../../../Hooks/ModalHook";
import { libaryTabs } from "../../../../Data/Options";
import ModalComponent from "../../../../Components/Common/Dialog/ModalComponent";
import InputComponent from "../../../../Components/Form/InputComponent";
import AutocompleteComponent from "../../../../Components/Form/AutocompleteComponent";
import TextareaComponent from "../../../../Components/Form/TextareaComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";

const ItemLibrary = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const index = useMemo(() => {
    const path = location.pathname;

    const found = libaryTabs.find((tab) =>
      tab.path === "" ? path.endsWith("/item-library") : path.includes(tab.path)
    );

    return found?.value ?? libaryTabs[0].value;
  }, [location.pathname]);

  /** --------------------------------
   *  Handle tab navigation
   * -------------------------------- */
  const handleTabChange = (newValue) => {
    const selectedTab = libaryTabs.find((tab) => tab.value === newValue);
    if (selectedTab) navigate(selectedTab.path);
  };

  const { openModal, setOpenModal, successDialog, setSuccessDialog } =
    useModalHook();

  return (
    <Fragment>
      <PageTitle
        title={LIBRARY_CONSTANTS.LIBRARY_TITLE}
        description={LIBRARY_CONSTANTS.LIBRARY_SUBTITLE}
        items={[
          {
            label: "Item Information Library",
            current: true,
          },
        ]}
      />

      <BoxComponent
        bgColor={"#F9FAFB"}
        my={2}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
      >
        <Stack>
          <Typography level="body-md" sx={{ fontWeight: 600 }}>
            Item Information Library
          </Typography>
          <Typography level="body-xs">
            Manage the master library for procurement items, classifications,
            categories, and variants. This serves as the central repository for
            all item-related information used across the AOP and PPMP.{" "}
          </Typography>
        </Stack>
      </BoxComponent>
      <Stack spacing={2}>
        <TabComponent
          tabs={libaryTabs}
          index={index}
          handleTabChange={handleTabChange}
        />

        <Outlet />
      </Stack>
    </Fragment>
  );
};

export default ItemLibrary;
