import zcmc_logo from "../../assets/zcmc.png";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";

import { SYSTEM_NAME } from "../../Data/constants";
import "./Sidebar.css";
import { ChevronLeftIcon, MenuIcon } from "lucide-react";
import { MdMenu, MdMenuOpen } from "react-icons/md";
import useSidebarHook from "../../Hooks/SidebarHook";

function BrandLogo() {
  const theme = useTheme();
  const color = theme.palette.custom;
  const { isCollapsed, toggleSidebar } = useSidebarHook();
  return (
    <Stack
      gap={1}
      p={1.5}
      sx={{ backgroundColor: color.light, borderRadius: theme.radius.lg }}
    >
      <Stack
        direction={isCollapsed ? "column" : "row"}
        gap={1}
        alignItems={"flex-start"}
        paddingX={isCollapsed ? 1 : 0}
      >
        <img src={zcmc_logo} style={{ width: "33px", height: "44px" }} />

        {/* TEXT */}
        {!isCollapsed && (
          <>
            <Box>
              <Typography
                fontSize={{ xs: 6, md: 8 }}
                fontWeight={200}
                sx={{ color: "white" }}
              >
                Republic of the Philippines
              </Typography>
              <Typography fontSize={{ xs: 10, md: 12 }} sx={{ color: "white" }}>
                Zamboanga City Medical Center
              </Typography>
              <Typography
                fontSize={{ xs: 6, md: 8 }}
                fontWeight={200}
                fontStyle={"italic"}
                sx={{ color: "white" }}
              >
                Dr. Evangelista St., Zamboanga City, Philippines 7000
              </Typography>
            </Box>
          </>
        )}

        <IconButton
          onClick={toggleSidebar}
          sx={{ color: "white", fontSize: 25 }}
        >
          {isCollapsed ? <MdMenu /> : <MdMenuOpen />}
        </IconButton>
      </Stack>

      {!isCollapsed && (
        <>
          <Divider sx={{ mx: 1, borderColor: "white" }} />

          {/* SYSTEM NAME */}
          <Typography
            textAlign={"center"}
            fontSize={14}
            sx={{ color: "white", fontWeight: 500 }}
          >
            {SYSTEM_NAME}
          </Typography>
        </>
      )}
    </Stack>
  );
}

export default BrandLogo;
