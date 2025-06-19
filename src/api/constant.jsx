let BASE_API_URL, CLIENT_URL;

if (import.meta.env.VITE_DEV == "true") {
  // npm run dev command
  BASE_API_URL = import.meta.env.VITE_API_URL_DEV;
  CLIENT_URL = import.meta.env.VITE_DEV_CLIENT_URL;
} else if (import.meta.env.MODE == "production") {
  // for npm run build command
  BASE_API_URL = import.meta.env.VITE_API_URL_PROD;
  CLIENT_URL = import.meta.env.VITE_PROD_CLIENT_URL;
} else if (import.meta.env.VITE_DEV == "false") {
  // for npm run prod command
  BASE_API_URL = import.meta.env.VITE_API_URL_PROD;
  CLIENT_URL = import.meta.env.VITE_DEV_CLIENT_URL;
}

export { BASE_API_URL, CLIENT_URL };
