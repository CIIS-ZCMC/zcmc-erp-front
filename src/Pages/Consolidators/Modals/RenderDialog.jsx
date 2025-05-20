import IndicatorDialog from "./IndicatorDialog";
import * as React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Typography, Button, IconButton, Sheet } from "@mui/joy";
const RenderDialog = () => {
  return (
    <IndicatorDialog>
      <SuccessClassification />
    </IndicatorDialog>
  );
};

const SuccessClassification = () => {
  return (
    <>
      <CheckCircleOutlineIcon sx={{ color: "success.500", fontSize: 100 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography level="title-md" fontWeight="lg">
          Library classification{" "}
          <Typography
            sx={{ color: "custom.darkgreen" }}
            component="span"
            color="primary"
            fontWeight="lg"
          >
            #2023-0031
          </Typography>{" "}
          successfully updated.
        </Typography>
      </Box>
      <Typography level="body-sm" color="neutral">
        Everyone who has access to this application can see and use the item
        with the changes you’ve made.
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Button
          sx={{ flex: 1, padding: 1.5 }}
          variant="outlined"
          color="neutral"
          endDecorator={<OpenInNewIcon fontSize="small" />}
        >
          Open item
        </Button>
        <Button sx={{ flex: 1 }} variant="solid" color="primary">
          Close
        </Button>
      </Box>
    </>
  );
};

export default RenderDialog;
