import CryptoJS from "crypto-js";
const SecretKey = import.meta.env.VITE_SECRET_KEY;

export const decryptData = (encryptedData, secretKey = SecretKey) => {
  if (!secretKey) {
    console.error("Decryption failed: Secret key is missing.");
    return null;
  }
  const key = CryptoJS.enc.Hex.parse(secretKey);

  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedData) {
      console.error("Decryption failed: Unable to decrypt the data.");
      return null;
    }
    let parsedData;
    try {
      parsedData = JSON.parse(decryptedData);
    } catch (e) {
      parsedData = decryptedData;
    }

    return parsedData;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
