import PropTypes from "prop-types";
import { Box, Breadcrumbs, Link, Stack, Typography, useTheme } from "@mui/joy";
import { ArrowLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { red } from "@mui/material/colors";
import { Fragment } from "react";
import path from "path";

PageTitle.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  description: PropTypes.string,
  subPage: PropTypes.string,
  subPath: PropTypes.string,
};

function PageTitle({ title, description, items = [] }) {
  const theme = useTheme();
  const color = theme.palette.custom;

  const navigate = useNavigate();

  return (
    <Fragment>
      <Stack alignItems={"start"}>
        <Breadcrumbs
          separator={<ChevronRightIcon size={16} />}
          sx={{
            alignItems: "center",
            "--Breadcrumbs-gap": "6px",
          }}
        >
          <Box>
            <Typography fontSize={30} fontWeight={600}>
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
                component="button"
                onClick={item.path}
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
            )
          )}
        </Breadcrumbs>
        <Typography level="body-sm" ml={1.5} mt={-2}>
          {description}
        </Typography>
      </Stack>
    </Fragment>
  );
}

export default PageTitle;
