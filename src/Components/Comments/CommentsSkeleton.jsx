import { Circle } from "@mui/icons-material";
import { Box, Skeleton, Stack, Typography } from "@mui/joy";
import { grey } from "@mui/material/colors";
import React from "react";

export default function CommentsSkeleton() {
  return (
    <div>
      <Box
        sx={{
          m: "auto",
          gap: 2,
          border: `1px solid ${grey[200]}`,
          borderRadius: 8,
          padding: 2,
        }}
      >
        <Skeleton
          variant="text"
          animation="wave"
          width={200}
          height="1em"
          sx={{ mb: 1 }}
        />

        <Skeleton variant="text" width={400} height="1em" sx={{ mb: 1 }} />

        <Stack direction={"row"} mt={1} alignItems={"center"} spacing={2}>
          <Skeleton variant="text" width={140} height="1em" />

          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="text" width={140} height="1em" />
        </Stack>
      </Box>
    </div>
  );
}
