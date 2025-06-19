import React, { useState, useEffect } from "react";
import { DatePicker, Table, Row, Col, Select } from "antd";
import "../Style/BonusHistory.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useSWR from "swr";
import {
  fetchData,
  formatDateToUTC,
  getSportName,
} from "../api/ClientFunction";

const { RangePicker } = DatePicker;

const SportbookHistory = () => {
  const [dataSource, setDataSource] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("");
  const [search, setSearch] = useState("");
  const [sports, setSports] = useState("");
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const sportsOptions = [
    { label: "All", value: "" },
    { label: "Cricket", value: "sr:sport:21" },
    { label: "Football", value: "sr:sport:1" },
    { label: "Tennis", value: "sr:sport:5" },
    { label: "NBA", value: "sr:sport:2" },
    { label: "Badminton", value: "sr:sport:31" },
    { label: "Table Tennis", value: "sr:sport:20" },
    { label: "NFL", value: "sr:sport:16" },
    { label: "MMA", value: "sr:sport:117" },
    { label: "Kabaddi", value: "sr:sport:138" },
    { label: "Snooker", value: "sr:sport:19" },
    { label: "Rugby", value: "sr:sport:12" },
    { label: "Baseball", value: "sr:sport:3" },
    { label: "Volleyball", value: "sr:sport:23" },
    { label: "NHL", value: "sr:sport:4" },
    { label: "Darts", value: "sr:sport:22" },
    { label: "Futsal", value: "sr:sport:29" },
  ];

  const apiUrl = `/user/user-book-bets?timezone=Asia/Kolkata&sportId=${sports}&page=${pagination.current}&limit=${pagination.pageSize}&startDate=${startDate}&endDate=${endDate}&search=${search}`;
  const { data, error, isLoading } = useSWR(apiUrl, fetchData);
  console.log("this is bonus data", data);

  useEffect(() => {
    if (data && data?.bets) {
      setDataSource(data?.bets || []);
      setPagination((prev) => ({
        ...prev,
        total: data?.count || 0,
      }));
    }
  }, [data]);

  dayjs.extend(customParseFormat);

  const dateFormat = "YYYY/MM/DD";
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  // Handle table pagination changes
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleSportsChange = (sportId) => {
    setSports(sportId);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setSearch(value);
  };

  const columns = [
    {
      title: "DATE & TIME",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => formatDateToUTC(text),
      minWidth: 200,
    },
    { title: "MATCH", dataIndex: "eventName", key: "match", minWidth: 300 },
    {
      title: "MARKET/RUNNERID",
      dataIndex: "runnerName",
      key: "marketRunner",
      render: (_, record) => (
        <>
          <span>{record.runnerName}</span> /<span>{record.runnerId}</span>
        </>
      ),
      minWidth: 220,
    },
    { title: "ODDS", dataIndex: "betOdd", key: "odds", minWidth: 150 },
    { title: "STAKE", dataIndex: "stake", key: "stake", minWidth: 150 },
    {
      title: "SPORTS",
      dataIndex: "sportId",
      key: "sportId",
      minWidth: 180,
      render: (text) => getSportName(text),
    },
    {
      title: "BET STATUS",
      dataIndex: "status",
      key: "betStatus",
      render: (status) => {
        const statusColors = {
          Pending: "#1c7ed6",
          Winner: "green",
          Loser: "red",
          Refund: "#ff6600",
        };

        return (
          <p
            style={{
              color: statusColors[status] || "black",
            }}
          >
            {status}
          </p>
        );
      },
      minWidth: 140,
    },

    {
      title: "WIN AMOUNT",
      dataIndex: "winAmount",
      key: "returns",
      minWidth: 150,
      render: (item) => item.toFixed(2),
    },
  ];

  return (
    <div className="history-container">
      <h2>Sportbook History</h2>
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

          <div className="select-sports">
            <Select
              value={sports}
              className="select-part"
              onChange={handleSportsChange}
              options={sportsOptions}
            />
          </div>

          <div className="select-sports">
            <Select
              value={status}
              className="select-part"
              onChange={handleStatusChange}
              options={[
                { value: "", label: "All" },
                { value: "Pending", label: "Pending" },
                { value: "Winner", label: "Winner" },
                { value: "Loser", label: "Loser" },
                { value: "Refund", label: "Refund" },
              ]}
            />
          </div>
        </Row>

        <Table
          style={{ marginTop: "20px", borderRadius: 0 }}
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

export default SportbookHistory;
