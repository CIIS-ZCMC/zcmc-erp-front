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
import React, { useState, useEffect } from "react";

const SearchBarComponentv2 = ({
  value,
  setValue,
  onClear,
  placeholder = "Search...",
  debounceTime = 350,
  onSearch,
  loading = false,
  fullWidth = false,
  size = "md",
  variant = "outlined",
  sx = {},
  startDecorator,
  endDecorator,
  label,
  withDesc = true,
}) => {
  const [internalValue, setInternalValue] = useState(value || "");

  // Keep internal value in sync if external value changes (e.g. reset from parent)
  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  // Debounce the call to setValue and onSearch
  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        setValue?.(internalValue);
        onSearch?.(internalValue);
      }
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [internalValue, debounceTime]);

  const handleClear = () => {
    setInternalValue("");
    setValue?.("");
    onClear?.();
  };

  return (
    <FormControl sx={sx}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        size={size}
        variant={variant}
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        startDecorator={startDecorator || <Search />}
        endDecorator={
          <>
            {loading && <CircularProgress size="sm" />}
            {internalValue && !loading && (
              <IconButton onClick={handleClear} size="sm">
                <X />
              </IconButton>
            )}
            {endDecorator}
          </>
        }
        fullWidth={fullWidth}
      />
      {withDesc && internalValue && (
        <Typography level="body-xs" sx={{ mt: 1 }}>
          Searching for: {internalValue}
        </Typography>
      )}
    </FormControl>
  );
};

export default SearchBarComponentv2;
