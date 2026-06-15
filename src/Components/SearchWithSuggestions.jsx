import {
  Autocomplete,
  AutocompleteOption,
  CircularProgress,
  ListItemContent,
  Stack,
  Typography,
} from "@mui/joy";
import debounce from "lodash.debounce";
import { SearchIcon } from "lucide-react";
import React, { Fragment, useCallback, useMemo, useState } from "react";

/**
 * Reusable search component with suggestions + full result modal.
 *
 * @param {string} suggestionUrl - API endpoint for suggestions (expects ?query= param)
 * @param {string} fullSearchUrl - API endpoint for full search
 * @param {function} renderSuggestion - Custom renderer for suggestion list items
 * @param {function} renderResult - Custom renderer for full search modal items
 * @param {string} placeholder - Input placeholder text
 * @param {function} onSelect - Optional callback when a suggestion or result is selected
 * @param {number} debounceMs - Debounce delay in milliseconds (default 400)
 * @param {object} sx - Optional MUI sx styling for outer container
 */

export default function SearchWithSuggestions({
  placeholder = "Search Item...",
  debounceDelay = 400,
  modalWidth = 600,
  getSearchSuggestions,
  onSelect,
  suggestions = [],
  onClear,
  onEnter,
  search,
  isPPMP,
  setSearch,
  getItems,
  setDisplayLoading,
  displayLoading = false,
}) {
  const [loading, setLoading] = useState(false);

  // Debounced suggestion fetch
  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce(async (text) => {
        if (!text.trim()) return;

        try {
          setLoading(true);

          await getSearchSuggestions(() => {
            setLoading(false);
          }, text);
        } catch (err) {
          setLoading(false);
        }
      }, debounceDelay),
    [getSearchSuggestions, debounceDelay],
  );

  // Input change
  const handleInputChange = useCallback(
    (e, value, reason) => {
      setSearch(value);

      if (reason === "clear" || !value.trim()) {
        debouncedFetchSuggestions.cancel?.();

        setLoading(false);

        onClear?.();

        return;
      }

      // Trigger fetch and show loaders
      debouncedFetchSuggestions(value);
    },
    [debouncedFetchSuggestions, setDisplayLoading, onClear, getItems],
  );

  // Suggestion select
  const handleSelect = (e, value) => {
    if (value) {
      setSearch(value);
      onSelect?.(value);
    }
  };

  // Press enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter?.(search);
    }
  };

  return (
    <Fragment>
      <Stack spacing={1}>
        <Autocomplete
          placeholder={placeholder}
          startDecorator={<SearchIcon />}
          options={suggestions}
          getOptionLabel={(option) => option.name || ""}
          onInputChange={handleInputChange}
          onChange={handleSelect}
          loading={loading}
          endDecorator={loading ? <CircularProgress size="sm" /> : null}
          onKeyDown={handleKeyDown}
          sx={{
            width: "100%",
            maxWidth: 360,
            borderRadius: "md",
            backgroundColor: "background.body",
          }}
          renderOption={(props, option, { index }) => (
            <>
              <AutocompleteOption {...props}>
                <ListItemContent sx={{ px: 2, py: 1 }}>
                  <Stack>
                    <Typography level="body-sm">{option.name}</Typography>
                  </Stack>
                </ListItemContent>
              </AutocompleteOption>
            </>
          )}
        />
      </Stack>

      {/* <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalDialog
          sx={{
            width: modalWidth,
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "md",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography level="h5">Search Results</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <Close />
            </IconButton>
          </Stack>
          <Divider sx={{ my: 1 }} />

          {loading ? (
            <Stack alignItems="center" py={3}>
              <CircularProgress />
            </Stack>
          ) : results?.length > 0 ? (
            <List>
              {results.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => onSelect?.(item)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "neutral.softBg" },
                  }}
                >
                  <ListItemContent>
                    <Typography fontWeight={600}>{item.name}</Typography>
                    <Typography level="body2" color="neutral">
                      {item.category?.name || "No category"}
                    </Typography>
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography level="body2" color="neutral" textAlign="center" py={2}>
              No results found
            </Typography>
          )}
        </ModalDialog>
      </Modal> */}
    </Fragment>
  );
}
