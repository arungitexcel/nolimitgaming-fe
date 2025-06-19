import CryptoJS from "crypto-js";

const SecretKey = import.meta.env.VITE_SECRET_KEY;
console.log(SecretKey);

export const encryptData = (data, secretKey = SecretKey) => {
  console.log(data);
  if (!secretKey) {
    console.error("Encryption failed: Secret key is missing.");
    return null;
  }
  const key = CryptoJS.enc.Hex.parse(secretKey);
  const dataToEncrypt = typeof data === "string" ? data : JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return { data: encrypted };
};
