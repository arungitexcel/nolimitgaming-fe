// api/ClientFunction.jsx
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_API_URL, CLIENT_URL, KYC_API_URL } from "./constant";
import { encryptData } from "../utils/Encrypt";
import { decryptData } from "../utils/Decrypt";

export const baseURL = BASE_API_URL;
if (!baseURL) {
  console.log(
    "> BaseURL error, please check your env file or visit api/ClientFunction.jsx file to see more details..., Thanks!..."
  );
}

const api = axios.create({
  baseURL: baseURL,
});
// Skip ngrok browser warning when backend is behind ngrok
api.interceptors.request.use((config) => {
  if (baseURL && baseURL.includes("ngrok")) {
    config.headers["ngrok-skip-browser-warning"] = "true";
  }
  return config;
});

const handleRequest = async (method, url, data = null, customHeaders = {}) => {
  const token = localStorage.getItem("token");
  const requestData = data ? encryptData(data) : null;

  try {
    const response = await api({
      method,
      url,
      data: requestData,
      headers: {
        ...customHeaders,
        Authorization: `Bearer ${token}`,
      },
    });

    const decryptedData = decryptData(response?.data?.data);
    return decryptedData;
  } catch (error) {
    const errorData =
      error?.response?.data?.data
        ? decryptData(error?.response?.data?.data)
        : {
            message:
              error?.response?.data?.message ||
              error?.response?.data?.error ||
              "Something went wrong",
          };

    if (
      errorData?.message === "Login Error" ||
      errorData?.message === "User Not Persent in DataBase"
    ) {
      window.location.href = CLIENT_URL; // Consider using useNavigate() if in React
    }

    if (errorData?.message === "No Match Found") {
      return errorData;
    }

    const isGeofenceError =
      errorData?.message === "Access not allowed from your location";

    if (!errorData?.success && errorData?.message && !isGeofenceError) {
      toast.error(
        typeof errorData.message === "string"
          ? errorData.message
          : "Something went wrong in API calling"
      );
    }

    return errorData;
  }
};

// Normal Resquest
const handleNormalRequest = async (
  method,
  url,
  data = null,
  customHeaders = {}
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api({
      method,
      url,
      data,
      headers: {
        ...customHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
    const decryptedData = decryptData(response?.data?.data);
    return decryptedData;
  } catch (error) {
    const decryptedData = error?.response?.data?.data
      ? decryptData(error.response.data.data)
      : {
          success: false,
          message:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Something went wrong",
        };
    console.log(decryptedData);
    if (
      decryptedData?.message === "Login Error" ||
      decryptedData?.message === "User Not Persent in DataBase" ||
      decryptedData?.message === "Invalid UserId" ||
      decryptedData?.message === "Token Not persent In headers"
    ) {
      window.location.href = CLIENT_URL;
      return;
    }
    if (
      decryptedData?.message?.endsWith("already registered.") ||
      decryptedData?.message?.endsWith("already taken.") ||
      decryptedData?.message?.endsWith("Invalid Invite Code.") ||
      decryptedData?.message?.endsWith("Setting Not Found") ||
      decryptedData?.message === "No Match Found"
    ) {
      return decryptedData;
    }
    if (decryptedData.success === false && decryptedData.message) {
      toast.error(
        decryptedData?.message || "Something Went Wrong In Api Calling"
      );
    }
    return decryptedData;
  }
};

// API functions
export const fetchData = (url) => handleRequest("get", url);
export const postData = (url, data) => handleRequest("post", url, data);
export const postNormalData = (url, data) =>
  handleNormalRequest("post", url, data);
export const updateData = (url, data) => handleRequest("put", url, data);
export const deleteData = (url, data) => handleRequest("delete", url, data);
export const requestData = (method, url, data) =>
  handleRequest(method, url, data);

// KYC API (nolimitgamingKYC - no encryption)
const kycApi = axios.create({
  baseURL: KYC_API_URL,
});

export const fetchKycStatus = async (userId) => {
  try {
    const response = await kycApi.get("/kyc/status", {
      params: { userId },
    });
    return response?.data?.data ?? null;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    toast.error(error?.response?.data?.message || "Failed to fetch KYC status");
    return null;
  }
};

export const submitKyc = async (formData) => {
  try {
    const response = await kycApi.post("/kyc/submit", formData);
    return response?.data ?? null;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to submit KYC";
    toast.error(msg);
    return null;
  }
};

// Utility functions
export function generateTransactionId(phoneNumber) {
  phoneNumber = String(phoneNumber);
  const seed = Date.now();
  const combinedString = phoneNumber + seed;
  const hashCode = combinedString.split("").reduce((hash, char) => {
    const charCode = char.charCodeAt(0);
    return (hash << 5) - hash + charCode;
  }, 0);

  const positiveHashCode = Math.abs(hashCode) % 100000000;

  const transactionId = positiveHashCode.toString().padStart(8, "0");

  return transactionId;
}

export function formatTime(dateString) {
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedTime = new Date(dateString).toLocaleTimeString([], options);
  return formattedTime;
}

export function generateRandomEmail() {
  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "example.com",
    "domain.com",
  ];
  const usernameLength = Math.floor(Math.random() * 10) + 5; // Random length between 5 and 14
  const username = Array.from({ length: usernameLength }, () =>
    getRandomChar()
  ).join("");
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
}

function getRandomChar() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return chars[Math.floor(Math.random() * chars.length)];
}

export function validateEmail(email) {
  const validTLDs = [
    ".cc",
    ".com",
    ".org",
    ".net",
    ".edu",
    ".gov",
    ".mil",
    ".co.uk",
    ".de",
    ".jp",
    ".fr",
    ".au",
    ".us",
    ".ru",
    ".ch",
    ".it",
    ".nl",
    ".se",
    ".no",
    ".es",
    ".ca",
    ".eu",
    ".nz",
    ".in",
    ".cn",
    ".br",
    ".za",
    ".ar",
    ".mx",
    ".asia",
    ".biz",
    ".info",
    ".mobi",
    ".name",
    ".online",
    ".pro",
    ".site",
    ".tech",
    ".website",
    ".xyz",
    ".club",
    ".email",
    ".store",
    ".shop",
    ".blog",
    ".io",
    ".me",
    ".app",
  ];

  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (regex.test(email)) {
    const domain = email.substring(email.lastIndexOf("."));
    return validTLDs.includes(domain);
  }
  return false;
}

export const formatSeconds = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return [
    Math.floor(minutes / 10),
    minutes % 10,
    Math.floor(seconds / 10),
    seconds % 10,
  ];
};

export function getMappedValue(input) {
  switch (input) {
    case "l":
      return "Big";
    case "n":
      return "Small";
    case "t":
      return "Violet";
    case "d":
      return "Red";
    case "x":
      return "Green";
    default:
      return input;
  }
}

export const formatDateToUTC = (isoString) => {
  if (!isoString) {
    return "No Date Found";
  }
  // console.log(isoString);
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Use 12-hour format with AM/PM
    timeZone: "Asia/Kolkata", // IST timezone
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate.replace(/, /g, ", ");
};

export const formatDateToRelative = (isoString) => {
  const inputDate = new Date(isoString);
  const currentDate = new Date();
  const timeDifference = inputDate - currentDate;
  const differenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // console.log(differenceInDays);

  if (differenceInDays === 0) {
    return "Today";
  } else if (differenceInDays > 0) {
    return `${differenceInDays} days after today`;
  } else if (differenceInDays === -1) {
    return "Yesterday";
  } else if (differenceInDays < -1) {
    return `${-differenceInDays} days ago`;
  } else {
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
      timeZone: "IST",
    };
    return new Intl.DateTimeFormat("en-US", options)
      .format(inputDate)
      .replace(/, /g, "/");
  }
};

export const formatDateToIST = (date) => {
  // Convert to IST by adding 5 hours and 30 minutes
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const istDate = new Date(date.getTime() + istOffset);

  // Extract day, month, and year
  const day = String(istDate.getUTCDate()).padStart(2, "0");
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = istDate.getUTCFullYear();

  // Return the formatted date
  return `${day}/${month}/${year}`;
};

export const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-blue-100  text-blue-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Success":
      return "bg-green-100 text-green-800";
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Deposit":
      return "bg-green-100 text-green-800";
    default:
      return "";
  }
};

export const handleCopy = (text) => {
  if (!text) {
    toast.error("Nothing to copy!");
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Modern method
    navigator.clipboard.writeText(text).then(
      () => toast.success("Copied to clipboard!"),
      (err) => {
        toast.error("Failed to copy!");
        console.error("Clipboard copy failed:", err);
      }
    );
  } else {
    // Fallback for unsupported browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy!");
      console.error("Clipboard copy failed:", err);
    }
    document.body.removeChild(textArea);
  }
};

export const statusFilter = (status) => {
  let color = "";
  console.log(status);

  switch (status) {
    case "Pending":
      color = "Yellow";
      break;
    case "Success":
      color = "green";
      break;
    case "Rejected":
      color = "red";
      break;
    default:
      color = "gray";
  }

  return <span style={{ color, fontWeight: "bold" }}>{status}</span>;
};

// Function to get the sport name based on the ID
export const getSportName = (sportId) => {
  const sportsOptions = [
    { label: "Cricket", value: "sr:sport:21" },
    { label: "Football", value: "sr:sport:1" },
    { label: "Tennis", value: "sr:sport:5" },
    { label: "NBA", value: "sr:sport:2" },
    { label: "Badminton", value: "sr:sport:31" },
    { label: "Table Tennis", value: "sr:sport:20" },
    { label: "NFL", value: "sr:sport:16" },
    { label: "MMA", value: "sr:sport:117" },
    { label: "Kabaddi", value: "sr:sport:138" },
    { label: "Snooker", value: "sr:sport:19" },
    { label: "Rugby", value: "sr:sport:12" },
    { label: "Baseball", value: "sr:sport:3" },
    { label: "Volleyball", value: "sr:sport:23" },
    { label: "NHL", value: "sr:sport:4" },
    { label: "Darts", value: "sr:sport:22" },
    { label: "Futsal", value: "sr:sport:29" },
  ];

  // Find the matching sport name
  const sport = sportsOptions.find((option) => option.value === sportId);
  return sport ? sport.label : "Unknown Sport";
};
