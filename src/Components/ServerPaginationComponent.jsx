import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/joy";

export default function ServerPaginationComponent({
  fetchData,
  search = "",
  perPage = 15,
}) {
  const [page, setPage] = useState(1);
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
      mt={3}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography level="body-sm">
        Page {pagination.current_page} of {pagination.last_page}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          size="sm"
          variant="outlined"
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
        >
          Previous
        </Button>

        {Array.from({ length: lastPage }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <Button
              key={pageNumber}
              size="sm"
              variant={page === pageNumber ? "solid" : "outlined"}
              onClick={() => goToPage(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          size="sm"
          variant="outlined"
          disabled={page === lastPage}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
