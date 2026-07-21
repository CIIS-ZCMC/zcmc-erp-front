import BoxComponent from "@Components/Common/Card/BoxComponent";
import PageTitle from "@Components/Common/PageTitle";
import TabComponent from "@Components/Common/TabComponent";
import ButtonComponent from "@Components/Common/ButtonComponent";
import { userItmRequestTabs } from "@Data/Options";
import { Stack, Typography } from "@mui/joy";
import React, { Fragment, useState, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import NewRequestModal from "@Pages/PPMP/EndUser/Modal/AddItemRequest/NewRequestModal";

export default function ItemRequestsLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openRequest, setOpenRequest] = useState(false);

  const index = useMemo(() => {
    const path = location.pathname;
    const found = userItmRequestTabs.find((tab) =>
      tab.path === ""
        ? path.endsWith("/new-item-requests")
        : path.includes(tab.path),
    );
    return found?.value ?? userItmRequestTabs[0].value;
  }, [location.pathname]);

  const handleTabChange = (newValue) => {
    const selectedTab = userItmRequestTabs.find(
      (tab) => tab.value === newValue,
    );
    if (selectedTab) {
      navigate(
        selectedTab.path === ""
          ? "/new-item-requests"
          : `/new-item-requests/${selectedTab.path}`,
      );
    }
  };

  return (
    <Fragment>
      <PageTitle title={"My Item Requests"} />
      <BoxComponent
        bgColor={"#F9FAFB"}
        my={2}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
      >
        <Stack>
          <Typography level="body-md" sx={{ fontWeight: 600 }}>
            My Item Requests{" "}
          </Typography>
          <Typography level="body-xs">
            Track the approval status of new items you have requested from
            Dispensing Units.
          </Typography>
        </Stack>
      </BoxComponent>

      <Stack spacing={2}>
        <TabComponent
          tabs={userItmRequestTabs}
          index={index}
          handleTabChange={handleTabChange}
        />
        <Stack direction={"row"} justifyContent={"flex-end"} py={1}>
          <ButtonComponent
            label={"Request New Item"}
            startDecorator={<Add />}
            onClick={() => setOpenRequest(true)}
          />
        </Stack>

        <Outlet />
      </Stack>

      {openRequest && (
        <NewRequestModal
          openNewRequest={openRequest}
          setOpenNewRequest={setOpenRequest}
        />
      )}
    </Fragment>
  );
}
