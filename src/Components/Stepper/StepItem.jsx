import {
  Box,
  Divider,
  Link,
  Stack,
  Step,
  StepIndicator,
  Typography,
  useTheme,
} from "@mui/joy";
import { BiCheck, BiCircle } from "react-icons/bi";
import moment from "moment";
import PropTypes, { number } from "prop-types";
import { getStatusColorScheme } from "../../Utils/ColorScheme";
import { Fragment, useState } from "react";
import ModalComponent from "../Common/Dialog/ModalComponent";
import ChipComponent from "../Common/ChipComponent";
import { toCapitalize } from "../../Utils/Typography";
import StepTextDisplay from "./StepDisplay";
import { Check, CheckCheck } from "lucide-react";

StepItem.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.string,
  created_at: PropTypes.string,
  date_out: PropTypes.string,
  date_in: PropTypes.string,
  updated_at: PropTypes.string,
  duration: PropTypes.string,
  comment: PropTypes.string,
  date_submitted: PropTypes.string,
  processing_time: PropTypes.string,
  next_office: PropTypes.string,
  date_released: PropTypes.string,
};

function StepItem({
  position,
  name,
  area_code,
  area,
  status,
  created_at,
  date_submitted,
  approved_at,
  remarks,
  activities_with_comments,
  number_of_comments,
}) {
  const theme = useTheme();
  const color = theme.palette.custom;
  const dividerStyles = {
    color: "neutral.50",
  };
  const [viewCommentModal, setViewCommentModal] = useState(false);
  const boxStyles = {
    height: 16,
    width: 16,
    bgcolor: "success.500",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  };
  return (
    <Step
      indicator={
        status === "Pending" ? (
          <StepIndicator sx={{ bgcolor: color.lighter }}>
            <BiCircle sx={{ bgcolor: color.active }} />
          </StepIndicator>
        ) : (
          <Box sx={boxStyles}>
            <Check size={12} />
          </Box>
        )
      }
    >
      <Stack
        direction={"row"}
        sx={{ justifyContent: "space-between", alignItems: "center" }}
        ml={0.5}
        width={"100%"}
      >
        <Typography
          level={window.innerWidth < 1200 ? "body-xs" : "title-sm"}
          fontWeight={600}
        >
          {position}
        </Typography>
        <ChipComponent
          sx={{ px: window.innerWidth >= 1200 ? 0.8 : 1, fontWeight: 400 }}
          size={"sm"}
          label={toCapitalize(status) ?? "Pending"}
          color={getStatusColorScheme(status?.toLowerCase())}
          variant={status === "submitted" ? "outlined" : "solid"}
        />
      </Stack>

      <Stack gap={1.5} ml={0.7}>
        <Typography fontWeight={400} level="body-xs">
          <Typography>Approved by: </Typography>

          <Typography textColor={"neutral.900"}> {name}</Typography>
        </Typography>
        <Divider sx={dividerStyles} />
        <StepTextDisplay
          label={"Approved on:"}
          value={moment().format("LLL")}
        />
        <Divider sx={dividerStyles} />
        {number_of_comments > 0 && (
          <>
            <StepTextDisplay
              label={"Has wrote:"}
              value={`${number_of_comments} comments in ${activities_with_comments} activities`}
            />
            <Divider sx={dividerStyles} />
          </>
        )}
        {remarks && (
          <Typography
            level="body-xs"
            fontWeight={400}
            textColor={"neutral.900"}
          >
            {remarks}
          </Typography>
        )}
      </Stack>

      {/* <Divider sx={{ my: 0.3 }} /> */}
      {/* BODY */}
      <Stack my={1} gap={{ xs: 2, sm: 1 }}>
        {remarks !== null && (
          <Link
            sx={{ fontSize: 12, textDecoration: "underline" }}
            onClick={() => setViewCommentModal(true)}
          >
            See remarks
          </Link>
        )}
      </Stack>

      {/* COMMENT */}
      <ModalComponent
        title={`Transaction remarks`}
        description={
          "The following information was recorded when the date of the transaction was updated."
        }
        isOpen={viewCommentModal}
        minWidth={500}
        maxWidth={500}
        noRightButton
        leftButtonLabel={"Close"}
        handleClose={() => setViewCommentModal(false)}
        leftButtonAction={() => setViewCommentModal(false)}
        content={
          <Stack gap={4}>
            <Typography level="body-sm">Remarks:</Typography>
            <Typography mt={1} fontSize={15}>
              {remarks}
            </Typography>
          </Stack>
        }
      />
    </Step>
  );
}

export default StepItem;
