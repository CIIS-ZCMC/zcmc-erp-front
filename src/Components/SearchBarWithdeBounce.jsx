import {
  Input,
  IconButton,
  Box,
  FormControl,
  FormLabel,
  Typography,
  CircularProgress,
} from "@mui/joy";
import { Search, X } from "lucide-react";
import React from "react";
import useClassificationDataTable from "../Hooks/Libraries/dataTable/dataClassification";

const SearchBarWithdeBounce = ({
  value,
  setValue,
  placeholder = "Search...",
  debounceTime = 300,
  onSearch,
  loading = false,
  fullWidth = true,
  size = "md",
  variant = "outlined",
  sx = {},
  startDecorator,
  endDecorator,
  label,
}) => {
  const { search_Query, setSearchQuery } = useClassificationDataTable();

  const [searchValue, setSearchValue] = React.useState(value);
  const handleClear = () => {
    setValue("");
  };

  return (
    <FormControl sx={sx}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        size={size}
        variant={variant}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        startDecorator={startDecorator || <Search />}
        endDecorator={
          <>
            {loading && <CircularProgress size="sm" />}
            {value && !loading && (
              <IconButton onClick={handleClear} size="sm">
                <X />
              </IconButton>
            )}
            {endDecorator}
          </>
        }
        fullWidth={fullWidth}
      />
      {value && (
        <Typography level="body-xs" sx={{ mt: 1 }}>
          Searching for: {value}
        </Typography>
      )}
    </FormControl>
  );
};

export default SearchBarWithdeBounce;
