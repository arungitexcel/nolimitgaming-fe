import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Divider,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import { BASE_API_URL } from "../../api/constant";
import { fetchManagerData, postManagerData } from "../../api/ManagerClient";
import { useManagerAuth } from "../../context/ManagerAuthContext";

const REQUIRED_FILES_BY_DOC_TYPE = {
  passport: ["passport", "selfie"],
  drivers_license: ["driver_front", "driver_back", "selfie"],
  aadhaar: ["aadhaar_front", "selfie"],
  pan: ["pan_front", "selfie"],
  id_card: ["id_front", "id_back", "selfie_with_id"],
};

function statusTag(status) {
  if (status === "approved") return <Tag color="green">Approved</Tag>;
  if (status === "rejected") return <Tag color="red">Rejected</Tag>;
  if (status === "pending_review") return <Tag color="gold">Pending</Tag>;
  return <Tag>{status || "—"}</Tag>;
}

function docLabel(key) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function pickFilename(filePaths, key) {
  const rel = filePaths?.[key];
  if (!rel || typeof rel !== "string") return null;
  const parts = rel.split("/");
  return parts[parts.length - 1] || null;
}

function missingRequiredFiles(row) {
  const required = REQUIRED_FILES_BY_DOC_TYPE[row?.documentType] || [];
  const present = new Set(
    Object.entries(row?.filePaths || {})
      .filter(([, v]) => typeof v === "string" && v.trim())
      .map(([k]) => k)
  );
  return required.filter((k) => !present.has(k));
}

function normalizeText(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function includesSearch(row, q) {
  if (!q) return true;
  const hay = [
    row?.kycId,
    row?.userId,
    row?.fullName,
    row?.email,
    row?.documentType,
    row?.status,
  ]
    .map((x) => normalizeText(x).toLowerCase())
    .join(" ");
  return hay.includes(q.toLowerCase());
}

function listAllFiles(filePaths) {
  const entries = Object.entries(filePaths || {}).filter(
    ([, v]) => typeof v === "string" && v.trim()
  );
  return entries.map(([key, rel]) => {
    const parts = rel.split("/");
    const filename = parts[parts.length - 1] || "";
    return { key, filename };
  });
}

async function fetchManagerKycList({ status } = {}) {
  const qs = new URLSearchParams();
  if (status) qs.set("status", status);
  const url = qs.toString() ? `/manager/kyc/review?${qs.toString()}` : "/manager/kyc/review";
  const res = await fetchManagerData(url);
  // manager API returns successResponse(data = kycServiceResponse)
  // kycServiceResponse is usually: { status: "success", data: [...] }
  const nested = res?.data?.data;
  if (Array.isArray(nested)) return nested;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
}

async function approveManagerKyc({ kycId }) {
  return await postManagerData("/manager/kyc/approve", { kycId });
}

async function rejectManagerKyc({ kycId, reason }) {
  return await postManagerData("/manager/kyc/reject", { kycId, reason });
}

async function fetchManagerKycDocumentBlob({ kycId, filename }) {
  const token = localStorage.getItem("managerToken");
  const res = await axios.get(
    `${BASE_API_URL}/manager/kyc/document/${encodeURIComponent(kycId)}/${encodeURIComponent(filename)}`,
    {
      responseType: "blob",
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    }
  );
  return res.data;
}

function DocumentThumb({ kycId, filePaths, fileKey }) {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const objectUrlRef = useRef(null);

  const filename = useMemo(() => pickFilename(filePaths, fileKey), [filePaths, fileKey]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const load = async () => {
    if (!filename || loading) return;
    setLoading(true);
    try {
      const blob = await fetchManagerKycDocumentBlob({ kycId, filename });
      const objUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objUrl;
      setUrl(objUrl);
    } finally {
      setLoading(false);
    }
  };

  if (!filename) return <Typography.Text type="secondary">—</Typography.Text>;

  return (
    <Button
      size="small"
      onClick={async () => {
        if (!url) await load();
        if (!objectUrlRef.current) return;
        Modal.info({
          title: docLabel(fileKey),
          width: 900,
          content: (
            <div style={{ marginTop: 12 }}>
              <img
                src={objectUrlRef.current}
                alt={`${docLabel(fileKey)} preview`}
                style={{
                  width: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.2)",
                }}
              />
            </div>
          ),
        });
      }}
      loading={loading}
    >
      View
    </Button>
  );
}

export default function KycReviewPage() {
  const { manager } = useManagerAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending_review");
  const [search, setSearch] = useState("");
  const [rejectModal, setRejectModal] = useState({ open: false, kycId: null, reason: "" });
  const [busyById, setBusyById] = useState({});
  const [userById, setUserById] = useState({});

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchManagerKycList({ status: status || undefined });
      setRows(list);

      // Hydrate username/email by userId (best-effort)
      const uniqueIds = Array.from(new Set(list.map((r) => r?.userId).filter(Boolean)));
      const missing = uniqueIds.filter((id) => !userById[id]);
      if (missing.length && manager?._id) {
        const nextPairs = await Promise.all(
          missing.slice(0, 25).map(async (id) => {
            try {
              const params = new URLSearchParams({
                managerid: manager._id,
                page: "1",
                limit: "1",
                search: id,
              });
              const res = await fetchManagerData(`/manager/get-mine-users?${params.toString()}`);
              const data = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
              const u = data?.[0];
              if (!u) return [id, null];
              return [
                id,
                {
                  username: u.username || "",
                  email: u.email || "",
                  name: u.name || `${u.firstname || ""} ${u.lastname || ""}`.trim(),
                },
              ];
            } catch {
              return [id, null];
            }
          })
        );
        setUserById((prev) => {
          const next = { ...prev };
          for (const [id, u] of nextPairs) {
            if (u) next[id] = u;
          }
          return next;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (includesSearch(r, search)) return true;
        const u = userById[r?.userId];
        const q = (search || "").toLowerCase();
        if (!q) return true;
        return [u?.username, u?.email, u?.name].some((x) => (x || "").toLowerCase().includes(q));
      }),
    [rows, search, userById]
  );

  const setBusy = (kycId, val) => setBusyById((p) => ({ ...p, [kycId]: val }));

  const columns = useMemo(
    () => [
      {
        title: "KYC ID",
        dataIndex: "kycId",
        key: "kycId",
        width: 230,
        ellipsis: true,
        render: (v) => <Typography.Text copyable={{ text: String(v) }}>{v}</Typography.Text>,
      },
      {
        title: "User ID",
        dataIndex: "userId",
        key: "userId",
        width: 180,
        ellipsis: true,
        render: (v) => <Typography.Text copyable={{ text: String(v) }}>{v}</Typography.Text>,
      },
      {
        title: "Username",
        key: "username",
        width: 160,
        render: (_, r) => userById[r?.userId]?.username || "—",
      },
      {
        title: "Email",
        key: "email",
        width: 230,
        render: (_, r) => {
          const email = userById[r?.userId]?.email || r?.email;
          return email ? <Typography.Text copyable={{ text: String(email) }}>{email}</Typography.Text> : "—";
        },
      },
      {
        title: "Documents",
        key: "docs",
        width: 180,
        render: (_, r) => {
          const all = listAllFiles(r.filePaths);
          const count = all.length;
          return (
            <Space>
              <Button
                size="small"
                disabled={count === 0}
                onClick={() => {
                  Modal.info({
                    title: `Documents (${count})`,
                    width: 920,
                    content: (
                      <div style={{ marginTop: 12 }}>
                        <Space direction="vertical" size={10} style={{ width: "100%" }}>
                          {count === 0 ? (
                            <Typography.Text type="secondary">No documents uploaded.</Typography.Text>
                          ) : (
                            all.map((f) => (
                              <div
                                key={f.key}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 12,
                                  padding: 10,
                                  borderRadius: 12,
                                  border: "1px solid rgba(255,255,255,0.10)",
                                  background: "rgba(255,255,255,0.03)",
                                }}
                              >
                                <div style={{ minWidth: 0 }}>
                                  <Typography.Text strong>{docLabel(f.key)}</Typography.Text>
                                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                                    {f.filename}
                                  </div>
                                </div>
                                <DocumentThumb kycId={r.kycId} filePaths={r.filePaths} fileKey={f.key} />
                              </div>
                            ))
                          )}
                        </Space>
                      </div>
                    ),
                  });
                }}
              >
                View ({count})
              </Button>
              {missingRequiredFiles(r).length ? (
                <Tag color="red">Missing</Tag>
              ) : (
                <Tag color="green">Complete</Tag>
              )}
            </Space>
          );
        },
      },
      {
        title: "Requested",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 190,
        render: (v) => (v ? dateTimeFormatter.format(new Date(v)) : "—"),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (v) => statusTag(v),
      },
      {
        title: "Action",
        key: "action",
        fixed: "right",
        width: 160,
        render: (_, r) => {
          const missing = missingRequiredFiles(r);
          const busy = !!busyById[r.kycId];
          return (
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Button
                type="primary"
                size="small"
                disabled={busy || missing.length > 0}
                onClick={async () => {
                  setBusy(r.kycId, true);
                  try {
                    await approveManagerKyc({ kycId: r.kycId });
                    await load();
                  } finally {
                    setBusy(r.kycId, false);
                  }
                }}
              >
                Approve
              </Button>
              <Button
                danger
                size="small"
                disabled={busy}
                onClick={() => {
                  const prefill =
                    missing.length > 0
                      ? `Missing: ${missing.map(docLabel).join(", ")}`
                      : r.rejectionReason || "";
                  setRejectModal({ open: true, kycId: r.kycId, reason: prefill });
                }}
              >
                Reject
              </Button>
              {missing.length > 0 ? (
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Missing: {missing.map(docLabel).join(", ")}
                </Typography.Text>
              ) : null}
            </Space>
          );
        },
      },
    ],
    [busyById, dateTimeFormatter, userById]
  );

  return (
    <div className="AdminSurface">
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <div className="AdminSurfaceHeader">
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={4} className="AdminSurfaceTitle">
              KYC Submissions
            </Typography.Title>
            <Typography.Text className="AdminSurfaceSubtitle">
              Review documents, add comments, and approve or reject.
            </Typography.Text>
          </div>
          <Space wrap>
            <Select
              value={status}
              onChange={(v) => setStatus(v)}
              style={{ width: 180 }}
              options={[
                { value: "pending_review", label: "Pending Review" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "", label: "All" },
              ]}
              aria-label="Filter by status"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search (User ID, name, email, KYC ID…)"
              allowClear
              className="AdminSearch"
              aria-label="Search KYC submissions"
            />
            <Button onClick={load} loading={loading}>
              Refresh
            </Button>
          </Space>
        </div>

        <Divider style={{ margin: "4px 0 12px" }} />

        <Table
          className="AdminTable"
          rowKey={(r) => r.kycId}
          columns={columns}
          dataSource={filtered}
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Space>

      <Modal
        title="Reject KYC"
        open={rejectModal.open}
        onCancel={() => setRejectModal({ open: false, kycId: null, reason: "" })}
        okText="Reject"
        okButtonProps={{ danger: true }}
        onOk={async () => {
          const kycId = rejectModal.kycId;
          const reason = rejectModal.reason;
          if (!kycId) return;
          setBusy(kycId, true);
          try {
            await rejectManagerKyc({ kycId, reason });
            setRejectModal({ open: false, kycId: null, reason: "" });
            await load();
          } finally {
            setBusy(kycId, false);
          }
        }}
      >
        <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
          Provide a clear reason so the user knows what to fix.
        </Typography.Paragraph>
        <Input.TextArea
          value={rejectModal.reason}
          onChange={(e) => setRejectModal((p) => ({ ...p, reason: e.target.value }))}
          placeholder="Reason…"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Modal>
    </div>
  );
}

