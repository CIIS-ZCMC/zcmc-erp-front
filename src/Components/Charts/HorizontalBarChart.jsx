import { BarChart } from "@mui/x-charts/BarChart";

const chartSetting = {
  xAxis: [
    {
      disableLine: true,
      disableTicks: true,
      //   label: "rainfall (mm)",
    },
  ],
  height: 350,
  margin: { left: 0 },
};

export const totalCostByUnitDataset = [
  { unit: "OMCC", totalCost: 1200000 },
  { unit: "MS", totalCost: 420000 },
  { unit: "HOPSS", totalCost: 800000 },
  { unit: "NS", totalCost: 1200000 },
  { unit: "Finance", totalCost: 2000000 },
  { unit: "APHS", totalCost: 600000 },
];

export const pesoFormatter = (value) => `₱${value.toLocaleString()}`;

export default function HorizontalBars({ orientation = "horizontal" }) {
  return (
    <BarChart
      dataset={totalCostByUnitDataset}
      borderRadius={20}
      yAxis={[{ scaleType: "band", dataKey: "unit" }]}
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
  );
}
