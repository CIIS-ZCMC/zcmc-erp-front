import { Box, Stack, Typography } from "@mui/joy";
import SubmissionItem from "./SubmissionItem";
import { SUBMISSION_STATUS } from "../../Data/TestData";
import BoxComponent from "@Components/Common/Card/BoxComponent";

const data = [
  { department: "Blood Bank", status: SUBMISSION_STATUS.NOT_STARTED },
  { department: "Pediatrics", status: SUBMISSION_STATUS.NOT_STARTED },
  { department: "Cancer Center", status: SUBMISSION_STATUS.NOT_STARTED },
  {
    department: "Innovations and Information System Unit",
    status: SUBMISSION_STATUS.AOP_IN_PROGRESS,
  },
  {
    department: "Human Resource Management Office",
    status: SUBMISSION_STATUS.PPMP_IN_PROGRESS,
  },
  {
    department: "Finance Office",
    status: SUBMISSION_STATUS.PPMP_IN_PROGRESS,
  },
];

const SubmissionWatchlist = () => {
  return (
    <Box>
      <Stack
        spacing={1}
        sx={{
          maxHeight: 350,
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        {data.map((item, index) => (
          <SubmissionItem key={index} {...item} />
        ))}
      </Stack>
    </Box>
  );
};

export default SubmissionWatchlist;
