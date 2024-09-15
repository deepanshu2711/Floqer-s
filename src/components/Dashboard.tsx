import { useEffect, useState } from "react";
import { Header } from "./Header";
import Papa from "papaparse";
import { TableColumnType } from "antd";
import { Table } from "antd";
import { Modal } from "antd";
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
import { LineChartOutlined, TableOutlined } from "@ant-design/icons";

interface DataType {
  year: string;
  totalJobs: number;
  avgSalary: string;
}

type TableData = {
  company_location: string;
  company_size: string;
  employee_residence: string;
  employment_type: string;
  experience_level: string;
  job_title: string;
  remote_ratio: string;
  salary: string;
  salary_currency: string;
  salary_in_usd: string;
  work_year: string;
};

type SubData = {
  jobname: string;
  count: number;
};

export const Dashboard = () => {
  const [yearStats, setYearStats] = useState<DataType[]>([]);
  const [data, setData] = useState<TableData[]>([]);
  const [subTableData, setSubTableData] = useState<SubData[]>([]);
  const [modal1Open, setModal1Open] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [viewOption, setViewOption] = useState<"Table" | "Chart">("Table");

  const columns: TableColumnType<DataType>[] = [
    {
      title: "Year",
      dataIndex: "year",
      sorter: (a, b) => parseInt(a.year) - parseInt(b.year),
    },
    {
      title: "Total Jobs",
      dataIndex: "totalJobs",
      sorter: (a, b) => a.totalJobs - b.totalJobs,
    },
    {
      title: "Average Salary ($)",
      dataIndex: "avgSalary",
      sorter: (a, b) => parseFloat(a.avgSalary) - parseFloat(b.avgSalary),
    },
  ];

  const subColumns: TableColumnType<SubData>[] = [
    {
      title: "Job Name",
      dataIndex: "jobname",
    },
    {
      title: "Count",
      dataIndex: "count",
    },
  ];

  useEffect(() => {
    const totalJobs: Record<string, number> = {};
    const salaryTotals: Record<string, number> = {};

    data.forEach((entry) => {
      const year = entry.work_year;
      const salaryInUSD = parseFloat(entry.salary_in_usd);

      totalJobs[year] = (totalJobs[year] || 0) + 1;
      salaryTotals[year] = (salaryTotals[year] || 0) + salaryInUSD;
    });

    const stats: DataType[] = Object.keys(totalJobs).map((year) => {
      const avgSalary = (salaryTotals[year] / (totalJobs[year] || 1)).toFixed(
        2,
      );
      return {
        year,
        totalJobs: totalJobs[year],
        avgSalary: avgSalary,
      };
    });

    const filteredStats = stats.filter((stat) => stat.year !== "");

    setYearStats(filteredStats);
  }, [data]);

  console.log(yearStats);

  useEffect(() => {
    const csvUrl = "/salaries.csv";

    const getdata = async () => {
      Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: (results) => {
          setData(results.data as TableData[]);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    };

    getdata();
  }, []);

  const handleRowClick = (record: DataType) => {
    setSelectedRecord(record);
    setModal1Open(true);
    const allJobs = data.filter((job) => job.work_year == record.year);
    const jobs: Record<string, number> = {};
    allJobs.forEach((job) => {
      jobs[job.job_title] = (jobs[job.job_title] || 0) + 1;
    });

    const jobList = Object.entries(jobs).map(([jobname, count]) => ({
      jobname,
      count,
    }));

    setSubTableData(jobList);
  };

  const customTicks = [100000, 120000, 140000, 160000, 180000];

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto mt-10 px-[10px]">
        <div className="flex items-center justify-between mb-10">
          <p className="text-3xl font-bold text-gray-700">
            {viewOption === "Table" ? "Table" : "Line Graph"}
          </p>
          <div className="flex items-center gap-2 border  justify-end max-w-fit rounded-lg bg-gray-100">
            <TableOutlined
              onClick={() => setViewOption("Table")}
              className="p-4 hover:bg-white cursor-pointer rounded-lg"
            />
            <LineChartOutlined
              onClick={() => setViewOption("Chart")}
              className="p-4 hover:bg-white cursor-pointer rounded-lg"
            />
          </div>
        </div>

        {viewOption === "Table" && (
          <div className="flex flex-col items-center gap-5">
            <Table
              dataSource={yearStats}
              columns={columns}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
              rowClassName={"cursor-pointer"}
              pagination={false}
              className="w-full"
            />

            <p className="text-gray-500">click on the row for more details</p>
          </div>
        )}

        {viewOption === "Chart" && (
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
        )}
      </div>
      <Modal
        title={`List of all the job titles in ${selectedRecord?.year}`}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        width={800}
      >
        <Table
          dataSource={subTableData}
          columns={subColumns}
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};
