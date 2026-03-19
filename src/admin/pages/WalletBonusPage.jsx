import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { fetchManagerData, postManagerData } from "../../api/ManagerClient";
import { useManagerAuth } from "../../context/ManagerAuthContext";

function getUsersFromResponse(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

export default function WalletBonusPage() {
  const { manager } = useManagerAuth();
  const [bonusForm] = Form.useForm();
  const [walletForm] = Form.useForm();

  const [savingBonus, setSavingBonus] = useState(false);
  const [savingWallet, setSavingWallet] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const { data: bonusData, mutate: mutateBonus } = useSWR(
    "/manager/bonus-settings",
    fetchManagerData,
    { revalidateOnFocus: false }
  );

  const currentBonus = bonusData || {};

  const bonusInitialValues = useMemo(
    () => ({
      registrationBonusEnabled:
        currentBonus?.registrationBonusEnabled !== false,
      registrationBonusAmount: Number(
        currentBonus?.registrationBonusAmount ?? 1000
      ),
      registrationBonusCurrency:
        currentBonus?.registrationBonusCurrency === "cash"
          ? "cash"
          : "play_chips",
      registrationBonusTiming:
        currentBonus?.registrationBonusTiming || "REGISTRATION",
    }),
    [currentBonus]
  );

  const searchUsers = async (text) => {
    if (!manager?._id) return;
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        managerid: manager._id,
        page: "1",
        limit: "25",
        search: text?.trim() || " ",
      });
      const res = await fetchManagerData(`/manager/get-mine-users?${params}`);
      setUsers(getUsersFromResponse(res));
    } finally {
      setLoadingUsers(false);
    }
  };

  const onSaveBonus = async (values) => {
    setSavingBonus(true);
    const res = await postManagerData("/manager/update-settings", {
      type: "bonus",
      registrationBonusEnabled: Boolean(values.registrationBonusEnabled),
      registrationBonusAmount: Number(values.registrationBonusAmount),
      registrationBonusCurrency: values.registrationBonusCurrency,
      registrationBonusTiming: values.registrationBonusTiming,
    });
    setSavingBonus(false);
    if (res?.success) {
      mutateBonus();
    }
  };

  const onAdjustWallet = async (values) => {
    setSavingWallet(true);
    const res = await postManagerData("/manager/wallet-adjust", {
      userId: values.userId,
      currency: values.currency,
      amount: Number(values.amount),
      action: values.action,
      reason: values.reason || "",
    });
    setSavingWallet(false);
    if (res?.success) {
      walletForm.resetFields(["amount", "reason"]);
      if (userSearch) {
        searchUsers(userSearch);
      }
    }
  };

  return (
    <div className="AdminSurface">
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div className="AdminSurfaceHeader">
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={4} className="AdminSurfaceTitle">
              Wallet & Bonus
            </Typography.Title>
            <Typography.Text className="AdminSurfaceSubtitle">
              Manage registration bonus and adjust user cash/play chips balances.
            </Typography.Text>
          </div>
        </div>

        <Card title="Registration Bonus Settings" bordered={false}>
          <Form
            key={JSON.stringify(bonusInitialValues)}
            form={bonusForm}
            layout="vertical"
            onFinish={onSaveBonus}
            initialValues={bonusInitialValues}
          >
            <div className="AdminPromoFormGrid">
              <Form.Item
                name="registrationBonusAmount"
                label="Bonus Amount"
                rules={[{ required: true, message: "Enter bonus amount" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="registrationBonusCurrency"
                label="Bonus Currency"
                rules={[{ required: true, message: "Select bonus currency" }]}
              >
                <Select
                  options={[
                    { value: "play_chips", label: "Play Chips" },
                    { value: "cash", label: "Cash" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="registrationBonusTiming"
                label="Bonus Timing"
                rules={[{ required: true, message: "Select bonus timing" }]}
              >
                <Select
                  options={[
                    { value: "REGISTRATION", label: "On Registration" },
                    { value: "KYC_APPROVED", label: "After KYC Approved" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="registrationBonusEnabled"
                label="Enable Bonus"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
            <Button type="primary" htmlType="submit" loading={savingBonus}>
              Save Bonus Settings
            </Button>
          </Form>
        </Card>

        <Card title="Adjust User Wallet" bordered={false}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Input.Search
              allowClear
              placeholder="Search user by name, username, email, phone, or ID"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onSearch={(value) => searchUsers(value)}
              enterButton="Search"
              loading={loadingUsers}
            />

            <Form
              form={walletForm}
              layout="vertical"
              onFinish={onAdjustWallet}
              initialValues={{
                currency: "play_chips",
                action: "credit",
              }}
            >
              <div className="AdminPromoFormGrid">
                <Form.Item
                  name="userId"
                  label="User"
                  rules={[{ required: true, message: "Select user" }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    loading={loadingUsers}
                    placeholder="Search then select user"
                    options={users.map((u) => ({
                      value: u._id,
                      label: `${u.username || "N/A"} (${u._id})`,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[{ required: true, message: "Select currency" }]}
                >
                  <Select
                    options={[
                      { value: "play_chips", label: "Play Chips" },
                      { value: "cash", label: "Cash" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="action"
                  label="Action"
                  rules={[{ required: true, message: "Select action" }]}
                >
                  <Select
                    options={[
                      { value: "credit", label: "Credit" },
                      { value: "debit", label: "Debit" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[{ required: true, message: "Enter amount" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </div>

              <Form.Item name="reason" label="Reason (optional)">
                <Input placeholder="Promo adjustment, manual correction, etc." />
              </Form.Item>

              <Alert
                type="info"
                showIcon
                style={{ marginBottom: 12 }}
                message="Use debit carefully"
                description="Debit fails if user balance is insufficient. This action updates real balances immediately."
              />

              <Button type="primary" htmlType="submit" loading={savingWallet}>
                Submit Wallet Adjustment
              </Button>
            </Form>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
