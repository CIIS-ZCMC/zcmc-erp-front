import React from "react";

import {
  Sheet,
  Typography,
  Stack,
  Link,
  IconButton,
  Divider,
  Box,
} from "@mui/joy";
import { ExternalLink, LogOutIcon } from "lucide-react";
import useSidebarHook from "../../../Hooks/SidebarHook";
import { MdHelpOutline } from "react-icons/md";
import { BASE_URL } from "../../../Services/Config";
import MenuItemComponent from "../Content/MenuItemComponent";
import ConfirmationModal from "../../../Components/Common/Dialog/ConfirmationModal";
import useModalHook from "../../../Hooks/ModalHook";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
const Footer = () => {
  const { isCollapsed } = useSidebarHook();
  const { setConfirmationModal, closeConfirmation } = useModalHook();

  const handleOpen = () => {
    const data = {
      status: "warning",
      title: "Please confirm, are you sure you want to logout?",
      description: "You will be logged out of the ERP system.",
    };
    setConfirmationModal(data);
  };
  const handleLogOut = () => {
    window.location.href = BASE_URL.development_landing_page;
  };

  return (
    <div>
      <Sheet
        sx={{
          p: 1.5,
          borderRadius: "10px",
          backgroundColor: "#0A223E",
          mt: 2,
        }}
      >
        {!isCollapsed ? (
          <>
            <Typography
              level="title-sm"
              sx={{
                color: "#E6E6E6",
                mb: 1,
              }}
            >
              Help and Support
            </Typography>
            <Typography
              level="body-sm"
              fontSize={12}
              sx={{
                color: "#E6E6E6",
              }}
            >
              Let us know about your experience. Your feedback is invaluable in
              ensuring the stability of the new AOP and PPMP Management System.
            </Typography>

            <Stack mt={2} direction={"row"} alignItems={"center"}>
              <Link>
                <Stack direction={"row"} alignItems={"center"}>
                  <Typography mr={1} fontSize={12} sx={{ color: "#E6E6E6" }}>
                    Chat with support
                  </Typography>
                  <ExternalLink color="#E6E6E6" size={16} />
                </Stack>
              </Link>
            </Stack>
          </>
        ) : (
          <IconButton
            sx={{
              color: "white",
              fontSize: 20,
              ":hover": { color: "#0A223E" },
            }}
          >
            <MdHelpOutline />
          </IconButton>
        )}
      </Sheet>

      <Divider sx={{ my: 3 }} />

      {!isCollapsed ? (
        <>
          {" "}
          <Stack direction="row" alignItems="center" padding={1}>
            <Box>{<LogOutIcon color="orange" />}</Box>
            {!isCollapsed && (
              <Link
                component="button"
                ml={1}
                fontSize={{ xs: 12, md: 13 }}
                sx={{ color: "orange" }}
                onClick={() => handleOpen()}
                underline="never"
              >
                Log out
              </Link>
            )}
          </Stack>
        </>
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="center">
          <IconButton
            sx={{
              color: "orange",
              fontSize: 20,
              ":hover": { color: "orange" },
            }}
            onClick={() => handleOpen()}
          >
            <LogOutIcon />
          </IconButton>
        </Stack>
      )}
      <ConfirmationModalComponent
        leftButtonLabel="No, go back"
        rightButtonAction={() => handleLogOut()}
        rightButtonLabel="Yes, continue"
      />
    </div>
  );
};

export default Footer;
