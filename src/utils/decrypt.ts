import JSZip from "jszip";

const decryptZip = async (
  zipUint: Uint8Array,
  imageUint: Uint8Array,
  password: string
): Promise<Uint8Array> => {
  const passwordUint = new TextEncoder().encode(password);

  // Derive key from the password
  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordUint,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const cryptoKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: imageUint.slice(0, 16),
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

  // Decrypt the ZIP file
  const zipDecrypted = await crypto.subtle.decrypt(
    {
      name: "AES-CTR",
      counter: new Uint8Array(16),
      length: 128,
    },
    cryptoKey,
    zipUint.buffer
  );

  return new Uint8Array(zipDecrypted);
};

/**
 * Extracts and decrypts files hidden inside an image.
 * @param {Blob} image - The steganographic image containing hidden files.
 * @param {string} password - The password used to decrypt the hidden files.
 * @returns {Promise<Blob>} - A Blob containing the decrypted ZIP file.
 */
export const findFilesInImage = async (
  image: Blob,
  password: string
): Promise<Blob> => {
  const arrayBuffer = await image.arrayBuffer();
  const imageUint = new Uint8Array(arrayBuffer);

  // Detect the file type of the image
  const type = image.type;
  const marker = {
    "image/png": [174, 66, 96, 130],
    "image/jpeg": [255, 217],
    "image/gif": [59],
  }[type];

  if (!marker) {
    throw new Error(
      "Unsupported image type for steganographic data extraction."
    );
  }

  // Locate the ZIP marker in the image data
  const indexOfZip =
    imageUint.findIndex(
      (_, index) =>
        imageUint.slice(index, index + marker.length).toString() ===
        marker.toString()
    ) + marker.length;

  if (indexOfZip < marker.length) {
    throw new Error("No hidden ZIP file found in the image.");
  }

  // Extract and decrypt the ZIP data
  const zipEncryptedUint = imageUint.slice(indexOfZip);
  const zipUint = await decryptZip(zipEncryptedUint, imageUint, password);

  // Return the decrypted ZIP as a Blob
  return new Blob([zipUint], { type: "application/zip" });
};
