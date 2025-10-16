import ButtonComponent from "@Components/Common/ButtonComponent";
import { Box, Stack, Typography, useTheme } from "@mui/joy";
import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import no_result from "../../../assets/empty-state-icon-base.svg";
import { ANNUAL_OPS } from "../../../Data/constants";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import TextareaComponent from "@Components/Form/TextareaComponent";
import {
  useMission,
  useObjectivesActions,
} from "../../../Store/objectivesStore";
import { Warning } from "@mui/icons-material";
import { BatteryWarning, Warehouse } from "lucide-react";
import InputComponent from "@Components/Form/InputComponent";

const FiscalYearModal = ({ value, onChange, fiscalYear }) => {
  const { missionPlaceHolder } = ANNUAL_OPS;
  const theme = useTheme();
  const color = theme.palette.custom;

  return (
    <>
      <Stack spacing={2}>
        <InputComponent
          label={"Fiscal Year"}
          fontWeight={500}
          value={fiscalYear}
          disabled
        />
        <TextareaComponent
          label={"Mission"}
          placeholder={missionPlaceHolder}
          value={value}
          onChange={onChange}
        />
        <Stack
          direction="row"
          spacing={2}
          bgcolor="#FFF4E5"
          p={2}
          borderRadius={8}
        >
          <Box>
            <Warning sx={{ color: color.warning, fontSize: 20 }} />
          </Box>
          <Typography color="warning" level="body-xs">
            After creating this new AOP, you’ll need to define its details such
            as functions, objectives, activities, resources and responsible
            persons before formal submission. This AOP will remain in draft mode
            until all required information is completed and submitted for
            review.
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

function DashboardEndUser(props) {
  const navigate = useNavigate();
  const [openFiscalYearModal, setOpenFiscalYearModal] = useState(false);
  const { header, description } = ANNUAL_OPS;
  const mission = useMission();
  const { setMission, clearMission } = useObjectivesActions();

  const currentYear = new Date().getFullYear();
  const currentFiscalYear = currentYear + 1;

  return (
    <Fragment>
      <Stack>
        <Typography level="h2">Enterprise Resource Planning System</Typography>
        <Typography level="body-xs">Sample description</Typography>
      </Stack>

      <Stack
        height="85vh"
        sx={{ border: "2px solid #003049", borderRadius: 10, bgcolor: "white" }}
        alignItems="center"
        justifyContent="center"
        mt={3}
        gap={2}
      >
        <img src={no_result} alt="not-found-img" width={300} />

        <Box>
          <Typography fontSize={24} textAlign="center">
            You don't have an AOP for this year yet.{" "}
          </Typography>
          <Typography
            sx={{ color: "#003049", fontSize: 24, fontWeight: "bold" }}
            textAlign="center"
          >
            Begin by creating a new AOP.
          </Typography>
        </Box>

        <Typography width={"35%"} textAlign="center">
          Nothing to show yet for this year’s PPMP. You may request new items
          for the meantime or create a new AOP request.
        </Typography>
        <Stack direction="row" gap={1}>
          <ButtonComponent label="Request new items" variant="outlined" />
          <ButtonComponent
            label="Create New AOP"
            variant="solid"
            onClick={() => setOpenFiscalYearModal(true)}
          />
        </Stack>
      </Stack>

      <ModalComponent
        isOpen={openFiscalYearModal}
        handleClose={() => setOpenFiscalYearModal(false)}
        title={header}
        description={description}
        content={
          <FiscalYearModal
            fiscalYear={currentFiscalYear}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
          />
        }
        hasActionButtons={true}
        rightButtonLabel={"Save AOP"}
        rightButtonAction={() => handleSaveAOP()}
        minWidth={500}
      />
    </Fragment>
  );
}

export default DashboardEndUser;
