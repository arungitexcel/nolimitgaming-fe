import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
// import { postData } from "../../../api/ClientFunction";
import "./OTPVerification.css";

import Swal from "sweetalert2";
import { postData } from "../../api/ClientFunction";

const OTPVerification = ({ showOtp, handleClose, signupdata }) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(90);
  const [resendDisabled, setResendDisabled] = useState(true);

  const initialValues = {
    otp: "",
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .required("Please enter the OTP sent to your phone/email")
      .length(6, "OTP must be 6 digits"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    handleClose();
    const response = await postData("/user/verifyregisterotp", {
      otp: values.otp,
      ...signupdata,
    });

    console.log(response);
    if (response?.status || response?.success) {
      localStorage.setItem("token", response?.token);
      Swal.fire("Wow", response?.message, "success").then(() => {
        window.location.href = "/";
      });
    }

    setSubmitting(false);
  };

  const handleResendOtp = async () => {
    setTimer(90);
    setResendDisabled(true);
    const response = await postData("/user/resendotp", {
      phone: signupdata.phone,
    });
    if (response?.status || response?.success) {
      Swal.fire("Wow", response?.message, "success");
    }
    setResendDisabled(false);
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!showOtp) return null;

  return (
    <div className="otp-verification-container">
      <div className="otp-box">
        <h2>
          Account Verification <span></span>
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="otp-form">
              <div className="form-group">
                <Field
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  className="form-input"
                />
                <ErrorMessage name="otp" component="p" className="error" />
              </div>
              <div className="timer-section">
                {timer > 0 ? (
                  <p className="timer-text">Resend OTP in {timer}s</p>
                ) : (
                  <button
                    className="resend-button"
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
              <button
                className="form-submit"
                type="submit"
                disabled={isSubmitting}
              >
                Verify OTP
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default OTPVerification;
