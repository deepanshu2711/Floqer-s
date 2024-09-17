import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DataType } from "./Dashboard";

export const ChartView = ({ yearStats }: { yearStats: DataType[] }) => {
  const customTicks = [100000, 120000, 140000, 160000, 180000];
  return (
    <div className="flex flex-col gap-10 mb-10">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={yearStats}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis domain={[90000, "auto"]} ticks={customTicks} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avgSalary" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={yearStats}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="totalJobs"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
