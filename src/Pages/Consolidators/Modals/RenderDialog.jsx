import IndicatorDialog from "./IndicatorDialog";
import * as React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Typography, Button, IconButton, Sheet } from "@mui/joy";
import useLibrariesHook from "../../../Hooks/Libraries/LibclassificationHook";
const RenderDialog = () => {
  return (
    <IndicatorDialog>
      <SuccessClassification />
    </IndicatorDialog>
  );
};

const SuccessClassification = () => {
  const {
    inputs,
    setInputs,
    resetInput,
    isloading,
    hasError,
    type,
    selectedData,
  } = useLibrariesHook();

  const MetaData = {
    create: {
      render: () => (
        <Typography level="title-md" fontWeight="lg">
          New item classification{" "}
          <Typography
            sx={{ color: "custom.darkgreen" }}
            component="span"
            color="primary"
            fontWeight="lg"
          >
            #2023-0031
          </Typography>{" "}
          successfully successfully saved to the library.
        </Typography>
      ),
      desc: "You can now use it for requesting AOP and PPMP documents. Everyone can see and use the new item.",
    },
    update: {
      render: () => (
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
      ),
      desc: "Everyone who has access to this application can see and use the item with the changes you’ve made.",
    },
    delete: {
      render: () => (
        <Typography level="title-md" fontWeight="lg">
          Library classification{" ( "}
          <Typography
            sx={{ color: "danger.500" }}
            component="span"
            fontWeight="lg"
          >
            #2023-0031
          </Typography>
          {") "}
          has been{" "}
          <Typography
            sx={{ color: "danger.500" }}
            component="span"
            fontWeight="lg"
          >
            successfully archived.
          </Typography>
        </Typography>
      ),
      desc: "",
    },
  };

  const getStateOfModal = () => MetaData[type];

  return (
    <>
      <CheckCircleOutlineIcon sx={{ color: "success.500", fontSize: 100 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {getStateOfModal().render()}
      </Box>
      <Typography level="body-sm" color="neutral">
        {getStateOfModal().desc}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        {type !== "delete" && (
          <Button
            sx={{ flex: 1, padding: 1.5 }}
            variant="outlined"
            color="neutral"
            endDecorator={<OpenInNewIcon fontSize="small" />}
          >
            Open item
          </Button>
        )}
        <Button sx={{ flex: 1 }} variant="solid" color="primary">
          Close
        </Button>
      </Box>
    </>
  );
};

export default RenderDialog;
