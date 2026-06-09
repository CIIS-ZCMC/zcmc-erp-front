import PropTypes from "prop-types";
import { Box, Breadcrumbs, Link, Stack, Typography, useTheme } from "@mui/joy";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import { Fragment } from "react";
import path from "path";
import IconButtonComponent from "./IconButtonComponent";
import { ArrowBack } from "@mui/icons-material";

PageTitle.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  description: PropTypes.string,
  subPage: PropTypes.string,
  subPath: PropTypes.string,
};

function PageTitle({
  title,
  description,
  items = [],
  withArrowBack = items.length > 0 ? true : false,
  onClickArrow,
  backTo,
}) {
  const theme = useTheme();
  const color = theme.palette.custom;
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClickArrow) {
      onClickArrow();
      return;
    }

    if (backTo) {
      navigate(backTo);
      return;
    }

    navigate(-1);
  };

  return (
    <Fragment>
      <Stack alignItems={"flex-start"} width={"90%"}>
        <Breadcrumbs
          separator={<ChevronRightIcon size={16} />}
          sx={{
            alignItems: "center",
            "--Breadcrumbs-gap": "6px",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {withArrowBack && (
              <IconButtonComponent icon={<ArrowBack />} onClick={handleBack} />
            )}
            <Typography fontSize={30} fontWeight={600} sx={{ color: "black" }}>
              {title}
            </Typography>
          </Box>

          {/* Breadcrumb links */}
          {items.map((item, index) =>
            item.current ? (
              <Typography
                key={index}
                level="body-sm"
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                {item.label}
              </Typography>
            ) : (
              <Link
                key={index}
                component={RouterLink}
                to={item.to}
                color="neutral"
                underline="hover"
                level="body-sm"
                sx={{
                  fontWeight: 500,
                  "&:hover": { color: theme.palette.primary[500] },
                }}
              >
                {item.label}
              </Link>
            ),
          )}
        </Breadcrumbs>
        <Typography level="body-sm" ml={1.5} mt={-2} width={"80%"}>
          {description}
        </Typography>
      </Stack>
    </Fragment>
  );
}

export default PageTitle;
