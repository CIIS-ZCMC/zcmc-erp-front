import React, { useState, useEffect, Fragment } from "react";
import { Stack, Box, Typography } from "@mui/joy";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ArrowOutwardOutlined } from "@mui/icons-material";

import PageTitle from "../../../../Components/Common/PageTitle";
import ButtonComponent from "../../../../Components/Common/ButtonComponent";
import TabComponent from "../../../../Components/Common/TabComponent";
import BoxComponent from "@Components/Common/Card/BoxComponent";

import useModalHook from "../../../../Hooks/ModalHook";
import { ITEM_SUBMITTED_LIST_CONSTANTS } from "../../../../Data/constants";

import { submittedRequestsTabs } from "../../../../Data/Options";

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
    currentTab = "";
  }

  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    // Sync tab when URL changes (no navigation)
    if (activeTab !== currentTab) {
      setActiveTab(currentTab);
    }

    console.log(activeTab);
  }, [currentTab]);

  const handleTabChange = (tab) => {
    // console.log(tab)
    // { console.log(activeTab) }

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
        title={"Item Information Management"}
        description={
          "This is a centralized control for all item-related data and requests. Manage item libraries, classifications, categories, and variants to ensure accurate and organized resource information across the system."
        }
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
          <Typography level="body-xs">
            {ITEM_SUBMITTED_LIST_CONSTANTS.ITEM_SUBMITTED_LIST_SUBHEADER}
          </Typography>
        </Stack>
        {/* 
        <ButtonComponent
          label={"Go to Library"}
          variant={"outlined"}
          startDecorator={<ArrowOutwardOutlined />}
          size={"sm"}
          color="primary"
        /> */}
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
