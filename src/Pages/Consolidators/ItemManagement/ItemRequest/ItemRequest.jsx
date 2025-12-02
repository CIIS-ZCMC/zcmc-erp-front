import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { ExternalLink } from "lucide-react";
import { Stack, Box, Typography } from "@mui/joy";
import { Outlet, useNavigate } from "react-router-dom";

import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { useLocation } from "react-router-dom";

import PageTitle from "../../../../Components/Common/PageTitle";
import useClassificationHooks from "../../../../Hooks/Libraries/LibClassificationHooks";
import useCategoryHooks from "../../../../Hooks/Libraries/LibCategoryHooks";
import useVariantHooks from "../../../../Hooks/Libraries/LibVarianHooks";
import useModalHook from "../../../../Hooks/ModalHook";
import { ITEM_SUBMITTED_LIST_CONSTANTS } from "../../../../Data/constants";

import ContainerComponent from "../../../../Components/Common/ContainerComponent";
import ButtonComponent from "../../../../Components/Common/ButtonComponent";
import TabComponent from "../../../../Components/Common/TabComponent";
import SearchBarComponent from "../../../../Components/SearchBarComponent";
import { submittedRequestsTabs } from "../../../../Data/Options";
import ConsViewItemRequestedListModalContent from "../../Modals/ConsViewItemRequestedListModalContent";
import { ArrowOutwardOutlined } from "@mui/icons-material";
import BoxComponent from "@Components/Common/Card/BoxComponent";
const ItemRequest = () => {
  const { openModal, setOpenModal, successDialog, setSuccessDialog } =
    useModalHook();
  const location = useLocation();
  const navigate = useNavigate();

  const parentPath = "/item-requests";

  // Extract last part (tab)
  let currentTab = location.pathname.replace(`${parentPath}/`, "");

  // If nothing after the path → user is on index route → treat as view-all
  if (currentTab === "" || currentTab === parentPath) {
    currentTab = "view-all";
  }

  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    // Sync tab when URL changes (no navigation)
    if (activeTab !== currentTab) {
      setActiveTab(currentTab);
    }
  }, [currentTab]);

  const handleTabChange = (tab) => {

    console.log(tab)
    { console.log(activeTab) }

    setActiveTab(tab);

    if (tab === "view-all") {
      navigate(parentPath); // index route
    } else {
      navigate(`${parentPath}/${tab}`);
    }
  };

  return (
    <Fragment>
      <PageTitle
        title={ITEM_SUBMITTED_LIST_CONSTANTS.ITEM_SUBMITTED_LIST_TITLE}
        description={ITEM_SUBMITTED_LIST_CONSTANTS.ITEM_SUBMITTED_LIST_SUBTITLE}
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
            {ITEM_SUBMITTED_LIST_CONSTANTS.ITEM_SUBMITTED_LIST_HEADER}
          </Typography>
          <Typography level="body-sx">
            {ITEM_SUBMITTED_LIST_CONSTANTS.ITEM_SUBMITTED_LIST_SUBHEADER}
          </Typography>
        </Stack>

        <ButtonComponent
          label={"Go to Library"}
          variant={"outlined"}
          startDecorator={<ArrowOutwardOutlined />}
          size={"sm"}
          color="primary"
        />
      </BoxComponent>

      <TabComponent
        tabs={submittedRequestsTabs}
        index={activeTab}
        setIndex={handleTabChange}
      />

      <Box mt={2}>
        <Outlet />
      </Box>
    </Fragment>
  );
};

export default ItemRequest;
