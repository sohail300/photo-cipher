import JSZip from "jszip";

export const hideFilesInImage = async ({
  image,
  files,
  compression,
  password,
  onProgress,
}: {
  image: { contents: ArrayBuffer; type: string };
  files: { name: string; contents: ArrayBuffer; date?: Date }[];
  compression: number;
  password: string;
  onProgress?: (progress: number) => void; // Callback for progress updates
}) => {
  const zip = new JSZip();

  // Add files to ZIP archive
  files.forEach((file) => {
    zip.file(file.name, file.contents, { date: file.date });
  });

  const imageUint = new Uint8Array(image.contents);

  // Generate ZIP file
  const zipUint = await zip.generateAsync(
    {
      type: "uint8array",
      compression: compression === 0 ? "STORE" : "DEFLATE",
      compressionOptions: { level: compression },
    },
    ({ percent }) => {
      if (onProgress) onProgress(percent); // Report progress via callback
    }
  );

  // Encrypt ZIP with the image and password
  const zipEncryptedUint = await encryptZip(zipUint, imageUint, password);
  const resultUint = new Uint8Array([...imageUint, ...zipEncryptedUint]);

  // Return the result as a Blob
  return new Blob([resultUint], { type: image.type });
};

const encryptZip = async (
  zipUint: Uint8Array,
  imageUint: Uint8Array,
  password: string
) => {
  const passwordUint = new TextEncoder().encode(password);
  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordUint,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
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
    ["encrypt"]
  );

  const zipEncrypted = await crypto.subtle.encrypt(
    {
      name: "AES-CTR",
      counter: new Uint8Array(16),
      length: 128,
    },
    cryptoKey,
    zipUint.buffer
  );

  return new Uint8Array(zipEncrypted);
};
