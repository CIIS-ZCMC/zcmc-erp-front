import { Button, Stack, Typography } from "@mui/joy";

export default function ServerPaginationComponent({
  page,
  setPage,
  perPage = 15,
  pagination,
}) {
  const lastPage = pagination?.last_page || 1;
  const total = pagination?.total || 0;

  const goToPage = (value) => {
    if (value < 1 || value > lastPage || value === page) return;
    setPage(value);
  };

  if (total === 0) return null;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        width: "100%",
        mt: "auto",
        px: 1,
        py: 1,
        borderTop: "1px solid #e5e7eb",
        backgroundColor: "#fff",
      }}
    >
      <Button
        size="sm"
        variant="outlined"
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
      >
        Previous
      </Button>

      <Stack direction="row" spacing={3} alignItems="center">
        <Typography level="body-sm" color="primary">
          rows per page: {perPage}
        </Typography>

        <Typography level="body-sm" color="primary">
          Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)}{" "}
          out of {total} items
        </Typography>
      </Stack>

      <Button
        size="sm"
        variant="outlined"
        disabled={page === lastPage}
        onClick={() => goToPage(page + 1)}
      >
        Next
      </Button>
    </Stack>
  );
}
