import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/joy";

export default function ServerPaginationComponent({
  fetchData,
  search = "",
  perPage = 15,
  page,
  setPage,
}) {
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const safeSearch = typeof search === "string" ? search : "";

  useEffect(() => {
    fetchData(
      {
        search: safeSearch,
        page,
        per_page: perPage,
      },
      (status, message, paginationData) => {
        if (status >= 200 && status < 300 && paginationData) {
          setPagination(paginationData);
        }
      },
    );
  }, [page, safeSearch, perPage]);

  useEffect(() => {
    setPage(1);
  }, [safeSearch]);

  const lastPage = pagination?.last_page || 1;

  const goToPage = (value) => {
    if (value < 1 || value > lastPage || value === page) return;
    setPage(value);
  };

  if (lastPage <= 1) return null;

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
      {/* Left */}
      <Button
        size="sm"
        variant="outlined"
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
      >
        Previous
      </Button>

      {/* Center */}
      <Stack direction="row" spacing={3} alignItems="center">
        <Typography level="body-sm" color="primary">
          rows per page: {perPage}
        </Typography>

        <Typography level="body-sm" color="primary">
          Showing {(page - 1) * perPage + 1}-
          {Math.min(page * perPage, pagination.total)} out of {pagination.total}{" "}
          items
        </Typography>
      </Stack>

      {/* Right */}
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
