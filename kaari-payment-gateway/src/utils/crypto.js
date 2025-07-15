const CryptoJS = require('crypto-js');

/**
 * Decrypt data from Payzone callback using AES
 * @param {string} encryptedData - Base64 encoded encrypted data
 * @param {string} merchantToken - Merchant token used as encryption key
 * @returns {Object} - Decrypted data as JSON object
 */
const decryptPayzoneCallback = (encryptedData, merchantToken) => {
  if (!encryptedData || !merchantToken) {
    throw new Error('Encrypted data and merchant token are required');
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, merchantToken);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  } catch (error) {
    throw new Error(`Failed to decrypt Payzone callback: ${error.message}`);
  }
};

/**
 * Encrypt data for Payzone using AES
 * @param {Object} data - Data to encrypt
 * @param {string} merchantToken - Merchant token used as encryption key
 * @returns {string} - Base64 encoded encrypted data
 */
const encryptPayzoneData = (data, merchantToken) => {
  if (!data || !merchantToken) {
    throw new Error('Data and merchant token are required');
  }

  try {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, merchantToken);
    return encrypted.toString();
  } catch (error) {
    throw new Error(`Failed to encrypt data for Payzone: ${error.message}`);
  }
};

module.exports = {
  decryptPayzoneCallback,
  encryptPayzoneData
}; 