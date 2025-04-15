import CryptoJS from "crypto-js";

// Encrypt data before storing in LocalStorage
export const localStorageSetter = (label, jsonData) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(jsonData),
      label
    ).toString();
    localStorage.setItem(label, encryptedData);
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};

// Decrypt data when retrieving from LocalStorage
export const localStorageGetter = (label) => {
  const encryptedData = localStorage.getItem(label);
  if (!encryptedData) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, label);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (err) {
    console.log("Error decrypting data:", err);
    return null;
  }
};

// Clear all data from LocalStorage
export const clearLocalStorage = () => localStorage.clear();
