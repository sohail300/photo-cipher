"use client";

import { useState } from "react";
import ProgressButton from "./ProgressButton";
import FormPassword from "./FormPassword";
import { findFilesInImage } from "@/utils/decrypt";
import { getFileFromIPFS } from "@/utils/ipfsUtils"; // Utility to fetch files from IPFS
import { toast } from "react-toastify";

const StepsFind = () => {
  const [ipfsHash, setIpfsHash] = useState(""); // To hold the IPFS hash input
  const [password, setPassword] = useState("");
  const [finding, setFinding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const findFiles = async () => {
    if (!ipfsHash) {
      toast.error("Please enter the IPFS hash of the image.");
      return;
    }

    try {
      setFinding(true);
      setProgress(0);

      // Step 1: Fetch the image from IPFS using the hash
      const imageBlob = await getFileFromIPFS(ipfsHash);

      if (!imageBlob) {
        throw new Error("Failed to fetch image from IPFS.");
      }

      // Step 2: Use the image blob to extract hidden files
      const hiddenZipBlob = await findFilesInImage(imageBlob, password);

      // Create a URL for the resulting ZIP file
      const downloadUrl = URL.createObjectURL(hiddenZipBlob);

      setResult(downloadUrl); // Save the URL for downloading
      toast.success(
        "Files found successfully. Click 'Download files' to retrieve them."
      );
    } catch (error) {
      console.error("Error finding hidden files:", error);
      toast.error(
        "Failed to find hidden files. Please check the hash or password."
      );
    } finally {
      setFinding(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    // Trigger download of the ZIP file
    const a = document.createElement("a");
    a.href = result;
    a.download = "hidden-files.zip";
    a.click();
    URL.revokeObjectURL(result); // Cleanup the URL
    setResult(null); // Reset result after download
  };

  return (
    <form id="form" className="grid gap-32">
      <div>
        <p className="mb-8">Enter the IPFS hash of the image</p>
        <input
          className="bg-gray-600 bg-opacity-25 border-white placeholder-gray-700 placeholder:text-xl rounded-lg shadow-inner focus:outline-none focus-visible:ring ring-blue-500 ring-opacity-50 md:text-xl w-full px-4 py-2 border-2 border-transparent"
          value={ipfsHash}
          onChange={(event) => setIpfsHash(event.target.value)}
          placeholder="Enter IPFS hash"
        />
      </div>
      <div>
        <p className="mb-8">
          Enter the password used to hide the files{" "}
          <span className="text-gray-400">(may be blank)</span>
        </p>
        <FormPassword value={password} onChange={setPassword} />
      </div>
      <div>
        <ProgressButton
          onClick={result ? handleDownload : findFiles}
          progress={progress}
        >
          {result
            ? "Download files"
            : finding
            ? "Finding files..."
            : "Find files from IPFS"}
        </ProgressButton>
      </div>
    </form>
  );
};

export default StepsFind;
