import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import moment from "moment";
import { getStatusColorScheme } from "../../../Utils/ColorScheme";
import ChipComponent from "../ChipComponent";
import { ArrowRight, Download } from "lucide-react";
import ButtonComponent from "../ButtonComponent";
import formattedPrice from "../../../Utils/formattedPrice";
import { formatPeso } from "@Utils/FormatPeso";
import { CloudDownloadOutlined } from "@mui/icons-material";

AOPCardComponent.propTypes = {
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.string,
  status: PropTypes.string,
  statusLabel: PropTypes.string,
  area_code: PropTypes.string,
  date_requested: PropTypes.string,
  date_returned: PropTypes.string,
  date_approved: PropTypes.string,
  leftClick: PropTypes.func,
  rightClick: PropTypes.func,
  handlePrint: PropTypes.func,
  total_cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function AOPCardComponent({
  year = new Date().getFullYear()?.toString(),
  variant = "soft",
  status = "Pending",
  statusLabel,
  area_code = "OMCC",
  date_requested,
  date_returned,
  date_approved,
  leftClick,
  rightClick,
  handlePrint,
  total_cost,
}) {
  return (
    <Card
      variant="soft"
      sx={{
        width: "100%",
        bgcolor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "16px",
        p: 2,
        boxShadow: "xs",
        transition: "0.2s",
        "&:hover": {
          boxShadow: "sm",
          borderColor: "neutral.300",
        },
      }}
    >
      <CardContent sx={{ p: 0.5 }}>
        {/* TOP ROW: AOP Year & Status Badge */}
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <ChipComponent
            status={statusLabel?.toLowerCase()}
            variant={"soft"}
            label={statusLabel}
            color={getStatusColorScheme((statusLabel || "").toLowerCase())}
          />
        </Stack>

        {/* MIDDLE ROW: Title, Subtitle, and Cost Box */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          my={1.5}
          gap={2}
        >
          <Stack flex={1}>
            <Typography
              level="body-sm"
              sx={{ color: "neutral.500", fontWeight: 600 }}
            >
              AOP {year}
            </Typography>
            <Typography
              level="title-lg"
              fontWeight={700}
              sx={{ color: "neutral.900" }}
            >
              {area_code}
            </Typography>
            <Typography level="body-sm" sx={{ color: "neutral.500" }}>
              Submitted on:{" "}
              {date_requested
                ? moment(date_requested).format("MMMM DD, YYYY")
                : "-"}
            </Typography>
          </Stack>

          <Box
            sx={{
              bgcolor: "#F4F5F7",
              px: 2,
              py: 1,
              borderRadius: "10px",
              textAlign: "left",
              minWidth: "110px",
            }}
          >
            <Typography level="body-sm" sx={{ color: "neutral.500" }}>
              Cost
            </Typography>
            <Typography
              level="title-md"
              fontWeight={700}
              sx={{ color: "neutral.900" }}
            >
              {total_cost ? formatPeso(total_cost) : "₱0.00"}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1.5, borderColor: "#F1F5F9" }} />

        {/* BOTTOM ROW: Action Buttons / Links */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Link
            component="button"
            onClick={handlePrint}
            sx={{
              fontSize: 12.5,
              color: "primary.600",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              textDecoration: "none",
              "&:hover": { color: "primary.600" },
            }}
            endDecorator={<CloudDownloadOutlined size={14} />}
          >
            Print as (.XLS)
          </Link>

          <Stack direction="row" spacing={1} alignItems="center">
            <ButtonComponent
              size="sm"
              variant="soft"
              color="primary"
              label="Approval Timeline"
              endDecorator={<ArrowRight size={14} />}
              onClick={rightClick}
              sx={{ borderRadius: "20px", px: 1.5, fontSize: 12, py: 0.4 }}
            />
            <ButtonComponent
              size="sm"
              variant="soft"
              color="primary"
              label="Open request"
              endDecorator={<ArrowRight size={14} />}
              onClick={leftClick}
              sx={{ borderRadius: "20px", px: 1.5, fontSize: 12, py: 0.4 }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default AOPCardComponent;
