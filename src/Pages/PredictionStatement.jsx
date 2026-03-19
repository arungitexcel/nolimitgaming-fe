/** @format */

import React, { useMemo, useState } from "react";
import { DatePicker, Input, Select, Table } from "antd";
import dayjs from "dayjs";
import useSWR from "swr";
import { fetchData, formatDateToUTC } from "../api/ClientFunction";
import "./PredictionStatement.css";

const { RangePicker } = DatePicker;

const PredictionStatement = () => {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(pagination.current));
    params.set("limit", String(pagination.pageSize));
    if (status) params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    if (dateRange?.[0]) params.set("startDate", dayjs(dateRange[0]).format("YYYY-MM-DD"));
    if (dateRange?.[1]) params.set("endDate", dayjs(dateRange[1]).format("YYYY-MM-DD"));
    return `/user/prediction/statement?${params.toString()}`;
  }, [pagination.current, pagination.pageSize, status, search, dateRange]);

  const { data, isLoading } = useSWR(query, fetchData);

  const rows = data?.data ?? [];
  const total = data?.totalCount ?? 0;
  const totals = data?.totals ?? {};

  const columns = [
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDateToUTC(text),
      minWidth: 190,
    },
    {
      title: "Market",
      dataIndex: "titleSnapshot",
      key: "titleSnapshot",
      render: (text) => text || "—",
      minWidth: 280,
    },
    {
      title: "Pick",
      dataIndex: "outcome",
      key: "outcome",
      minWidth: 90,
    },
    {
      title: "Stake",
      dataIndex: "amount",
      key: "amount",
      minWidth: 100,
      render: (value) => `${Number(value || 0).toFixed(2)} chips`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      minWidth: 100,
    },
    {
      title: "Resolved",
      dataIndex: "resolvedOutcome",
      key: "resolvedOutcome",
      minWidth: 110,
      render: (value) => value || "—",
    },
    {
      title: "Payout",
      dataIndex: "payout",
      key: "payout",
      minWidth: 120,
      render: (value) => `${Number(value || 0).toFixed(2)} chips`,
    },
    {
      title: "Net P/L",
      key: "net",
      minWidth: 120,
      render: (_, record) => {
        const pnl = Number(record.payout || 0) - Number(record.amount || 0);
        const color = pnl > 0 ? "#16a34a" : pnl < 0 ? "#dc2626" : "#9ca3af";
        return <span style={{ color }}>{pnl.toFixed(2)} chips</span>;
      },
    },
  ];

  return (
    <div className="prediction-statement-page">
      <h2>Prediction Statement</h2>

      <div className="prediction-statement-filters">
        <RangePicker
          value={dateRange}
          onChange={(values) => {
            setDateRange(values || []);
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
        />
        <Select
          value={status}
          className="prediction-statement-filter-status"
          onChange={(value) => {
            setStatus(value);
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
          options={[
            { value: "", label: "All Status" },
            { value: "PENDING", label: "Pending" },
            { value: "WON", label: "Won" },
            { value: "LOST", label: "Lost" },
          ]}
        />
        <Input.Search
          allowClear
          placeholder="Search market title"
          className="prediction-statement-filter-search"
          onSearch={(value) => {
            setSearch(value || "");
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
        />
      </div>

      <div className="prediction-statement-summary">
        <div>Total Bets: {totals.totalBets || 0}</div>
        <div>Total Stake: {Number(totals.totalStake || 0).toFixed(2)} chips</div>
        <div>Total Payout: {Number(totals.totalPayout || 0).toFixed(2)} chips</div>
        <div
          style={{
            color:
              Number(totals.netPnL || 0) > 0 ? "#16a34a" : Number(totals.netPnL || 0) < 0 ? "#dc2626" : "#9ca3af",
          }}
        >
          Net P/L: {Number(totals.netPnL || 0).toFixed(2)} chips
        </div>
      </div>

      <Table
        rowKey="_id"
        loading={isLoading}
        dataSource={rows}
        columns={columns}
        scroll={{ x: true }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={(nextPagination) =>
          setPagination({
            current: nextPagination.current,
            pageSize: nextPagination.pageSize,
          })
        }
      />
    </div>
  );
};

export default PredictionStatement;
