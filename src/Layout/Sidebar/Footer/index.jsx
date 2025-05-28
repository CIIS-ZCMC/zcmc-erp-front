import React from "react";

import { Sheet, Typography, Stack, Link, IconButton, Divider } from "@mui/joy";
import { ExternalLink, LogOutIcon } from "lucide-react";
import useSidebarHook from "../../../Hooks/SidebarHook";
import { MdHelpOutline } from "react-icons/md";
import { BASE_URL } from "../../../Services/Config";
const Footer = () => {
  const { isCollapsed } = useSidebarHook();
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

      <Divider sx={{ mb: 2, mt: 3 }} />
      {!isCollapsed ? (
        <Link
          fontSize={14}
          sx={{ color: "white" }}
          startDecorator={<LogOutIcon size={20} />}
          onClick={() => handleLogOut()}
        >
          Log out
        </Link>
      ) : (
        <LogOutIcon />
      )}
    </div>
  );
};

export default Footer;
