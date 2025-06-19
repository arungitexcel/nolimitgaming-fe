import React, { useState, useEffect } from "react";
import { DatePicker, Table, Row, Col } from "antd";
import "../Style/BonusHistory.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useSWR from "swr";
import { fetchData } from "../api/ClientFunction";

const { RangePicker } = DatePicker;

const BetHistory = () => {
  const [dataSource, setDataSource] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  
  const apiUrl = `/user/get-bonus?page=${pagination.current}&limit=${pagination.pageSize}&startDate=${startDate}&endDate=${endDate}&search=${search}`;
  const { data, error, isLoading } = useSWR(apiUrl, fetchData);
  console.log("this is bonus data", data);

  useEffect(() => {
    if (data) {
      console.log("API Response:", data);
      setDataSource(data?.data || []); // Set table data
      setPagination((prev) => ({
        ...prev,
        total: data?.count || 0, // Set total records
      }));
    }
  }, [data]);

  dayjs.extend(customParseFormat);

  const dateFormat = "YYYY/MM/DD";
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  // Function to log all states
  const logStates = () => {
    console.log("States:");
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Report Type:", reportType);
    console.log("Pagination:", pagination);
  };
  console.log("Search:", search);

  // Simulate fetching data
  const fetchTableData = () => {
    const totalRecords = 50; // Example total records
    const startIdx = (pagination.current - 1) * pagination.pageSize;
    const endIdx = startIdx + pagination.pageSize;

    const fetchedData = Array.from({ length: totalRecords })
      .slice(startIdx, endIdx)
      .map((_, index) => ({
        date: new Date().toLocaleDateString(),
        srNo: startIdx + index + 1,
        credit: (Math.random() * 1000).toFixed(2),
        debit: (Math.random() * 1000).toFixed(2),
        pts: (Math.random() * 10).toFixed(2),
        remarks: `Remark ${startIdx + index + 1}`,
      }));

    setDataSource(fetchedData);
    setPagination((prev) => ({
      ...prev,
      total: totalRecords,
    }));
  };

  // Handle table pagination changes
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  // Fetch table data when pagination changes

  const columns = [
    {
      title: "ID",
      dataIndex: "_idr",
      key: "_id",
    },
    {
      title: "User ID",
      dataIndex: "user",
      key: "user",
      minWidth: 100,
    },
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Username",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Manager ID",
      dataIndex: "manager",
      key: "manager",
      minWidth: 100,
    },
    {
      title: "Bonus Amount",
      dataIndex: "money",
      key: "money",
      minWidth: 100,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        statusFilter(status);
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      minWidth: 100,
      render: (text) => new Date(text).toLocaleString(), // Format date for better readability
    },
  ];

  return (
    <div className="history-container">
      <h2>Bet History</h2>
      <div className="account-statement-parent">
        <Row gutter={[16, 16]} className="row-account-part" style={{}}>
          <div className="date-picker">
            <DatePicker
              defaultValue={dayjs()}
              format={dateFormat}
              className="rangePicker"
              onChange={(value) => {
                if (value) {
                  setStartDate(value.format("YYYY-MM-DD"));
                }
              }}
            />
            <DatePicker
              defaultValue={dayjs()}
              format={dateFormat}
              className="rangePicker"
              style={{ marginLeft: "20px" }}
              onChange={(value) => {
                if (value) {
                  setEndDate(value.format("YYYY-MM-DD"));
                }
              }}
            />
          </div>
       

            <select>
              <option value="all">All</option>
              <option value="">Signup Bonus</option>
              <option value="">Refer Bonus</option>
              <option value="">Deposit Bonus</option>
            </select>
        
        </Row>

        <Table
          style={{ marginTop: "15px", borderRadius: 0 }}
          className="custom-table"
          dataSource={dataSource}
          columns={columns}
          rowKey="srNo"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "50"],
          }}
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
};

export default BetHistory;
