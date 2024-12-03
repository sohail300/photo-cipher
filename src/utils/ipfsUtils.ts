export const getFileFromIPFS = async (hash: string): Promise<Blob> => {
  try {
    const gatewayUrl = `https://ipfs.io/ipfs/${hash}`; // You can use any public IPFS gateway
    const response = await fetch(gatewayUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file from IPFS. Status: ${response.status}`
      );
    }

    return await response.blob(); // Return the file as a Blob
  } catch (error) {
    console.error("Error fetching file from IPFS:", error);
    throw error;
  }
};
