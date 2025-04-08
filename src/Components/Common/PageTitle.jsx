import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/joy";

PageTitle.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  description: PropTypes.string,
  subPage: PropTypes.string,
  subPath: PropTypes.string,
};

function PageTitle({ title, description, subPage, subPath }) {
  return (
    <Stack direction={"row"} justifyContent={"space-between"}>
      <Stack gap={2.5}>
        <Box>
          <Typography fontSize={30} fontWeight={600}>
            {title}
          </Typography>
          <Typography level="body-sm">{description}</Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default PageTitle;
