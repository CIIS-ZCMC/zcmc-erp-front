import { Box, IconButton } from "@mui/joy";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const PaginationComponent = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  totalRows,
}) => {
  return (
    <Box
      mt={4}
      display="flex"
      alignItems="center"
      gap={1}
      justifyContent={"end"}
    >
      <Box mr={2}>
        Page <b>{currentPage}</b> - <b>{totalPages}</b> of <b>{totalRows}</b>{" "}
        items
      </Box>
      <IconButton
        sx={{ borderRadius: 50 }}
        variant="outlined"
        onClick={onPrevPage}
        isDisabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <BiChevronLeft />
      </IconButton>
      <IconButton
        sx={{ borderRadius: 50 }}
        variant="outlined"
        onClick={onNextPage}
        isDisabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <BiChevronRight />
      </IconButton>
    </Box>
  );
};

export default PaginationComponent;
