import no_result from "../../../assets/not-found.png";
import { Stack, Typography } from "@mui/joy";
import PropTypes from "prop-types";

NoResultComponent.propTypes = {
  isSearch: PropTypes.bool,
  size: PropTypes.string,
};

function NoResultComponent({ isSearch = false, size }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      flex={1} // Take all available vertical space
      width="100%" // Take all available horizontal space
      my={size === "xs" ? 0 : 2}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        my={size === "xs" ? 0 : 2}
      >
        <img
          src={no_result}
          alt="Not found"
          style={{ width: size === "xs" ? 140 : 200 }}
        />
        <Typography fontSize={size === "xs" ? 15 : 17} fontWeight={600}>
          {!isSearch ? "Nothing to show" : "No result found"}
        </Typography>
        <Typography
          color="gray"
          fontSize={13}
          fontWeight={300}
          textAlign="center"
        >
          {!isSearch
            ? "No data available to display"
            : "We can't find any item matching your search"}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default NoResultComponent;
