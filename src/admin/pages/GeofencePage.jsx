import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  deleteManagerData,
  fetchManagerData,
  postManagerData,
  updateManagerData,
} from "../../api/ManagerClient";

function parseSettingsResponse(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.allowedCountries)) return res.allowedCountries;
  if (Array.isArray(res?.countries)) return res.countries;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.allowedCountries)) return res.data.allowedCountries;
  if (Array.isArray(res?.data?.countries)) return res.data.countries;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function toStateCodes(value) {
  return (value || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

function normalizeCountry(item) {
  return {
    countryCode: String(item?.countryCode || "").toUpperCase(),
    stateCodes: Array.isArray(item?.stateCodes)
      ? item.stateCodes.map((s) => String(s).toUpperCase())
      : [],
  };
}

export default function GeofencePage() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingCode, setDeletingCode] = useState("");

  const { data, isLoading, mutate } = useSWR(
    "/manager/geofence-settings",
    fetchManagerData,
    { revalidateOnFocus: false }
  );

  const rows = useMemo(
    () =>
      parseSettingsResponse(data)
        .map(normalizeCountry)
        .filter((x) => x.countryCode),
    [data]
  );

  const openAddModal = () => {
    setEditingCountry(null);
    form.setFieldsValue({ countryCode: "", stateCodesInput: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingCountry(record.countryCode);
    form.setFieldsValue({
      countryCode: record.countryCode,
      stateCodesInput: (record.stateCodes || []).join(", "),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCountry(null);
    form.resetFields();
  };

  const onSubmit = async (values) => {
    const countryCode = String(values.countryCode || "").toUpperCase().trim();
    const stateCodes = toStateCodes(values.stateCodesInput);
    setSubmitting(true);

    let res;
    if (editingCountry) {
      const payload = countryCode === "US" ? { stateCodes } : {};
      res = await updateManagerData(
        `/manager/geofence-settings/countries/${editingCountry}`,
        payload
      );
    } else {
      const payload =
        countryCode === "US" ? { countryCode, stateCodes } : { countryCode };
      res = await postManagerData("/manager/geofence-settings/countries", payload);
    }

    setSubmitting(false);
    if (res?.success !== false) {
      closeModal();
      mutate();
    }
  };

  const onDeleteCountry = async (countryCode) => {
    setDeletingCode(countryCode);
    const res = await deleteManagerData(
      `/manager/geofence-settings/countries/${countryCode}`
    );
    setDeletingCode("");
    if (res?.success !== false) {
      mutate();
    }
  };

  const columns = [
    {
      title: "Country",
      dataIndex: "countryCode",
      key: "countryCode",
      width: 140,
      render: (value) => <Tag color="geekblue">{value}</Tag>,
    },
    {
      title: "US State Scope",
      key: "stateScope",
      render: (_, record) => {
        if (record.countryCode !== "US") {
          return <Typography.Text type="secondary">Not applicable</Typography.Text>;
        }
        if (!record.stateCodes.length) {
          return <Typography.Text>All US states allowed</Typography.Text>;
        }
        return (
          <Typography.Text>
            {record.stateCodes.join(", ")}
          </Typography.Text>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title={`Remove ${record.countryCode}?`}
            description="This country will no longer be allowed."
            okText="Remove"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDeleteCountry(record.countryCode)}
          >
            <Button
              size="small"
              danger
              loading={deletingCode === record.countryCode}
            >
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const isUS =
    String(form.getFieldValue("countryCode") || "")
      .toUpperCase()
      .trim() === "US";

  return (
    <div className="AdminSurface">
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div className="AdminSurfaceHeader">
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={4} className="AdminSurfaceTitle">
              Geofence
            </Typography.Title>
            <Typography.Text className="AdminSurfaceSubtitle">
              Manage allowed countries for login/registration. For US, optionally limit by state codes.
            </Typography.Text>
          </div>
          <Button type="primary" onClick={openAddModal}>
            Add Country
          </Button>
        </div>

        <Alert
          type="info"
          showIcon
          message="US-specific behavior"
          description="For country code US, leave states empty to allow all US states. Otherwise provide comma-separated state codes like CA, NY, TX."
        />

        <Card bordered={false}>
          <Table
            rowKey="countryCode"
            className="AdminTable"
            dataSource={rows}
            columns={columns}
            loading={isLoading}
            pagination={{ pageSize: 10, showSizeChanger: false }}
          />
        </Card>
      </Space>

      <Modal
        title={editingCountry ? `Update ${editingCountry}` : "Add Allowed Country"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="countryCode"
            label="Country Code"
            rules={[
              { required: true, message: "Enter country code" },
              {
                pattern: /^[A-Za-z]{2}$/,
                message: "Country code must be 2 letters",
              },
            ]}
          >
            <Input
              maxLength={2}
              placeholder="US, IN, CA..."
              disabled={Boolean(editingCountry)}
            />
          </Form.Item>

          <Form.Item
            name="stateCodesInput"
            label="US State Codes (optional)"
            tooltip="Only used when country code is US"
          >
            <Input
              placeholder={isUS ? "CA, NY, TX" : "Only needed for US"}
              disabled={!isUS}
            />
          </Form.Item>

          <Space>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {editingCountry ? "Update Country" : "Add Country"}
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
