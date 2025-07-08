import React, { useState } from "react";

import {
  Sheet,
  Typography,
  Stack,
  Link,
  IconButton,
  Divider,
  Box,
  useTheme,
  Avatar,
} from "@mui/joy";
import { ExternalLink, LogOutIcon } from "lucide-react";
import useSidebarHook from "../../../Hooks/SidebarHook";
import { MdHelpOutline } from "react-icons/md";
import { BASE_URL } from "../../../Services/Config";
import MenuItemComponent from "../Content/MenuItemComponent";
import ConfirmationModal from "../../../Components/Common/Dialog/ConfirmationModal";
import useModalHook from "../../../Hooks/ModalHook";
import ConfirmationModalComponent from "../../../Components/Common/Dialog/ConfirmationModalComponent";
import { useAuth } from "../../../Store/AuthStore";
const Footer = () => {
  const { isCollapsed } = useSidebarHook();
  const { setConfirmationModal, closeConfirmation } = useModalHook();
  const { user } = useAuth();
  const profile_url = user?.profile_url || null;
  const theme = useTheme();
  const color = theme.palette.custom;
  const [logOut, setLogOut] = useState(false);

  const handleOpen = () => {
    setLogOut(true);
    const data = {
      status: "logout",
      title: "Please confirm, are you sure you want to logout?",
      description: "You will be logged out of the ERP system.",
    };
    setConfirmationModal(data);
  };
  const handleLogOut = () => {
    localStorage.removeItem("ppmp-items");
    localStorage.removeItem("ppmp-edits");
    window.location.href = BASE_URL.development_landing_page;
  };

  return (
    <div>
      <Sheet
        sx={{
          p: 1.5,
          borderRadius: "10px",
          backgroundColor: color.light,
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
              fontSize={11}
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
              ":hover": { color: "white", bgcolor: "transparent" },
            }}
          >
            <MdHelpOutline />
          </IconButton>
        )}
      </Sheet>

      <Divider sx={{ my: 2 }} />

      {!isCollapsed ? (
        <>
          {" "}
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            sx={{
              borderRadius: "10px",

              p: 1.5,
              bgcolor: color.light,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            <Avatar
              src={profile_url && profile_url}
              sx={{
                bgColor: "white",
                boxShadow: "0 0 0 2px rgba(255,255,255,0.3)",
              }}
              variant="soft"
              color="primary"
              size="md"
            >
              {profile_url ? "" : user?.name[0]}
            </Avatar>
            <Stack>
              <Typography
                level="body-sm"
                sx={{
                  color: "orange",
                }}
              >
                {" "}
                {user?.name}
              </Typography>
              <Typography level="body-xs" sx={{ color: "#E6E6E6" }}>
                {" "}
                {user?.email}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" alignItems="center" px={1}>
            <Box>{<LogOutIcon color="orange" />}</Box>
            {!isCollapsed && (
              <Link
                component="button"
                ml={1}
                level="body-sm"
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
        <>
          <Stack spacing={2} alignItems="center">
            <Avatar
              src={profile_url && profile_url}
              sx={{
                border: 5,
                borderColor: "primary.200",
                bgColor: "white",
                boxShadow: "0 0 0 2px white",
              }}
              variant="solid"
              color="primary"
            >
              {profile_url ? "" : user?.name[0]}
            </Avatar>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <IconButton
                sx={{
                  color: "orange",
                  fontSize: 20,
                  ":hover": { color: "orange", bgcolor: "transparent" },
                }}
                onClick={() => handleOpen()}
              >
                <LogOutIcon />
              </IconButton>
            </Stack>
          </Stack>
        </>
      )}
      {logOut && (
        <ConfirmationModalComponent
          leftButtonLabel="No, go back"
          rightButtonAction={() => handleLogOut()}
          rightButtonLabel="Yes, continue"
          btnColor="danger"
        />
      )}
    </div>
  );
};

export default Footer;
