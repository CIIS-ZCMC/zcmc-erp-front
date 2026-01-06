import { Box, Card, CardContent, Skeleton, Stack } from "@mui/joy";

export const StatCardSkeleton = () => (
  <Card variant="soft" sx={{ height: 80 }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: "auto",
          mb: "auto",
        }}
      >
        <Skeleton variant="circular" width={48} height={48} />
        <div>
          <Skeleton
            variant="rectangular"
            width={200}
            height="1em"
            sx={{ mb: 1 }}
          />
          <Skeleton variant="rectangular" width={100} height="1em" />
        </div>
      </Box>
    </CardContent>
  </Card>
);

export const ChartSkeleton = () => (
  <Card variant="soft" sx={{ p: 2 }}>
    <Skeleton width="40%" />
    <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
  </Card>
);

export const ListSkeleton = ({ rows = 5 }) => (
  <Stack spacing={1.5}>
    {[...Array(rows)].map((_, i) => (
      <Box
        key={i}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 1.5,
          borderRadius: 10,
          bgcolor: "background.level1",
          position: "relative",
        }}
      >
        {/* Left status bar */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            borderRadius: `${10} 0 0 ${10}`,
            bgcolor: "neutral.300",
          }}
        />

        {/* Status icon */}
        <Skeleton variant="circular" width={36} height={36} />

        {/* Text content */}
        <Box flex={1}>
          <Skeleton width="70%" height="1em" />
          <Skeleton width="40%" height="0.9em" sx={{ mt: 0.5 }} />
        </Box>
      </Box>
    ))}
  </Stack>
);
