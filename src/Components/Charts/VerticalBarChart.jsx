import { ChartSkeleton } from "@Components/Common/Loading/SkeletonLoader";
import { BarChart } from "@mui/x-charts/BarChart";

const chartSetting = {
  yAxis: [
    {
      disableLine: true,
      disableTicks: true,
      //   label: "rainfall (mm)",
    },
  ],

  height: 350,
  margin: { left: 0 },
};

export const daysFormatter = (value) => `${value} days`;

export default function VerticalBars({
  orientation = "vertical",
  isLoading,
  dataset = [],
  dataKey = "avgDays",
}) {
  return (
    <>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <BarChart
          dataset={dataset}
          borderRadius={20}
          series={[
            {
              dataKey: dataKey,
              color: "#003F5C",
              valueFormatter: daysFormatter,
            },
          ]}
          xAxis={[{ dataKey: "approver" }]}
          height={400}
          {...chartSetting}
        />
      )}
    </>
  );
}
