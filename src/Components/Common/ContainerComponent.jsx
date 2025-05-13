import { Box, Divider, Sheet, Stack, styled, Typography } from "@mui/joy";
import PropTypes from "prop-types";

ContainerComponent.propTypes = {
  children: PropTypes.node, // Allow multiple children
  title: PropTypes.string,
  description: PropTypes.string,
  scrollable: PropTypes.bool,
  contentMaxHeight: PropTypes.string,
  actions: PropTypes.node,
  noPadding: PropTypes.bool,
  comingSoon: PropTypes.bool,
  chipLabel: PropTypes.string,
  chipColor: PropTypes.string,
  noBoxShadow: PropTypes.bool,
};

function ContainerComponent({
  children,
  title,
  description,
  scrollable,
  contentMaxHeight,
  contentMinHeight,
  actions,
  noPadding,
  footer,
  noBoxShadow,
  ...props
}) {
  const CustomSheet = styled(Sheet)(({ theme }) => ({
    backgroundColor: "white",
    borderRadius: 12,
    padding: theme.spacing(2.5),
    border: noBoxShadow ? `1px solid ${theme.palette.neutral[200]}` : "none",
    boxShadow: noBoxShadow ? "none" : theme.shadow.md,
    position: "static",
  }));

  return (
    <CustomSheet {...props}>
      {title && (
        <Stack gap={1.5} mb={2}>
          <Stack
            direction={{ xl: "row", lg: "column" }}
            sx={{
              alignItems: { xl: "center", lg: "start" },
              justifyContent: "space-between",
            }}
            spacing={1}
          >
            <Stack>
              <Typography
                fontWeight={600}
                fontSize={{ sm: "sm", md: "md", lg: "lg" }}
              >
                {title}
              </Typography>
              <Typography level="body-xs" fontWeight={400}>
                {description}
              </Typography>
            </Stack>

            {actions}
          </Stack>
          <Divider sx={{ marginX: noPadding && -2.5 }} />
        </Stack>
      )}

      <Box
        sx={{
          maxHeight: scrollable ? contentMaxHeight : "none", // Adjust based on scrollable prop
          overflowY: scrollable && "auto", // Show overflow only if scrollable
          minHeight: contentMinHeight || "auto",
        }}
      >
        {children}
      </Box>
      {footer && (
        <Box mt={2}>
          <Divider sx={{ marginX: noPadding && -2.5 }} />
          <Box mt={1.5}>{footer}</Box>
        </Box>
      )}
    </CustomSheet>
  );
}

export default ContainerComponent;
