import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  deleteManagerData,
  fetchManagerData,
  updateManagerData,
} from "../../api/ManagerClient";

function parseSlugs(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim().toLowerCase()).filter(Boolean);
  }
  return [];
}

function parseTagOptions(res) {
  let tagsArray = [];
  if (Array.isArray(res?.data)) {
    tagsArray = res.data;
  } else if (res && typeof res === "object" && res.success) {
    const keys = Object.keys(res).filter((k) => !Number.isNaN(Number(k)));
    if (keys.length) {
      tagsArray = keys.sort((a, b) => Number(a) - Number(b)).map((k) => res[k]);
    }
  } else if (Array.isArray(res)) {
    tagsArray = res;
  }

  return tagsArray
    .map((tag) => {
      const slug = String(tag?.slug || "").trim().toLowerCase();
      if (!slug) return null;
      return {
        value: slug,
        label: tag?.label ? `${tag.label} (${slug})` : slug,
      };
    })
    .filter(Boolean);
}

function parseSettings(res) {
  const src = res?.data && typeof res.data === "object" ? res.data : res || {};
  const globalBlockedSlugs = Array.isArray(src?.globalBlockedSlugs)
    ? src.globalBlockedSlugs
    : Array.isArray(src?.global?.blockedSlugs)
      ? src.global.blockedSlugs
      : [];

  const countryRulesRaw = Array.isArray(src?.blockedByCountry)
    ? src.blockedByCountry
    : Array.isArray(src?.countryRules)
      ? src.countryRules
      : Array.isArray(src?.countries)
        ? src.countries
        : [];

  const usStateRulesRaw = Array.isArray(src?.blockedByUSState)
    ? src.blockedByUSState
    : Array.isArray(src?.usStateRules)
      ? src.usStateRules
      : Array.isArray(src?.usStates)
        ? src.usStates
        : [];

  const countryRules = countryRulesRaw
    .map((item) => ({
      code: String(item?.countryCode || item?.code || "").toUpperCase(),
      blockedSlugs: Array.isArray(item?.blockedSlugs)
        ? item.blockedSlugs.map((x) => String(x).toLowerCase())
        : [],
    }))
    .filter((x) => x.code);

  const usStateRules = usStateRulesRaw
    .map((item) => ({
      code: String(item?.stateCode || item?.code || "").toUpperCase(),
      blockedSlugs: Array.isArray(item?.blockedSlugs)
        ? item.blockedSlugs.map((x) => String(x).toLowerCase())
        : [],
    }))
    .filter((x) => x.code);

  return {
    globalBlockedSlugs,
    countryRules,
    usStateRules,
  };
}

export default function PolymarketCategoryVisibilityPage() {
  const [globalForm] = Form.useForm();
  const [countryForm] = Form.useForm();
  const [stateForm] = Form.useForm();
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingCountry, setSavingCountry] = useState(false);
  const [savingState, setSavingState] = useState(false);
  const [deletingCountryCode, setDeletingCountryCode] = useState("");
  const [deletingStateCode, setDeletingStateCode] = useState("");

  const { data, isLoading, mutate } = useSWR(
    "/manager/polymarket-category-settings",
    fetchManagerData,
    { revalidateOnFocus: false }
  );
  const { data: tagsData, isLoading: loadingTags } = useSWR(
    "/sports/polymarket_tags",
    fetchManagerData,
    { revalidateOnFocus: false }
  );

  const settings = useMemo(() => parseSettings(data), [data]);
  const slugOptions = useMemo(() => {
    const baseOptions = parseTagOptions(tagsData);
    const allUsed = new Set([
      ...settings.globalBlockedSlugs,
      ...settings.countryRules.flatMap((r) => r.blockedSlugs || []),
      ...settings.usStateRules.flatMap((r) => r.blockedSlugs || []),
    ]);
    const existingSet = new Set(baseOptions.map((o) => o.value));
    for (const slug of allUsed) {
      if (slug && !existingSet.has(slug)) {
        baseOptions.push({ value: slug, label: `${slug} (existing rule)` });
      }
    }
    return baseOptions;
  }, [tagsData, settings]);

  const onSaveGlobal = async (values) => {
    setSavingGlobal(true);
    const res = await updateManagerData(
      "/manager/polymarket-category-settings/global",
      {
        blockedSlugs: parseSlugs(values.globalBlockedSlugsInput),
      }
    );
    setSavingGlobal(false);
    if (res?.success !== false) {
      mutate();
    }
  };

  const onSaveCountry = async (values) => {
    setSavingCountry(true);
    const code = String(values.countryCode || "").toUpperCase().trim();
    const res = await updateManagerData(
      `/manager/polymarket-category-settings/countries/${code}`,
      {
        blockedSlugs: parseSlugs(values.countryBlockedSlugsInput),
      }
    );
    setSavingCountry(false);
    if (res?.success !== false) {
      countryForm.resetFields();
      mutate();
    }
  };

  const onSaveState = async (values) => {
    setSavingState(true);
    const code = String(values.stateCode || "").toUpperCase().trim();
    const res = await updateManagerData(
      `/manager/polymarket-category-settings/us-states/${code}`,
      {
        blockedSlugs: parseSlugs(values.stateBlockedSlugsInput),
      }
    );
    setSavingState(false);
    if (res?.success !== false) {
      stateForm.resetFields();
      mutate();
    }
  };

  const onDeleteCountry = async (countryCode) => {
    setDeletingCountryCode(countryCode);
    const res = await deleteManagerData(
      `/manager/polymarket-category-settings/countries/${countryCode}`
    );
    setDeletingCountryCode("");
    if (res?.success !== false) {
      mutate();
    }
  };

  const onDeleteState = async (stateCode) => {
    setDeletingStateCode(stateCode);
    const res = await deleteManagerData(
      `/manager/polymarket-category-settings/us-states/${stateCode}`
    );
    setDeletingStateCode("");
    if (res?.success !== false) {
      mutate();
    }
  };

  return (
    <div className="AdminSurface">
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div className="AdminSurfaceHeader">
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={4} className="AdminSurfaceTitle">
              Polymarket Category Visibility
            </Typography.Title>
            <Typography.Text className="AdminSurfaceSubtitle">
              Block category slugs globally, by country, and by US state.
            </Typography.Text>
          </div>
        </div>

        <Alert
          type="info"
          showIcon
          message="Slug format"
          description="Select slugs from prediction categories only. Values are saved in lowercase."
        />

        <Card title="Global Rules" bordered={false}>
          <Form
            form={globalForm}
            layout="vertical"
            onFinish={onSaveGlobal}
            initialValues={{
              globalBlockedSlugsInput: settings.globalBlockedSlugs,
            }}
            key={settings.globalBlockedSlugs.join(",")}
          >
            <Form.Item
              name="globalBlockedSlugsInput"
              label="Blocked Slugs (global)"
            >
              <Select
                mode="multiple"
                allowClear
                showSearch
                optionFilterProp="label"
                loading={loadingTags}
                options={slugOptions}
                placeholder="Select blocked slugs"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={savingGlobal}>
              Save Global Rules
            </Button>
          </Form>
        </Card>

        <Card title="Country Rules" bordered={false}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Form form={countryForm} layout="vertical" onFinish={onSaveCountry}>
              <div className="AdminPromoFormGrid">
                <Form.Item
                  name="countryCode"
                  label="Country Code"
                  rules={[
                    { required: true, message: "Enter country code" },
                    { pattern: /^[A-Za-z]{2}$/, message: "Must be 2 letters" },
                  ]}
                >
                  <Input maxLength={2} placeholder="IN, US, CA..." />
                </Form.Item>
                <Form.Item
                  name="countryBlockedSlugsInput"
                  label="Blocked Slugs"
                  rules={[{ required: true, message: "Select blocked slugs" }]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    loading={loadingTags}
                    options={slugOptions}
                    placeholder="Select blocked slugs"
                  />
                </Form.Item>
              </div>
              <Button type="primary" htmlType="submit" loading={savingCountry}>
                Save Country Rule
              </Button>
            </Form>

            <Table
              rowKey="code"
              className="AdminTable"
              loading={isLoading}
              dataSource={settings.countryRules}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              columns={[
                {
                  title: "Country",
                  dataIndex: "code",
                  key: "code",
                  width: 120,
                  render: (v) => <Tag color="blue">{v}</Tag>,
                },
                {
                  title: "Blocked Slugs",
                  dataIndex: "blockedSlugs",
                  key: "blockedSlugs",
                  render: (v) => (Array.isArray(v) && v.length ? v.join(", ") : "—"),
                },
                {
                  title: "Action",
                  key: "action",
                  width: 140,
                  render: (_, record) => (
                    <Popconfirm
                      title={`Remove ${record.code} rule?`}
                      onConfirm={() => onDeleteCountry(record.code)}
                      okText="Remove"
                    >
                      <Button
                        danger
                        size="small"
                        loading={deletingCountryCode === record.code}
                      >
                        Remove
                      </Button>
                    </Popconfirm>
                  ),
                },
              ]}
            />
          </Space>
        </Card>

        <Card title="US State Rules" bordered={false}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Form form={stateForm} layout="vertical" onFinish={onSaveState}>
              <div className="AdminPromoFormGrid">
                <Form.Item
                  name="stateCode"
                  label="US State Code"
                  rules={[
                    { required: true, message: "Enter US state code" },
                    { pattern: /^[A-Za-z]{2}$/, message: "Must be 2 letters" },
                  ]}
                >
                  <Input maxLength={2} placeholder="CA, NY, TX..." />
                </Form.Item>
                <Form.Item
                  name="stateBlockedSlugsInput"
                  label="Blocked Slugs"
                  rules={[{ required: true, message: "Select blocked slugs" }]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    loading={loadingTags}
                    options={slugOptions}
                    placeholder="Select blocked slugs"
                  />
                </Form.Item>
              </div>
              <Button type="primary" htmlType="submit" loading={savingState}>
                Save US State Rule
              </Button>
            </Form>

            <Table
              rowKey="code"
              className="AdminTable"
              loading={isLoading}
              dataSource={settings.usStateRules}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              columns={[
                {
                  title: "State",
                  dataIndex: "code",
                  key: "code",
                  width: 120,
                  render: (v) => <Tag color="purple">{v}</Tag>,
                },
                {
                  title: "Blocked Slugs",
                  dataIndex: "blockedSlugs",
                  key: "blockedSlugs",
                  render: (v) => (Array.isArray(v) && v.length ? v.join(", ") : "—"),
                },
                {
                  title: "Action",
                  key: "action",
                  width: 140,
                  render: (_, record) => (
                    <Popconfirm
                      title={`Remove ${record.code} rule?`}
                      onConfirm={() => onDeleteState(record.code)}
                      okText="Remove"
                    >
                      <Button
                        danger
                        size="small"
                        loading={deletingStateCode === record.code}
                      >
                        Remove
                      </Button>
                    </Popconfirm>
                  ),
                },
              ]}
            />
          </Space>
        </Card>
      </Space>
    </div>
  );
}
