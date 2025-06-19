import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./SignIn.css";
import authbg from "../../assets/authbg.jpeg";
import { RxCross2 } from "react-icons/rx";
import { FaEyeSlash, FaEye, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { postData } from "../../api/ClientFunction";

const SignIn = ({
  handlePopup,
  handleClose,
  handlePopClose,
  handleOpenSignup,
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpVerification, setOtpVerification] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [timer, setTimer] = useState(20);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$|^\d{10,15}$/,
        "Please enter a valid email or phone number"
      )
      .required("Email/Phone Number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handelOnSubmit = async (values, { resetForm }) => {
    const response = await postData("/user/login", values);

    if (response?.status || response?.success) {
      localStorage.setItem("token", response?.token);
      Swal.fire("Wow", response?.message, "success").then(() => {
        window.location.href = "/";
      });
    }
    resetForm();
    // handleClose();
  };

  const handleForgotPassword = async (values) => {
    console.log("Forgot Password for:", values.email);
    const response = await postData("/user/forgototp", values);
    console.log("frg:", response);
    if (response?.status || response?.success) {
      Swal.fire("Success", response?.message, "success").then(() => {
        // setUserData({ email, phone, username });
        setUserData({
          email: values.email,
        });
        setOtpVerification(true);
        setForgotPassword(false);
        startTimer();
      });
    }
  };

  const handleVerifyOtp = async ({ otp, password }) => {
    console.log("OTP Verified:", { otp, password });
    const res = await postData("/user/changepassword", {
      ...userData,
      otp,
      password,
    });
    console.log("reset response", res);
    if (res?.status || res?.success) {
      Swal.fire("Success", res?.message, "Password Changed Successfully").then(
        () => {
          setOtpVerification(false);
          handleClose();
          navigate("/");
        }
      );
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    const response = await postData("/user/forgototp", {
      email: userData.email,
    });
    if (response?.status || response?.success) {
      Swal.fire("Wow", response?.message, "success");
    }
    setResendDisabled(false);
    // console.log("Resending OTP...");
  };

  const startTimer = () => {
    setTimer(20);
    setResendDisabled(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClosePopup = () => {
    if (handlePopClose) {
      handlePopClose();
    }
    else{
      handleClose();
    }
  };
  
  const handleSignupPopup = ()=>{
    if(handleOpenSignup){

    }
  }

  const handleBackSignIn = () => {
    setForgotPassword(false);
  };
  const handleBackForgo = () => {
    setOtpVerification(false);
  };

  return (
    <div className="SignIn-overlay">
      <div className="SignIn-container">
        <div className="SignIn-section-first">
          <img src={authbg} alt="Background" className="auth-bg1" />
          <div className="ads-details">
            <h1>Stay Untamed</h1>
            <p>Sign Up & Get Welcome Bonus</p>
          </div>
        </div>

        <div className="SignIn-section-second">
          {!forgotPassword && !otpVerification && (
            <>
              <div className="SignIn-header">
                <h2 style={{ fontWeight: "700" }}>Sign In</h2>
                <span className="cancel-icon" onClick={handleClosePopup}>
                  <RxCross2 />
                </span>
              </div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handelOnSubmit}
              >
                {({ values }) => (
                  <Form className="SignIn-form">
                    <div className="form-group">
                      <Field
                        type="text"
                        name="email"
                        placeholder="Email/Phone Number"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="form-group">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                      />
                      <div
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEye className="pass-icon" />
                        ) : (
                          <FaEyeSlash className="pass-icon" />
                        )}
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="error"
                      />
                    </div>
                    <p
                      className="forgot-password"
                      onClick={() => setForgotPassword(true)}
                    >
                      Forgot your Password?
                    </p>
                    <button type="submit" className="SignIn-btn">
                      Sign In
                    </button>
                    <p
                      className="sigin-creat-account"
                      onClick={() => navigate("/signup")}
                    >
                      Get Your Account? <span>Signup</span>
                    </p>
                  </Form>
                )}
              </Formik>
            </>
          )}

          {forgotPassword && (
            <div className="ForgotPassword">
              <h4>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleBackSignIn()}
                >
                  <FaArrowLeft />
                </span>
                Forgot Password
              </h4>
              <Formik
                initialValues={{ email: "" }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().required(
                    "Email/Phone Number is required"
                  ),
                })}
                onSubmit={handleForgotPassword}
              >
                {() => (
                  <Form>
                    <Field
                      type="text"
                      name="email"
                      placeholder="Email/Phone Number"
                      className="forgo-pass-input-field"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error"
                    />
                    <button type="submit" className="fogo-btn">
                      Send OTP
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          )}

          {otpVerification && (
            <div className="OtpVerification">
              <h3>
                <span onClick={() => handleBackForgo()}>
                  <FaArrowLeft />
                </span>
                Verify OTP
              </h3>
              <Formik
                initialValues={{ otp: "", password: "" }}
                validationSchema={Yup.object().shape({
                  otp: Yup.string()
                    .length(6, "OTP must be 6 digits")
                    .required("OTP is required"),
                  password: Yup.string()
                    .min(6, "Password must be at least 6 characters")
                    .required("Password is required"),
                })}
                onSubmit={handleVerifyOtp}
              >
                {() => (
                  <Form>
                    <Field
                      className="forgo-pass-input-field"
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="error"
                    />
                    <Field
                      className="forgo-pass-input-field"
                      type="text"
                      name="password"
                      placeholder="Enter new password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error"
                    />
                    <div className="timer-section">
                      {timer > 0 ? (
                        <p className="timer-text">Resend OTP in {timer}s</p>
                      ) : (
                        <button
                          className="fogo-btn"
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resendDisabled}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="fogo-btn"
                      onClick={handleVerifyOtp}
                    >
                      Reset Password
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
