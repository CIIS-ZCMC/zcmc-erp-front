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
import { BiCircle } from "react-icons/bi";
import moment from "moment";
import PropTypes from "prop-types";
import { getStatusColorScheme } from "../../Utils/ColorScheme";
import { Fragment, useState } from "react";
import ModalComponent from "../Common/Dialog/ModalComponent";
import ChipComponent from "../Common/ChipComponent";
import { toCapitalize } from "../../Utils/Typography";
import StepTextDisplay from "./StepDisplay";
import { Check } from "lucide-react";

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
  area,
  area_code,
  status,
  approved_at,
  submitted_at,
  remarks,
  activities_with_comments,
  number_of_comments,
  isLast,
  date_approved,
  returned_at,
  role,
  turnaround,
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
    <Fragment>
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
            sx={{ textTransform: "uppercase" }}
          >
            {role ? role : position}{" "}
            {role === "Division Chief" && name && `(${area_code})`}
          </Typography>

          <ChipComponent
            sx={{ px: window.innerWidth >= 1200 ? 0.8 : 1, fontWeight: 400 }}
            size={"sm"}
            label={toCapitalize(status) ?? "pending"}
            color={getStatusColorScheme(status?.toLowerCase())}
            variant={status === "submitted" ? "outlined" : "solid"}
          />
        </Stack>

        <Stack ml={0.7} spacing={0.5} mb={1}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "start", sm: "center" },
            }}
          >
            <Typography level="body-xs">
              {status === "submitted"
                ? "Submitted "
                : status === "approved"
                  ? "Approved"
                  : status === "pending"
                    ? "To be approved"
                    : "Returned"}{" "}
              by:{" "}
            </Typography>

            <Typography textColor={"neutral.900"} level="body-xs">
              {" "}
              {name}
            </Typography>
          </Stack>
          {/* <Divider sx={dividerStyles} /> */}
          {status === "submitted" && (
            <>
              <StepTextDisplay
                label={"Submitted on:"}
                value={moment(submitted_at).format("LLL")}
              />
              {/* <Divider sx={dividerStyles} /> */}
            </>
          )}
          {approved_at && (
            <>
              <StepTextDisplay
                label={"Approved on:"}
                value={moment(approved_at).format("LLL")}
              />
              {/* <Divider sx={dividerStyles} /> */}
            </>
          )}
          {returned_at && (
            <>
              <StepTextDisplay
                label={"Returned on:"}
                value={moment(returned_at).format("LLL")}
              />
              {/* <Divider sx={dividerStyles} /> */}
            </>
          )}
          {turnaround && (
            <>
              <StepTextDisplay label={"Turnaround Time:"} value={turnaround} />
              {/* <Divider sx={dividerStyles} /> */}
            </>
          )}

          {number_of_comments > 0 && (
            <>
              <StepTextDisplay
                label={"Has wrote:"}
                value={`${number_of_comments} comments in ${activities_with_comments} activities`}
              />
              <Divider sx={dividerStyles} />
            </>
          )}

          {remarks !== null && (
            <Link
              sx={{ fontSize: 12, textDecoration: "none" }}
              onClick={() => setViewCommentModal(true)}
            >
              See remarks
            </Link>
          )}
        </Stack>

        {/* <Divider sx={{ my: 0.3 }} /> */}
        {/* BODY */}
      </Step>

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
          <Stack spacing={1}>
            <Typography level="body-sm">Remarks:</Typography>
            <Typography fontSize={15}>{remarks}</Typography>
          </Stack>
        }
      />
    </Fragment>
  );
}

export default StepItem;
