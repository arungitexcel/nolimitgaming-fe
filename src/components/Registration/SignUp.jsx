import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import "./SignUp.css";
import authbg from "../../assets/authbg.jpeg";
import { RxCross2 } from "react-icons/rx";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import { IoLogoGoogle } from "react-icons/io5";
import { FaTelegramPlane } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { postData } from "../../api/ClientFunction";
import Swal from "sweetalert2";

const SignUp = ({ handlePopup, handleClose, handleOpenLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [timer, setTimer] = useState(90);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otp, setOtp] = useState("");
  const [signupData, setSignupData] = useState(null);

  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "First Name must only contain letters")
      .max(50, "First Name must not exceed 50 characters")
      .required("First Name is required"),
    lastname: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Last Name must only contain letters")
      .max(50, "Last Name must not exceed 50 characters")
      .required("Last Name is required"),
    dob: Yup.date()
      .max(new Date(), "Date of Birth cannot be in the future")
      .required("Date of Birth is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits")
      .required("Phone Number is required"),
    homeaddress: Yup.string()
      .max(255, "Home Address must not exceed 255 characters")
      .required("Home Address is required"),
    city: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "City must only contain letters")
      .max(100, "City must not exceed 100 characters")
      .required("City is required"),
    country: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "City must only contain letters")
      .max(100, "City must not exceed 100 characters")
      .required("Country is required"),
    zipcode: Yup.string()
      .matches(/^[0-9]{6}$/, "Postal Code must be 6 digits")
      .required("Postal Code is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must not exceed 50 characters")
      // .matches(
      //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      //   "Password must include uppercase, lowercase, number, and special character"
      // )
      .required("Password is required"),
    inviteCode: Yup.string()
      .matches(
        /^[A-Za-z0-9]*$/,
        "Referral Code must contain only letters and numbers"
      )
      .max(20, "Referral Code must not exceed 20 characters"),
    promoCode: Yup.string()
      .matches(
        /^[A-Za-z0-9]*$/,
        "Promo Code must contain only letters and numbers"
      )
      .max(30, "Promo Code must not exceed 30 characters"),
    agreement: Yup.boolean()
      .oneOf([true], "You must agree to the User Agreement")
      .required("User Agreement must be accepted"),
  });

  const initialValues = {
    firstname: "",
    lastname: "",
    dob: "",
    phone: "",
    email: "",
    password: "",
    countryCode: "",
    homeaddress: "",
    secondaryaddress: "",
    city: "",
    country: "",
    zipcode: "",
    inviteCode: "",
    promoCode: "",
    agreement: false,
  };

  const handleSubmit = async (values) => {
    const phoneWithoutCountryCode = values.phone.startsWith(values.countryCode)
      ? values.phone.slice(values.countryCode.length)
      : values.phone;
    const { agreement, ...filteredValues } = values;

    const payload = {
      ...filteredValues,
      phone: phoneWithoutCountryCode,
    };
    setSignupData(payload);
    const response = await postData("/user/register", payload);
    console.log(response);

    if (response?.success) {
      Swal.fire("Wow", response?.message, "success");
      setIsOtpModalVisible(true);
      startTimer();
    }
  };

  const handleOtpVerification = async () => {
    const response = await postData("/user/verifyregisterotp", {
      otp,
      ...signupData,
    });

    if (response?.status || response?.success) {
      localStorage.setItem("token", response?.token);
      Swal.fire("Wow", response?.message, "success").then(() => {
        setIsOtpModalVisible(false);
        window.location.href = "/";
      });
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    const response = await postData("/user/register", signupData);
    if (response?.status || response?.success) {
      Swal.fire("Wow", response?.message, "success");
    }
    setResendDisabled(false);
  };

  const startTimer = () => {
    setTimer(90);
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

  const handleSigninPopup = () => {
    if (handleOpenLogin) {
      handleOpenLogin();
    } else {
      navigate("/signin");
    }
  };

  return (
    <>
      {!isOtpModalVisible && (
        <>
          <div className="signup-overlay">
            <div className="signup-container">
              <div className="signup-section-second">
                <div className="signup-header">
                  <h2 style={{ fontWeight: "700" }}>
                    Sign Up
                    <span className="cancel-icon" onClick={() => navigate("/")}>
                      <RxCross2 />
                    </span>
                  </h2>
                  <p style={{ fontSize: ".9rem", paddingTop: "10px" }}>
                    Please select your country of residence to continue creating
                    your account, and enter the email address and password you
                    would like to use to log in.
                  </p>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, setFieldValue }) => (
                    <Form className="signup-form">
                      {/* First Name */}
                      <div className="form-group">
                        <Field
                          type="text"
                          name="firstname"
                          placeholder="First Name"
                        />
                        <ErrorMessage
                          name="firstname"
                          component="div"
                          className="error"
                        />
                      </div>
                      {/* Last Name */}
                      <div className="form-group">
                        <Field
                          type="text"
                          name="lastname"
                          placeholder="Last Name"
                        />
                        <ErrorMessage
                          name="lastname"
                          component="div"
                          className="error"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div className="form-group">
                        <Field
                          type="date"
                          name="dob"
                          placeholder="Date of Birth"
                        />
                        <ErrorMessage
                          name="dob"
                          component="div"
                          className="error"
                        />
                      </div>
                      {/* Phone Number with Country Code */}
                      <div className="form-group">
                        <div className="form-group">
                          <PhoneInput
                            country={"in"}
                            value=""
                            onChange={(value, { dialCode }) => {
                              setFieldValue("countryCode", `+${dialCode}`);
                              setFieldValue(
                                "phone",
                                value.replace(dialCode, "")
                              );
                            }}
                            inputProps={{
                              name: "phone",
                              required: true,
                              enableSearch: true,
                              autoFocus: true,
                            }}
                          />
                          <ErrorMessage
                            name="phone"
                            component="div"
                            className="error"
                          />
                        </div>
                      </div>
                      {/* Email */}
                      <div className="form-group">
                        <Field
                          type="text"
                          name="email"
                          placeholder="Enter your email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error"
                        />
                      </div>
                      {/* Password */}
                      <div className="form-group">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                          />
                          <div
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                          </div>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="error"
                        />
                      </div>

                      <div className="legal_docs_container">
                        {/* Home Address */}
                        <div className="form-group">
                          <Field
                            type="text"
                            name="homeaddress"
                            placeholder="Home Address"
                          />
                          <ErrorMessage
                            name="homeaddress"
                            component="div"
                            className="error"
                          />
                        </div>

                        {/* Second Address */}
                        <div className="form-group">
                          <Field
                            type="text"
                            name="secondaryaddress"
                            placeholder="Second Address (Optional)"
                          />
                          <ErrorMessage
                            name="secondaryaddress"
                            component="div"
                            className="error"
                          />
                        </div>

                        {/* City */}
                        <div className="form-group">
                          <Field type="text" name="city" placeholder="City" />
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="error"
                          />
                        </div>
                        {/* Country */}
                        <div className="form-group">
                          <Field
                            type="text"
                            name="country"
                            placeholder="Country"
                          />
                          <ErrorMessage
                            name="country"
                            component="div"
                            className="error"
                          />
                        </div>

                        {/* Postal Code */}
                        <div className="form-group">
                          <Field
                            type="text"
                            name="zipcode"
                            placeholder="Zip Code"
                          />
                          <ErrorMessage
                            name="zipcode"
                            component="div"
                            className="error"
                          />
                        </div>
                        {/* Referral Code */}
                        <div className="form-group">
                          <Field
                            type="text"
                            name="inviteCode"
                            placeholder="Enter Invite Code (Optional)"
                          />
                        </div>
                        <div className="form-group">
                          <Field
                            type="text"
                            name="promoCode"
                            placeholder="Enter Promo Code (Optional)"
                          />
                          <ErrorMessage
                            name="promoCode"
                            component="div"
                            className="error"
                          />
                        </div>
                      </div>

                      {/* Referral Code */}
                      {/* <div className="form-group referral-toggle">
                        <p onClick={() => setShowReferral(!showReferral)}>
                          Enter Referral/Promo Code
                          {showReferral ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </p>
                        {showReferral && (
                          <Field
                            type="text"
                            name="inviteCode"
                            placeholder="Enter Referral/Promo Code"
                          />
                        )}
                      </div> */}

                      <div className="form-groups agreement">
                        <div className="agreement-box">
                          <Field
                            type="checkbox"
                            name="agreement"
                            className="check-btn"
                          />
                          <p>
                            By clicking the button above, I confirm that: - I am
                            at least 18 years of age (or the legal age
                            applicable for my jurisdiction) and have read and
                            agreed to NoLimitGaming.Bet Terms and Conditions and
                            Betting Rules. - I have read and agree to
                            NoLimitGaming.Bet Privacy Policy.
                          </p>
                        </div>
                        <ErrorMessage
                          name="agreement"
                          component="div"
                          className="error"
                        />
                      </div>
                      {/* <div className="form-groups agreement">
                        <div className="agreement-box">
                          <Field
                            type="checkbox"
                            name="agreement"
                            className="check-btn"
                          />
                          <p>
                            I agree to receive marketing promotions from
                            NoLimitingGaming.bet
                          </p>
                        </div>
                        <ErrorMessage
                          name="agreement"
                          component="div"
                          className="error"
                        />
                      </div> */}
                      <button type="submit" className="signup-btn">
                        Sign Up
                      </button>
                    </Form>
                  )}
                </Formik>

                <p className="already-account">
                  Already have an account?{" "}
                  <span onClick={handleSigninPopup}>Sign In</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {isOtpModalVisible && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h2>
              OTP Verification{" "}
              <span onClick={() => setIsOtpModalVisible(false)}>
                <MdOutlineCancel />
              </span>
            </h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
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
            <button onClick={handleOtpVerification}>Verify OTP</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
