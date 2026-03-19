import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { fetchManagerData } from "../../api/ManagerClient";

const { RangePicker } = DatePicker;

function formatDateParam(dateValue, boundary) {
  if (!dateValue) return "";
  const date =
    typeof dateValue?.toDate === "function"
      ? dateValue.toDate()
      : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  if (boundary === "start") {
    date.setHours(0, 0, 0, 0);
  } else {
    date.setHours(23, 59, 59, 999);
  }
  return date.toISOString();
}

function toMoney(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
}

export default function PredictionReportsPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    userId: "",
    polymarketMarketId: "",
    range: null,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "",
    userId: "",
    polymarketMarketId: "",
    range: null,
  });
  const [betsPage, setBetsPage] = useState(1);
  const [betsLimit, setBetsLimit] = useState(25);
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit, setUsersLimit] = useState(25);

  const queryParts = useMemo(() => {
    const params = new URLSearchParams();
    if (appliedFilters.status) params.set("status", appliedFilters.status);
    if (appliedFilters.search?.trim()) params.set("search", appliedFilters.search.trim());
    if (appliedFilters.userId?.trim()) params.set("userId", appliedFilters.userId.trim());
    if (appliedFilters.polymarketMarketId?.trim()) {
      params.set("polymarketMarketId", appliedFilters.polymarketMarketId.trim());
    }
    if (appliedFilters.range?.[0]) {
      params.set("startDate", formatDateParam(appliedFilters.range[0], "start"));
    }
    if (appliedFilters.range?.[1]) {
      params.set("endDate", formatDateParam(appliedFilters.range[1], "end"));
    }
    return params;
  }, [appliedFilters]);

  const betsKey = useMemo(() => {
    const params = new URLSearchParams(queryParts.toString());
    params.set("page", String(betsPage));
    params.set("limit", String(betsLimit));
    return `/manager/prediction/bets?${params.toString()}`;
  }, [queryParts, betsPage, betsLimit]);

  const usersKey = useMemo(() => {
    const params = new URLSearchParams(queryParts.toString());
    params.delete("polymarketMarketId");
    params.delete("userId");
    params.set("page", String(usersPage));
    params.set("limit", String(usersLimit));
    return `/manager/prediction/users?${params.toString()}`;
  }, [queryParts, usersPage, usersLimit]);

  const summaryKey = useMemo(() => {
    const params = new URLSearchParams();
    if (appliedFilters.userId?.trim()) params.set("userId", appliedFilters.userId.trim());
    if (appliedFilters.range?.[0]) {
      params.set("startDate", formatDateParam(appliedFilters.range[0], "start"));
    }
    if (appliedFilters.range?.[1]) {
      params.set("endDate", formatDateParam(appliedFilters.range[1], "end"));
    }
    return `/manager/prediction/summary?${params.toString()}`;
  }, [appliedFilters]);

  const { data: betsData, isLoading: betsLoading } = useSWR(betsKey, fetchManagerData, {
    revalidateOnFocus: false,
  });
  const { data: usersData, isLoading: usersLoading } = useSWR(usersKey, fetchManagerData, {
    revalidateOnFocus: false,
  });
  const { data: summaryData, isLoading: summaryLoading } = useSWR(summaryKey, fetchManagerData, {
    revalidateOnFocus: false,
  });

  const betsRows = Array.isArray(betsData?.data) ? betsData.data : [];
  const usersRows = Array.isArray(usersData?.data) ? usersData.data : [];

  const betsColumns = [
    {
      title: "User",
      key: "user",
      width: 220,
      render: (_, row) => row?.user?.username || "—",
    },
    {
      title: "Market",
      dataIndex: "polymarketMarketId",
      key: "polymarketMarketId",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Title",
      dataIndex: "titleSnapshot",
      key: "titleSnapshot",
      width: 280,
      ellipsis: true,
    },
    { title: "Outcome", dataIndex: "outcome", key: "outcome", width: 100 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value) => {
        const color = value === "WON" ? "green" : value === "LOST" ? "red" : "gold";
        return <Tag color={color}>{value || "—"}</Tag>;
      },
    },
    {
      title: "Stake",
      dataIndex: "amount",
      key: "amount",
      width: 110,
      render: (value) => toMoney(value),
    },
    {
      title: "Payout",
      dataIndex: "payout",
      key: "payout",
      width: 110,
      render: (value) => toMoney(value),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value) => (value ? new Date(value).toLocaleString() : "—"),
    },
  ];

  const usersColumns = [
    {
      title: "User",
      key: "user",
      width: 200,
      render: (_, row) => row?.user?.username || "—",
    },
    {
      title: "Name",
      key: "name",
      width: 180,
      render: (_, row) => {
        const first = row?.user?.firstname || "";
        const last = row?.user?.lastname || "";
        const name = `${first} ${last}`.trim();
        return name || "—";
      },
    },
    { title: "Bets", dataIndex: "betsCount", key: "betsCount", width: 90 },
    {
      title: "Staked",
      dataIndex: "totalStaked",
      key: "totalStaked",
      width: 110,
      render: (value) => toMoney(value),
    },
    {
      title: "Payout",
      dataIndex: "totalPayout",
      key: "totalPayout",
      width: 110,
      render: (value) => toMoney(value),
    },
    {
      title: "Pending",
      dataIndex: "pendingExposure",
      key: "pendingExposure",
      width: 110,
      render: (value) => toMoney(value),
    },
    { title: "Won", dataIndex: "wonCount", key: "wonCount", width: 80 },
    { title: "Lost", dataIndex: "lostCount", key: "lostCount", width: 80 },
    { title: "Pending", dataIndex: "pendingCount", key: "pendingCount", width: 90 },
    {
      title: "Latest Bet",
      dataIndex: "latestBetAt",
      key: "latestBetAt",
      width: 180,
      render: (value) => (value ? new Date(value).toLocaleString() : "—"),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div className="AdminSurface">
        <Space direction="vertical" size={14} style={{ width: "100%" }}>
          <div className="AdminSurfaceHeader">
            <div style={{ minWidth: 0 }}>
              <Typography.Title level={4} className="AdminSurfaceTitle">
                Prediction Reports
              </Typography.Title>
              <Typography.Text className="AdminSurfaceSubtitle">
                Complete admin view of prediction bets, summary metrics, and user-wise totals.
              </Typography.Text>
            </div>
          </div>

          <div className="AdminPredictionFilterGrid">
            <Input
              size="large"
              placeholder="Search user/title/market"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              allowClear
            />
            <Select
              size="large"
              allowClear
              placeholder="Status"
              value={filters.status || undefined}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value || "" }))}
              options={[
                { label: "PENDING", value: "PENDING" },
                { label: "WON", value: "WON" },
                { label: "LOST", value: "LOST" },
              ]}
            />
            <Input
              size="large"
              placeholder="User ID (optional)"
              value={filters.userId}
              onChange={(e) => setFilters((prev) => ({ ...prev, userId: e.target.value }))}
              allowClear
            />
            <Input
              size="large"
              placeholder="Market ID (optional)"
              value={filters.polymarketMarketId}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, polymarketMarketId: e.target.value }))
              }
              allowClear
            />
            <RangePicker
              size="large"
              value={filters.range}
              onChange={(value) => setFilters((prev) => ({ ...prev, range: value }))}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setBetsPage(1);
                  setUsersPage(1);
                  setAppliedFilters({ ...filters });
                }}
              >
                Apply
              </Button>
              <Button
                onClick={() => {
                  const reset = {
                    search: "",
                    status: "",
                    userId: "",
                    polymarketMarketId: "",
                    range: null,
                  };
                  setBetsPage(1);
                  setUsersPage(1);
                  setFilters(reset);
                  setAppliedFilters(reset);
                }}
              >
                Reset
              </Button>
            </Space>
          </div>
        </Space>
      </div>

      <div className="AdminPredictionStatsGrid">
        <Card bordered={false}>
          <Statistic title="Total Bets" value={summaryData?.totalBets || 0} loading={summaryLoading} />
        </Card>
        <Card bordered={false}>
          <Statistic
            title="Total Staked"
            value={Number(summaryData?.totalAmountStaked || 0)}
            precision={2}
            loading={summaryLoading}
          />
        </Card>
        <Card bordered={false}>
          <Statistic
            title="Total Payout"
            value={Number(summaryData?.totalPayout || 0)}
            precision={2}
            loading={summaryLoading}
          />
        </Card>
        <Card bordered={false}>
          <Statistic
            title="Pending Amount"
            value={Number(summaryData?.pendingAmount || 0)}
            precision={2}
            loading={summaryLoading}
          />
        </Card>
        <Card bordered={false}>
          <Statistic title="Won / Lost / Pending" value={`${summaryData?.wonCount || 0} / ${summaryData?.lostCount || 0} / ${summaryData?.pendingCount || 0}`} loading={summaryLoading} />
        </Card>
        <Card bordered={false}>
          <Statistic
            title="Net P/L"
            value={Number(summaryData?.netPL || 0)}
            precision={2}
            loading={summaryLoading}
          />
        </Card>
      </div>

      <div className="AdminSurface">
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            All Prediction Bets
          </Typography.Title>
          <Table
            className="AdminTable"
            rowKey={(row) => row?._id}
            loading={betsLoading}
            columns={betsColumns}
            dataSource={betsRows}
            scroll={{ x: 1400 }}
            pagination={{
              current: betsPage,
              pageSize: betsLimit,
              total: Number(betsData?.totalCount || 0),
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setBetsPage(page);
                setBetsLimit(pageSize);
              },
            }}
          />
        </Space>
      </div>

      <div className="AdminSurface">
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            User-wise Prediction Report
          </Typography.Title>
          <Table
            className="AdminTable"
            rowKey={(row) => row?.user?._id || JSON.stringify(row)}
            loading={usersLoading}
            columns={usersColumns}
            dataSource={usersRows}
            scroll={{ x: 1300 }}
            pagination={{
              current: usersPage,
              pageSize: usersLimit,
              total: Number(usersData?.totalCount || 0),
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setUsersPage(page);
                setUsersLimit(pageSize);
              },
            }}
          />
        </Space>
      </div>
    </Space>
  );
}
