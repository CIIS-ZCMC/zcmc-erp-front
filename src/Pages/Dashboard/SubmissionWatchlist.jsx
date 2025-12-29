import { Box, Stack, Typography } from "@mui/joy";
import SubmissionItem from "./SubmissionItem";
import { SUBMISSION_STATUS } from "../../Data/TestData";
import BoxComponent from "@Components/Common/Card/BoxComponent";
import { ListSkeleton } from "@Components/Common/Loading/SkeletonLoader";

const SubmissionWatchlist = ({ data, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <ListSkeleton />
      ) : (
        <Box>
          <Stack
            spacing={1}
            sx={{
              maxHeight: 350,
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {data?.map((item, index) => (
              <SubmissionItem key={index} {...item} />
            ))}
          </Stack>
        </Box>
      )}
    </>
  );
};

export default SubmissionWatchlist;
