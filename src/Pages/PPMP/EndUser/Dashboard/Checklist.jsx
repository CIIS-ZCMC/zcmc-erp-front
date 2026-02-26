import BoxComponent from "@Components/Common/Card/BoxComponent";
import {
  Box,
  Checkbox,
  List,
  ListDivider,
  ListItem,
  ListItemDecorator,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { grey } from "@mui/material/colors";
import React from "react";

export default function Checklist({ checklist = [], isDispensing = false }) {
  const theme = useTheme();
  const color = theme.palette.custom;
  return (
    <Box
      width={!isDispensing ? "60%" : "100%"}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: !isDispensing ? "60vh" : "40vh", // 👈 parent owns height
        minHeight: 0, // 🔑 required for flex scrolling children
        borderColor: "neutral.100",
        bgcolor: "white",
      }}
    >
      {console.log(checklist)}
      <Typography level="title-lg" p={2}>
        PPMP Checklist
      </Typography>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto", // ✅ only this scrolls
          pr: 1,
          p: 1,
        }}
      >
        <List size="lg" component="nav" variant="">
          {checklist?.map((list, key) => (
            <>
              <ListItem>
                <ListItemDecorator>
                  <Checkbox
                    checked={!!list.status}
                    color={!!list.status && "success"}
                  />
                </ListItemDecorator>
                <Stack>
                  <Typography
                    level={list?.status ? "title-sm" : "body-sm"}
                    sx={{
                      color: list?.status ? grey[900] : grey[400],
                    }}
                  >
                    {list?.title}
                  </Typography>
                  <Typography
                    level="body-xs"
                    fontWeight={400}
                    sx={{
                      color: list?.status ? grey[700] : grey[400],
                    }}
                    textAlign={"justify"}
                  >
                    {list?.description}
                  </Typography>
                </Stack>
              </ListItem>
              <ListDivider inset={"gutter"} />
            </>
          ))}
        </List>
      </Box>
    </Box>
  );
}
