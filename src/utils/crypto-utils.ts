export const encrypt = async (
  data: Uint8Array,
  password: string,
  salt: Uint8Array
) => {
  // Convert password to Uint8Array
  const passwordUint = new TextEncoder().encode(password);

  // Import base key
  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordUint,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // Derive encryption key
  const cryptoKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.slice(0, 16),
      iterations: 10000,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-CTR",
      length: 128,
    },
    false,
    ["encrypt"]
  );

  // Encrypt data
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-CTR",
      counter: new Uint8Array(16),
      length: 128,
    },
    cryptoKey,
    data
  );

  return new Uint8Array(encryptedData);
};

export const decrypt = async (
  encryptedData: Uint8Array,
  password: string,
  salt: Uint8Array
) => {
  // Similar to encrypt, but using decrypt instead
  const passwordUint = new TextEncoder().encode(password);

  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordUint,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const cryptoKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.slice(0, 16),
      iterations: 10000,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-CTR",
      length: 128,
    },
    false,
    ["decrypt"]
  );

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-CTR",
      counter: new Uint8Array(16),
      length: 128,
    },
    cryptoKey,
    encryptedData
  );

  return new Uint8Array(decryptedData);
};
