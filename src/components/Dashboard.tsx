import { useEffect, useState } from "react";
import { Header } from "./Header";
import Papa from "papaparse";
import { TableColumnType } from "antd";
import { Table } from "antd";

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

export const Dashboard = () => {
  const [yearStats, setYearStats] = useState<DataType[]>([]);
  const [data, setData] = useState<TableData[]>([]);

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

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto mt-10">
        <Table dataSource={yearStats} columns={columns} />;
      </div>
    </div>
  );
};
