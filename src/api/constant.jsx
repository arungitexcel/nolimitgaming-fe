let BASE_API_URL, CLIENT_URL, KYC_API_URL;

if (import.meta.env.VITE_DEV == "true") {
  // npm run dev command
  BASE_API_URL = import.meta.env.VITE_API_URL_DEV;
  console.log("BASE_API_URL", BASE_API_URL);
  CLIENT_URL = import.meta.env.VITE_DEV_CLIENT_URL;
  KYC_API_URL = import.meta.env.VITE_KYC_API_URL || "http://localhost:3019";
} else if (import.meta.env.MODE == "production") {
  // for npm run build command
  BASE_API_URL = import.meta.env.VITE_API_URL_PROD;
  CLIENT_URL = import.meta.env.VITE_PROD_CLIENT_URL;
  KYC_API_URL = import.meta.env.VITE_KYC_API_URL || "http://localhost:3019";
} else if (import.meta.env.VITE_DEV == "false") {
  // for npm run prod command
  BASE_API_URL = import.meta.env.VITE_API_URL_PROD;
  CLIENT_URL = import.meta.env.VITE_DEV_CLIENT_URL;
  KYC_API_URL = import.meta.env.VITE_KYC_API_URL || "http://localhost:3019";
}

export { BASE_API_URL, CLIENT_URL, KYC_API_URL };
