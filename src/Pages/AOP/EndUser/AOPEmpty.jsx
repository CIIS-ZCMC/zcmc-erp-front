import React, { useState } from "react";
import { Stack, Typography, Box } from "@mui/joy";
import { Check } from "lucide-react";
import ButtonComponent from "@Components/Common/ButtonComponent";
import ModalComponent from "@Components/Common/Dialog/ModalComponent";
import no_result from "../../../assets/empty-state-icon-base.svg";
import { AOP } from "../../../Data/constants";
import { ThreeDotsLoader } from "@Components/Common/Loading/ThreeDotsLoader";
import useAOPStore from "../../../Store/AOPStore";
import useAOPHook from "../../../Hooks/AOP/AOPHook";
import { useAOPApplicationsActions } from "../../../Hooks/AOP/AOPApplicationsHook";
import useSnackbarHook from "../../../Hooks/SnackbarHook";
import useModalHook from "../../../Hooks/ModalHook";

const AOPEmpty = ({
  setOpenFiscalYearModal,
  setOpenNewRequest,
  handleRedraft,
  onRedraftSuccess,
  isLoading = false,
}) => {
  const {
    EMPTY_STATE_TITLE,
    EMPTY_STATE_SUBTITLE,
    EMPTY_STATE_DESCRIPTION,
    PAGE_TITLE,
    PAGE_DESCRIPTION,
  } = AOP;

  const { fiscalYear } = useAOPStore();
  const { getAopBySectorAndYear } = useAOPHook();
  const { redraftPPMP } = useAOPApplicationsActions();
  const { showSnack } = useSnackbarHook();
  const { setAlertDialog } = useModalHook();

  const [openRedraftModal, setOpenRedraftModal] = useState(false);
  const [isRedrafting, setIsRedrafting] = useState(false);

  const handleOpenRedraft = () => {
    if (handleRedraft) {
      handleRedraft();
    } else {
      setOpenRedraftModal(true);
    }
  };

  const handleContinueRedraft = () => {
    setIsRedrafting(true);

    const payload = {
      target_year: fiscalYear,
      from_year: Number(fiscalYear) - 1,
      year: fiscalYear,
    };

    redraftPPMP(payload, (status, message) => {
      setIsRedrafting(false);
      if (status === 200) {
        setOpenRedraftModal(false);
        const successMessage =
          message || "Successfully imported previous year's AOP-PPMP.";
        showSnack(200, successMessage);

        if (onRedraftSuccess) {
          onRedraftSuccess();
        } else {
          getAopBySectorAndYear({ year: fiscalYear });
        }
      } else {
        setAlertDialog({
          status: "error",
          title: "Import AOP-PPMP Failed",
          description:
            message ||
            "Unable to import previous year's AOP-PPMP. Please ensure you have an approved or submitted AOP from the previous year.",
        });
      }
    });
  };

  return (
    <>
      <Stack>
        <Typography level="h2">{PAGE_TITLE}</Typography>

        <Typography level="body-xs">{PAGE_DESCRIPTION}</Typography>
      </Stack>

      <Stack
        height="85vh"
        sx={{
          border: "2px solid #003049",
          borderRadius: 10,
          bgcolor: "white",
        }}
        alignItems="center"
        justifyContent="center"
        mt={3}
        gap={2}
      >
        {isLoading ? (
          <ThreeDotsLoader />
        ) : (
          <>
            <img src={no_result} alt="not-found-img" width={300} />

            <Box>
              <Typography fontSize={24} textAlign="center">
                {EMPTY_STATE_TITLE}
              </Typography>
              <Typography
                sx={{ color: "#003049", fontSize: 24, fontWeight: "bold" }}
                textAlign="center"
              >
                {EMPTY_STATE_SUBTITLE}
              </Typography>
            </Box>

            <Typography width={"35%"} textAlign="center">
              {EMPTY_STATE_DESCRIPTION}
            </Typography>
            <Stack direction="row" gap={1}>
              {/* <ButtonComponent
                label="Request new items"
                variant="outlined"
                onClick={() => setOpenNewRequest(true)}
              /> */}
              <ButtonComponent
                label="Import Previous Year’s AOP-PPMP"
                variant="outlined"
                onClick={handleOpenRedraft}
              />
              <ButtonComponent
                label="Create New AOP"
                variant="solid"
                onClick={() => setOpenFiscalYearModal(true)}
              />
            </Stack>
          </>
        )}
      </Stack>

      {/* Confirmation Modal - Use Previous Year's AOP-PPMP */}
      <ModalComponent
        isOpen={openRedraftModal}
        handleClose={() => setOpenRedraftModal(false)}
        title="Use Previous Year’s AOP-PPMP?"
        description="Start your new AOP-PPMP using your previous AOP-PPMP. Your previous year's information will be copied to the new AOP-PPMP for you to review and update."
        maxWidth={570}
        noDivider={true}
        hasActionButtons={true}
        leftButtonLabel="Cancel"
        leftButtonVariant="outlined"
        leftButtonAction={() => setOpenRedraftModal(false)}
        rightButtonLabel="Continue"
        rightButtonAction={handleContinueRedraft}
        isLoading={isRedrafting}
        content={
          <Box
            sx={{
              bgcolor: "#F5F5F5",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "8px",
              p: 2.5,
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Typography
              level="title-sm"
              sx={{ fontWeight: 600, color: "neutral.800" }}
            >
              The following will be carried over:
            </Typography>

            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Check size={16} strokeWidth={2.5} color="#004366" />
                <Typography level="body-sm" sx={{ color: "neutral.700" }}>
                  Objectives
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Check size={16} strokeWidth={2.5} color="#004366" />
                <Typography level="body-sm" sx={{ color: "neutral.700" }}>
                  Activities
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Check size={16} strokeWidth={2.5} color="#004366" />
                <Typography level="body-sm" sx={{ color: "neutral.700" }}>
                  Resources
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Check size={16} strokeWidth={2.5} color="#004366" />
                <Typography level="body-sm" sx={{ color: "neutral.700" }}>
                  Targets and other applicable details
                </Typography>
              </Stack>
            </Stack>

            <Typography
              level="body-xs"
              sx={{ color: "neutral.600", mt: 0.5, lineHeight: 1.5 }}
            >
              Nothing will be submitted automatically. You can review and make
              changes before submitting your FY {fiscalYear || 2027} AOP-PPMP.
            </Typography>
          </Box>
        }
      />
    </>
  );
};

export default AOPEmpty;
