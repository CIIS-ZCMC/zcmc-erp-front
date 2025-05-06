import PropTypes from "prop-types";
import { Card, CardContent, Divider, Link, Stack, Typography } from "@mui/joy";
import moment from "moment";
import CardInfoDisplay from "./CardInfoDisplay";
import BoxComponent from "./BoxComponent";
import { getStatusColorScheme } from "../../../Utils/ColorScheme";
import ChipComponent from "../ChipComponent";
import { ExternalLink, MapPin } from "lucide-react";
import { toCapitalize } from "../../../Utils/Typography";

AOPCardComponent.propTypes = {
  title: PropTypes.string,
  variant: PropTypes.string,
  width: PropTypes.string,
  type: PropTypes.string,
  status: PropTypes.string,
  statusLabel: PropTypes.string, // Default is "Pending"
  transaction_code: PropTypes.string,
  timeline_duration: PropTypes.string,
  request_date: PropTypes.string,
  grand_total: PropTypes.string,
  // onClick: PropTypes.func,
  handleCopy: PropTypes.func,
  currentlyOn: PropTypes.string,
  requester: PropTypes.string,
  completed_on: PropTypes.string,
  purchase_order_number: PropTypes.string,
  cancelled_on: PropTypes.string,
};

function AOPCardComponent({
  title = "AOP #2023-0031 for fiscal year 2026",
  variant = "outlined",
  status = "approved",
  statusLabel,
  date_requested,
  date_returned,
  date_approved,
  leftClick, // The whole card
  rightClick, // The whole card
  requester_area, // Area display
}) {
  const linkStyles = {
    color: "success.700",
    fontSize: 12.5,
    gap: 0.5,
    "&: hover": {
      textDecoration: "none",
    },
  };
  return (
    <Card
      variant={variant}
      data-resizable
      sx={{
        width: "auto",
        backgroundColor: "white",
        border: 1,
        borderColor: "neutral.100",
        boxShadow: "md",
        // "&: hover": {
        //   cursor: "pointer",
        //   backgroundColor: `neutral.50`,
        // },
      }}
      orientation="horizontal"
      // onClick={onClick}
    >
      <CardContent>
        {/* TITLE */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            alignItems: { xs: "start", md: "center" },
            justifyContent: "space-between",
            mt: 1,
            gap: 1,
          }}
        >
          <Typography
            level="title-md"
            fontWeight={600}
            textColor={"success.700"}
          >
            {title}
          </Typography>
          <ChipComponent
            status={status}
            variant={"soft"}
            label={toCapitalize(statusLabel ?? status)}
            color={getStatusColorScheme(status)}
          />
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* CONTENT */}
        <Stack spacing={2} width={"100%"}>
          {requester_area && (
            <Typography fontSize={12}>
              Requested by: <br />
              <b>{requester_area}</b>
            </Typography>
          )}

          {/* DATES */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <BoxComponent width={{ xs: "auto", md: "60%" }}>
              <CardInfoDisplay
                label={"Date created:"}
                value={moment(date_requested).format("LL (LT)")}
              />
            </BoxComponent>

            {date_returned && (
              <BoxComponent width={{ xs: "auto", md: "60%" }}>
                <CardInfoDisplay
                  label={"Date returned:"}
                  value={
                    <Typography color={"danger"}>
                      {moment(date_returned).format("LL (LT)")}
                    </Typography>
                  }
                />
              </BoxComponent>
            )}

            <BoxComponent width={{ xs: "auto", md: "60%" }}>
              <CardInfoDisplay
                label={"Date approved:"}
                value={
                  <Typography color={"success"}>
                    {date_approved
                      ? moment(date_approved).format("LL (LT)")
                      : "--"}
                  </Typography>
                }
              />
            </BoxComponent>
          </Stack>
          <Divider />
          {/* ACTIONS */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ alignItems: "start", justifyContent: "space-between" }}
          >
            <Link
              sx={{
                ...linkStyles,
                "&: hover": {
                  textDecoration: "none",
                  fontWeight: 600,
                },
              }}
              onClick={leftClick}
            >
              Open request <ExternalLink size={14} />
            </Link>
            <Link
              sx={{
                ...linkStyles,
                "&: hover": {
                  textDecoration: "none",
                  fontWeight: 600,
                },
              }}
              onClick={rightClick}
            >
              View approval timeline <MapPin size={14} />
            </Link>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default AOPCardComponent;
