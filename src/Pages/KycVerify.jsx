import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../context/AuthContext";
import { submitKyc, fetchKycStatus } from "../api/ClientFunction";
import { toast } from "react-toastify";
import "../Style/KycVerify.css";

const UPLOAD_SECTIONS = [
  {
    key: "id_front",
    label: "Upload Photo ID – Front",
    sublabel: "Scan of Photo ID (front side)",
  },
  {
    key: "id_back",
    label: "Upload Photo ID – Back",
    sublabel: "Scan of Photo ID (back side)",
  },
  {
    key: "selfie_with_id",
    label: "Upload Selfie Holding ID Card",
    sublabel: "Photo of you holding your ID",
  },
];

const KycVerify = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState({
    id_front: null,
    id_back: null,
    selfie_with_id: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [kycStatus, setKycStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) {
      setStatusLoading(false);
      return;
    }
    fetchKycStatus(user._id).then((data) => {
      setKycStatus(data?.status ?? null);
      setStatusLoading(false);
    });
  }, [user?._id]);

  const isUnderReview =
    kycStatus === "submitted" || kycStatus === "pending_review";

  const handleFileChange = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file || null }));
    setValidationError("");
  };

  const allFilesSelected = () =>
    files.id_front && files.id_back && files.selfie_with_id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Please log in to submit KYC");
      return;
    }
    if (!allFilesSelected()) {
      setValidationError("Please upload all three documents: front of ID, back of ID, and selfie holding ID.");
      return;
    }
    setValidationError("");

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("id_front", files.id_front);
    formData.append("id_back", files.id_back);
    formData.append("selfie_with_id", files.selfie_with_id);

    setSubmitting(true);
    try {
      const result = await submitKyc(formData);
      if (result?.status === "success") {
        toast.success("KYC submitted successfully");
        navigate("/profile");
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (statusLoading) {
    return (
      <div className="kyc-verify-overlay">
        <div className="kyc-verify-container">
          <div className="kyc-verify-section">
            <p className="kyc-status-loading">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isUnderReview) {
    return (
      <div className="kyc-verify-overlay">
        <div className="kyc-verify-container">
          <div className="kyc-verify-section">
            <div className="kyc-verify-header">
              <h2>
                KYC Verification
                <span className="cancel-icon" onClick={() => navigate("/profile")}>
                  <RxCross2 />
                </span>
              </h2>
            </div>
            <div className="kyc-under-review-block">
              <div className="kyc-under-review-badge">Under Review</div>
              <p className="kyc-under-review-message">
                Your documents are under review. You cannot resubmit until the
                admin has reviewed your submission. You can resubmit only if
                your previous submission is rejected.
              </p>
              <button
                type="button"
                className="kyc-submit-btn"
                onClick={() => navigate("/profile")}
              >
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-verify-overlay">
      <div className="kyc-verify-container">
        <div className="kyc-verify-section">
          <div className="kyc-verify-header">
            <h2>
              Upload Documents
              <span className="cancel-icon" onClick={() => navigate("/profile")}>
                <RxCross2 />
              </span>
            </h2>
            <p className="kyc-verify-instruction">
              Please provide a CLEAR and HIGH QUALITY photo of the front and back
              of your identity document (National ID, Passport, Driver&apos;s
              License), and a selfie holding the ID.
            </p>
          </div>

          <form className="kyc-verify-form" onSubmit={handleSubmit}>
            <div className="kyc-file-uploads kyc-upload-grid">
              {UPLOAD_SECTIONS.map(({ key, label, sublabel }) => (
                <div key={key} className="kyc-upload-block form-group file-group">
                  <label>{label}</label>
                  <span className="kyc-upload-sublabel">{sublabel}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) =>
                      handleFileChange(key, e.target.files?.[0])
                    }
                  />
                  {files[key]?.name && (
                    <span className="file-name">{files[key].name}</span>
                  )}
                </div>
              ))}
            </div>

            {validationError && (
              <p className="error">{validationError}</p>
            )}

            <button
              type="submit"
              className="kyc-submit-btn"
              disabled={submitting || !allFilesSelected()}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KycVerify;
