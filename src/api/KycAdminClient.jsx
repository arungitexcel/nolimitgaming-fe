import axios from "axios";
import { toast } from "react-toastify";
import { KYC_API_URL } from "./constant";

const api = axios.create({
  baseURL: KYC_API_URL,
});

api.interceptors.request.use((config) => {
  if (KYC_API_URL && KYC_API_URL.includes("ngrok")) {
    config.headers["ngrok-skip-browser-warning"] = "true";
  }
  return config;
});

function getAdminKey() {
  const key = localStorage.getItem("kycAdminKey");
  return key && String(key).trim() ? String(key).trim() : null;
}

export function setKycAdminKey(key) {
  if (!key || !String(key).trim()) {
    localStorage.removeItem("kycAdminKey");
    return;
  }
  localStorage.setItem("kycAdminKey", String(key).trim());
}

async function request(method, url, data) {
  const key = getAdminKey();
  try {
    const res = await api.request({
      method,
      url,
      data,
      headers: {
        "X-Admin-Key": key || undefined,
      },
    });
    return res.data;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Request failed";
    toast.error(typeof msg === "string" ? msg : "Request failed");
    throw err;
  }
}

export async function listKycSubmissions({ status } = {}) {
  const qs = new URLSearchParams();
  if (status) qs.set("status", status);
  const url = qs.toString() ? `/kyc/review?${qs.toString()}` : "/kyc/review";
  const res = await request("get", url);
  return res?.data || [];
}

export async function approveKyc({ kycId, reviewedBy, notifyEmail } = {}) {
  return await request("post", "/kyc/approve", { kycId, reviewedBy, notifyEmail });
}

export async function rejectKyc({ kycId, reason, reviewedBy, notifyEmail } = {}) {
  return await request("post", "/kyc/reject", { kycId, reason, reviewedBy, notifyEmail });
}

export async function patchKycNotes({ kycId, adminComment, internalNotes } = {}) {
  return await request("patch", `/kyc/review/${kycId}/notes`, { adminComment, internalNotes });
}

export async function fetchKycDocumentBlob({ kycId, filename } = {}) {
  const key = getAdminKey();
  const res = await api.get(`/kyc/document/${encodeURIComponent(kycId)}/${encodeURIComponent(filename)}`, {
    responseType: "blob",
    headers: { "X-Admin-Key": key || undefined },
  });
  return res.data;
}

