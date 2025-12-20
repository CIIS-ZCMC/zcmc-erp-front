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

export const approvalTurnaroundDataset = [
  { level: "Planning Office", avgDays: 12 },
  { level: "Division Chief", avgDays: 7 },
  { level: "Medical Center Chief", avgDays: 14 },
];

export const daysFormatter = (value) => `${value} days`;

const BAR_COLORS = ["#003F5C", "#2F4B7C", "#00A0E3"];

export default function VerticalBars({ orientation = "vertical" }) {
  return (
    <BarChart
      dataset={approvalTurnaroundDataset}
      borderRadius={20}
      xAxis={[{ scaleType: "band", dataKey: "level" }]}
      series={[
        {
          dataKey: "avgDays",
          color: "#003F5C",
          valueFormatter: daysFormatter,
        },
      ]}
      height={400}
      {...chartSetting}
    />
  );
}
