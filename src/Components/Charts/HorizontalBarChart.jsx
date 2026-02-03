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

export const totalCostByUnitDataset = [
  { unit: "Office of Medical Center Chief", totalCost: 1200000 },
  { unit: "Nursing Service", totalCost: 420000 },
  { unit: "Human Resource Management", totalCost: 800000 },
  { unit: "Innovations and Information Systems Unit", totalCost: 1200000 },
  { unit: "Finance", totalCost: 2000000 },
  { unit: "Allied Health Professionals Section", totalCost: 600000 },
];

export const pesoFormatter = (value) => `₱${value.toLocaleString()}`;

export default function HorizontalBars({
  orientation = "horizontal",
  dataKey = "unit",
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
              dataKey,
              width: 150,
              disableTicks: true,
              valueFormatter: (value) => wrapLabel(value),
            },
          ]}
          series={[
            {
              dataKey: "totalCost",
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
