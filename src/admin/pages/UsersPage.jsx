import { useMemo, useState } from "react";
import useSWR from "swr";
import { Button, Descriptions, Divider, Drawer, Input, Space, Table, Tag, Typography } from "antd";
import { fetchManagerData } from "../../api/ManagerClient";
import { useManagerAuth } from "../../context/ManagerAuthContext";

function isNonEmpty(value) {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

export default function UsersPage() {
  const { manager } = useManagerAuth();
  const managerId = manager?._id;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
      }),
    []
  );

  const swrKey = useMemo(() => {
    if (!managerId) return null;
    const params = new URLSearchParams({
      managerid: managerId,
      page: String(page),
      limit: String(limit),
      search: search || "",
    });
    // Backend requires search or date filters for some endpoints; keep search non-empty.
    if (!params.get("search")) params.set("search", " ");
    return `/manager/get-mine-users?${params.toString()}`;
  }, [managerId, page, limit, search]);

  const { data, isLoading } = useSWR(swrKey, fetchManagerData, {
    revalidateOnFocus: false,
  });

  const rows = Array.isArray(data?.data) ? data.data : data?.data?.data || [];
  const total = Number(data?.count ?? data?.data?.count ?? rows.length ?? 0);

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "_id",
        key: "_id",
        ellipsis: true,
        width: 240,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (_, r) => r?.name || `${r?.firstname || ""} ${r?.lastname || ""}`.trim(),
      },
      { title: "Username", dataIndex: "username", key: "username" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Phone", dataIndex: "phone", key: "phone" },
      {
        title: "Cash",
        dataIndex: "money",
        key: "money",
        render: (v) => (v != null ? Number(v).toFixed(2) : "—"),
      },
      {
        title: "Play Chips",
        dataIndex: "playChips",
        key: "playChips",
        render: (v) => (v != null ? Number(v).toFixed(2) : "—"),
      },
      {
        title: "Cash Exposure",
        dataIndex: "exposure",
        key: "exposure",
        render: (v) => (v != null ? Number(v).toFixed(2) : "—"),
      },
      {
        title: "Play Chips Exposure",
        dataIndex: "playChipsExposure",
        key: "playChipsExposure",
        render: (v) => (v != null ? Number(v).toFixed(2) : "—"),
      },
      { title: "Status", dataIndex: "status", key: "status" },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (v) => (v ? dateTimeFormatter.format(new Date(v)) : ""),
      },
      {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 120,
        render: (_, record) => (
          <Button
            size="small"
            onClick={() => {
              setActiveUser(record);
              setDrawerOpen(true);
            }}
          >
            Details
          </Button>
        ),
      },
    ],
    [dateTimeFormatter]
  );

  const fullName = (u) => u?.name || `${u?.firstname || ""} ${u?.lastname || ""}`.trim();

  const renderCopyableText = (text) => (
    <Typography.Text copyable={{ text: String(text) }}>{String(text)}</Typography.Text>
  );

  const details = useMemo(() => {
    const u = activeUser;
    if (!u) return null;

    // Intentionally hide: user.password, manager, manager.password
    const accountItems = [
      { key: "id", label: "User ID", children: u._id ? renderCopyableText(u._id) : "—" },
      { key: "username", label: "Username", children: u.username ? renderCopyableText(u.username) : "—" },
      { key: "name", label: "Name", children: isNonEmpty(fullName(u)) ? fullName(u) : "—" },
      { key: "status", label: "Status", children: u.status ? <Tag color={u.status === "Active" ? "green" : "default"}>{u.status}</Tag> : "—" },
      { key: "demo", label: "Demo", children: typeof u.demo === "boolean" ? (u.demo ? <Tag color="gold">Yes</Tag> : <Tag>No</Tag>) : "—" },
    ];

    const contactItems = [
      { key: "email", label: "Email", children: u.email ? renderCopyableText(u.email) : "—" },
      { key: "phone", label: "Phone", children: u.phone ? renderCopyableText(u.phone) : "—" },
      { key: "countryCode", label: "Country Code", children: u.countryCode ? u.countryCode : "—" },
    ];

    const addressItems = [
      { key: "homeaddress", label: "Home Address", children: isNonEmpty(u.homeaddress) ? u.homeaddress : "—" },
      { key: "secondaryaddress", label: "Secondary Address", children: isNonEmpty(u.secondaryaddress) ? u.secondaryaddress : "—" },
      { key: "city", label: "City", children: isNonEmpty(u.city) ? u.city : "—" },
      { key: "zipcode", label: "Zip Code", children: isNonEmpty(u.zipcode) ? u.zipcode : "—" },
      { key: "country", label: "Country", children: isNonEmpty(u.country) ? u.country : "—" },
    ];

    const balancesItems = [
      { key: "money", label: "Money", children: isNonEmpty(u.money) ? String(u.money) : "—" },
      { key: "playChips", label: "Play Chips", children: isNonEmpty(u.playChips) ? String(u.playChips) : "—" },
      { key: "exposure", label: "Exposure", children: isNonEmpty(u.exposure) ? String(u.exposure) : "—" },
      { key: "playChipsExposure", label: "Play Chips Exposure", children: isNonEmpty(u.playChipsExposure) ? String(u.playChipsExposure) : "—" },
    ];

    const registrationItems = [
      { key: "dob", label: "Date of Birth", children: u.dob ? dateFormatter.format(new Date(u.dob)) : "—" },
      { key: "createdAt", label: "Created", children: u.createdAt ? dateTimeFormatter.format(new Date(u.createdAt)) : "—" },
      { key: "updatedAt", label: "Updated", children: u.updatedAt ? dateTimeFormatter.format(new Date(u.updatedAt)) : "—" },
      { key: "domain", label: "Domain", children: isNonEmpty(u.domain) ? u.domain : "—" },
      { key: "registerlocationstring", label: "Registration Location", children: isNonEmpty(u.registerlocationstring) ? u.registerlocationstring : "—" },
      { key: "registrationIP", label: "Registration IP", children: isNonEmpty(u.registrationIP) ? renderCopyableText(u.registrationIP) : "—" },
      { key: "registrationCountry", label: "Registration Country", children: isNonEmpty(u.registrationCountry) ? u.registrationCountry : "—" },
    ];

    const loginItems = [
      { key: "lastLoginCountry", label: "Last Login Country", children: isNonEmpty(u.lastLoginCountry) ? u.lastLoginCountry : "—" },
      { key: "lastLoginIP", label: "Last Login IP", children: isNonEmpty(u.lastLoginIP) ? renderCopyableText(u.lastLoginIP) : "—" },
      { key: "lastloginlocationstring", label: "Last Login Location", children: isNonEmpty(u.lastloginlocationstring) ? u.lastloginlocationstring : "—" },
    ];

    const miscItems = [
      { key: "inviteCode", label: "Invite Code", children: isNonEmpty(u.inviteCode) ? u.inviteCode : "—" },
      { key: "selfCode", label: "Self Code", children: isNonEmpty(u.selfCode) ? renderCopyableText(u.selfCode) : "—" },
    ];

    return {
      title: isNonEmpty(fullName(u)) ? fullName(u) : u.username || "User Details",
      subtitle: u.email || u.phone || "",
      sections: [
        { title: "Account", items: accountItems },
        { title: "Contact", items: contactItems },
        { title: "Address", items: addressItems },
        { title: "Balances", items: balancesItems },
        { title: "Registration", items: registrationItems },
        { title: "Last Login", items: loginItems },
        { title: "Other", items: miscItems },
      ],
    };
  }, [activeUser, dateFormatter, dateTimeFormatter]);

  return (
    <div className="AdminSurface">
      <Space
        direction="vertical"
        size={12}
        style={{ width: "100%" }}
      >
        <div className="AdminSurfaceHeader">
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={4} className="AdminSurfaceTitle">
              Registered Users
            </Typography.Title>
            <Typography.Text className="AdminSurfaceSubtitle">
              All users under this manager account.
            </Typography.Text>
          </div>
          <Input
            name="search"
            aria-label="Search users"
            placeholder="Search (name, username, email, phone, ID…)"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="AdminSearch"
            allowClear
            size="large"
          />
        </div>

        <Table
          className="AdminTable"
          rowKey={(r) => r?._id || r?.id}
          columns={columns}
          dataSource={rows}
          loading={isLoading}
          scroll={{ x: 1700 }}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setLimit(ps);
            },
          }}
        />
      </Space>

      <Drawer
        title={details?.title || "User Details"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={680}
      >
        {details?.subtitle ? (
          <Typography.Text type="secondary" style={{ display: "block", marginTop: -8, marginBottom: 12 }}>
            {details.subtitle}
          </Typography.Text>
        ) : null}

        {details?.sections?.map((section, idx) => (
          <div key={section.title}>
            <Divider style={{ margin: idx === 0 ? "8px 0 12px" : "16px 0 12px" }}>
              {section.title}
            </Divider>
            <Descriptions
              size="small"
              column={2}
              bordered
              items={section.items}
            />
          </div>
        ))}
      </Drawer>
    </div>
  );
}

