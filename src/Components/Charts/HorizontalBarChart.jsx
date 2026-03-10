import { BarChart } from "@mui/x-charts/BarChart";
import { wrapLabel } from "../../Utils/WrapLabel";
import { ChartSkeleton } from "@Components/Common/Loading/SkeletonLoader";

const chartSetting = {
  xAxis: [
    {
      disableLine: true,
      disableTicks: true,
      scaleType: "linear",
    },
  ],
  height: 350,
  margin: { left: 0 },
};

export const pesoFormatter = (value) => `₱${value.toLocaleString()}`;

export default function HorizontalBars({
  orientation = "horizontal",
  dataKeyY = "unit",
  dataKeyX = "totalCost",
  dataset = [],
  isLoading,
}) {
  return (
    <>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <BarChart
          dataset={dataset}
          borderRadius={20}
          yAxis={[
            {
              scaleType: "band",
              dataKey: dataKeyY,
              width: 150,
              disableTicks: true,
              valueFormatter: (value) => wrapLabel(value),
            },
          ]}
          series={[
            {
              dataKey: dataKeyX,
              color: "#006599",
              valueFormatter: pesoFormatter,
            },
          ]}
          layout={orientation}
          {...chartSetting}
        />
      )}
    </>
  );
}
