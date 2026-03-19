import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import { fetchManagerData, postManagerData } from "../../api/ManagerClient";

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function PromoCodesPage() {
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activePromo, setActivePromo] = useState(null);

  const { data, isLoading, mutate } = useSWR(
    "/manager/promo-codes",
    fetchManagerData,
    {
      revalidateOnFocus: false,
    }
  );

  const promos = Array.isArray(data?.promos) ? data.promos : [];

  const onCreate = async (values) => {
    setCreating(true);
    const res = await postManagerData("/manager/promo-codes/create", {
      code: String(values.code || "").trim().toUpperCase(),
      rewardChips: Number(values.rewardChips),
      expiresAt: values.expiresAt,
      maxRedemptions: Number(values.maxRedemptions),
      isActive: Boolean(values.isActive),
    });
    setCreating(false);
    if (res?.success) {
      createForm.resetFields();
      mutate();
    }
  };

  const onOpenEdit = (promo) => {
    setActivePromo(promo);
    editForm.setFieldsValue({
      rewardChips: promo.rewardChips,
      maxRedemptions: promo.maxRedemptions,
      expiresAt: promo.expiresAt ? String(promo.expiresAt).slice(0, 16) : "",
      isActive: promo.isActive,
    });
  };

  const onCloseEdit = () => {
    setActivePromo(null);
    editForm.resetFields();
  };

  const onSaveEdit = async () => {
    const values = await editForm.validateFields();
    setEditing(true);
    const res = await postManagerData("/manager/promo-codes/update", {
      promoId: activePromo?._id,
      rewardChips: Number(values.rewardChips),
      maxRedemptions: Number(values.maxRedemptions),
      expiresAt: values.expiresAt,
      isActive: Boolean(values.isActive),
    });
    setEditing(false);
    if (res?.success) {
      onCloseEdit();
      mutate();
    }
  };

  const onQuickToggle = async (promo) => {
    await postManagerData("/manager/promo-codes/update", {
      promoId: promo._id,
      isActive: !promo.isActive,
    });
    mutate();
  };

  const columns = useMemo(
    () => [
      {
        title: "Code",
        dataIndex: "code",
        key: "code",
        render: (v) => (
          <Typography.Text copyable={{ text: String(v) }} strong>
            {String(v)}
          </Typography.Text>
        ),
      },
      {
        title: "Reward Chips",
        dataIndex: "rewardChips",
        key: "rewardChips",
      },
      {
        title: "Usage",
        key: "usage",
        render: (_, r) => `${Number(r.totalRedemptions || 0)} / ${Number(r.maxRedemptions || 0)}`,
      },
      {
        title: "Expires",
        dataIndex: "expiresAt",
        key: "expiresAt",
        render: (v) => (v ? DATE_TIME_FORMATTER.format(new Date(v)) : "—"),
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        render: (v, r) => {
          const isExpired =
            r?.expiresAt && new Date(r.expiresAt).getTime() <= Date.now();
          if (!v) return <Tag>Disabled</Tag>;
          if (isExpired) return <Tag color="orange">Expired</Tag>;
          return <Tag color="green">Active</Tag>;
        },
      },
      {
        title: "Action",
        key: "action",
        width: 170,
        render: (_, r) => (
          <Space>
            <Button size="small" onClick={() => onOpenEdit(r)}>
              Edit
            </Button>
            <Button size="small" onClick={() => onQuickToggle(r)}>
              {r.isActive ? "Disable" : "Enable"}
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div className="AdminSurface">
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div className="AdminSurfaceHeader">
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={4} className="AdminSurfaceTitle">
              Promo Codes
            </Typography.Title>
            <Typography.Text className="AdminSurfaceSubtitle">
              Create and manage promo codes for free play chips.
            </Typography.Text>
          </div>
        </div>

        <Form
          form={createForm}
          layout="vertical"
          onFinish={onCreate}
          initialValues={{ isActive: true }}
          className="AdminPromoForm"
        >
          <div className="AdminPromoFormGrid">
            <Form.Item
              name="code"
              label="Promo Code"
              rules={[{ required: true, message: "Enter promo code" }]}
            >
              <Input
                name="promoCode"
                aria-label="Promo Code"
                placeholder="WELCOME100…"
                autoComplete="off"
                spellCheck={false}
              />
            </Form.Item>
            <Form.Item
              name="rewardChips"
              label="Reward Chips"
              rules={[{ required: true, message: "Enter reward chips" }]}
            >
              <InputNumber
                name="rewardChips"
                aria-label="Reward Chips"
                min={1}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="maxRedemptions"
              label="Max Redemptions"
              rules={[{ required: true, message: "Enter max redemptions" }]}
            >
              <InputNumber
                name="maxRedemptions"
                aria-label="Max Redemptions"
                min={1}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="expiresAt"
              label="Expiry (date & time)"
              rules={[{ required: true, message: "Select expiry date/time" }]}
            >
              <Input
                name="expiresAt"
                aria-label="Expiry Date Time"
                type="datetime-local"
              />
            </Form.Item>
          </div>
          <div className="AdminPromoFormActions">
            <Form.Item name="isActive" label="Active on create" valuePropName="checked">
              <Switch aria-label="Active on create" />
            </Form.Item>
            <Button htmlType="submit" type="primary" loading={creating}>
              Create Promo Code
            </Button>
          </div>
        </Form>

        <Table
          className="AdminTable"
          rowKey={(r) => r?._id}
          dataSource={promos}
          columns={columns}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 900 }}
        />
      </Space>

      <Modal
        title="Edit Promo Code"
        open={Boolean(activePromo)}
        onCancel={onCloseEdit}
        onOk={onSaveEdit}
        confirmLoading={editing}
        okText="Save Changes"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="Code">
            <Input value={activePromo?.code || ""} disabled />
          </Form.Item>
          <Form.Item
            name="rewardChips"
            label="Reward Chips"
            rules={[{ required: true, message: "Enter reward chips" }]}
          >
            <InputNumber
              name="editRewardChips"
              aria-label="Edit Reward Chips"
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="maxRedemptions"
            label="Max Redemptions"
            rules={[{ required: true, message: "Enter max redemptions" }]}
          >
            <InputNumber
              name="editMaxRedemptions"
              aria-label="Edit Max Redemptions"
              min={1}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="expiresAt"
            label="Expiry (date & time)"
            rules={[{ required: true, message: "Select expiry date/time" }]}
          >
            <Input
              name="editExpiresAt"
              aria-label="Edit Expiry Date Time"
              type="datetime-local"
            />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch aria-label="Promo Active" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
