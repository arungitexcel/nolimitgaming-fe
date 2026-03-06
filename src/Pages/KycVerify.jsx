import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "../context/AuthContext";
import { submitKyc } from "../api/ClientFunction";
import { toast } from "react-toastify";
import "../Style/KycVerify.css";

const DOCUMENT_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "aadhaar", label: "Aadhaar" },
  { value: "pan", label: "PAN Card" },
];

const REQUIRED_FILES_BY_DOC_TYPE = {
  passport: [
    { name: "passport", label: "Passport Document" },
    { name: "selfie", label: "Selfie" },
  ],
  drivers_license: [
    { name: "driver_front", label: "Driver's License (Front)" },
    { name: "driver_back", label: "Driver's License (Back)" },
    { name: "selfie", label: "Selfie" },
  ],
  aadhaar: [
    { name: "aadhaar_front", label: "Aadhaar (Front)" },
    { name: "selfie", label: "Selfie" },
  ],
  pan: [
    { name: "pan_front", label: "PAN Card (Front)" },
    { name: "selfie", label: "Selfie" },
  ],
};

const validationSchema = Yup.object().shape({
  documentType: Yup.string()
    .oneOf(["passport", "drivers_license", "aadhaar", "pan"])
    .required("Document type is required"),
  fullName: Yup.string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  dateOfBirth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  idNumber: Yup.string()
    .trim()
    .min(4, "ID number must be at least 4 characters")
    .required("ID number is required"),
});

/** Normalize DOB to YYYY-MM-DD for API and date input (type="date"). */
function normalizeDateToYYYYMMDD(value) {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  const iso = new Date(trimmed);
  if (!Number.isNaN(iso.getTime())) {
    const y = iso.getFullYear();
    const m = String(iso.getMonth() + 1).padStart(2, "0");
    const d = String(iso.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const dmy = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    const [, day, month, year] = dmy;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return trimmed;
}

const KycVerify = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    documentType: "aadhaar",
    fullName: user ? `${user.firstname || ""} ${user.lastname || ""}`.trim() : "",
    dateOfBirth: normalizeDateToYYYYMMDD(user?.dob ?? ""),
    idNumber: "",
  };

  const handleFileChange = (fieldName, file) => {
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleSubmit = async (values) => {
    if (!user?._id) {
      toast.error("Please log in to submit KYC");
      return;
    }

    const requiredFiles = REQUIRED_FILES_BY_DOC_TYPE[values.documentType] || [];
    const missingFiles = requiredFiles.filter(
      (f) => !files[f.name] || !files[f.name].name
    );
    if (missingFiles.length > 0) {
      toast.error(`Please upload: ${missingFiles.map((f) => f.label).join(", ")}`);
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("documentType", values.documentType);
    formData.append("fullName", values.fullName);
    formData.append(
      "dateOfBirth",
      values.dateOfBirth ? normalizeDateToYYYYMMDD(String(values.dateOfBirth)) : ""
    );
    formData.append("idNumber", values.idNumber);

    requiredFiles.forEach((f) => {
      if (files[f.name]) formData.append(f.name, files[f.name]);
    });

    setSubmitting(true);
    try {
      const result = await submitKyc(formData);
      if (result?.status === "success") {
        toast.success("KYC submitted successfully");
        navigate("/profile");
      }
    } finally {
      setSubmitting(false);
    }
  };

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
            <p>
              Upload your identity documents to verify your account. Select your
              document type and upload the required files.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue }) => (
              <Form className="kyc-verify-form">
                <div className="form-group">
                  <label>Document Type</label>
                  <Field
                    as="select"
                    name="documentType"
                    onChange={(e) => {
                      setFieldValue("documentType", e.target.value);
                      setFiles({});
                    }}
                  >
                    {DOCUMENT_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="documentType" component="div" className="error" />
                </div>

                <div className="form-group">
                  <Field
                    type="text"
                    name="fullName"
                    placeholder="Full Name (as on document)"
                  />
                  <ErrorMessage name="fullName" component="div" className="error" />
                </div>

                <div className="form-group">
                  <Field type="date" name="dateOfBirth" placeholder="Date of Birth" />
                  <ErrorMessage name="dateOfBirth" component="div" className="error" />
                </div>

                <div className="form-group">
                  <Field
                    type="text"
                    name="idNumber"
                    placeholder={
                      values.documentType === "pan"
                        ? "PAN Number"
                        : values.documentType === "aadhaar"
                          ? "Aadhaar Number"
                          : "ID Number"
                    }
                  />
                  <ErrorMessage name="idNumber" component="div" className="error" />
                </div>

                <div className="kyc-file-uploads">
                  {(REQUIRED_FILES_BY_DOC_TYPE[values.documentType] || []).map(
                    (f) => (
                      <div key={f.name} className="form-group file-group">
                        <label>{f.label}</label>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,application/pdf"
                          onChange={(e) =>
                            handleFileChange(f.name, e.target.files?.[0])
                          }
                        />
                        {files[f.name]?.name && (
                          <span className="file-name">{files[f.name].name}</span>
                        )}
                      </div>
                    )
                  )}
                </div>

                <button
                  type="submit"
                  className="kyc-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit KYC"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default KycVerify;
