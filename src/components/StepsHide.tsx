"use client";

import { useState } from "react";
import FormFiles from "./FormFiles";
import ProgressButton from "./ProgressButton";
import { create } from "@web3-storage/w3up-client";
import { hideFilesInImage } from "@/utils/encrypt";
import FormPassword from "./FormPassword";

const StepsHide = () => {
  const [image, setImage] = useState([]);
  const [files, setFiles] = useState([]);
  const [compression, setCompression] = useState(9);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hiding, setHiding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);

  const hideFiles = async () => {
    if (image.length === 0) {
      alert("Please select a cover image");
      return;
    }
    if (files.length === 0) {
      alert("Please select files to hide");
      return;
    }

    setHiding(true);
    setProgress(0);

    try {
      const result = await hideFilesInImage({
        image: image[0], // Assuming image[0] is the selected file object
        files,
        compression,
        password,
        onProgress: setProgress, // Update progress
      });

      // Upload the result to Web3.Storage (IPFS)
      const client = await create();

      console.log("client", client.did());

      // get an email to use for the w3up account that will control the space
      const inputEmail = "sohailatwork10@gmail.com";

      // account associated with input email
      let myAccount;
      if (inputEmail) {
        console.warn(`about to w3up client.login with email ${inputEmail}`);
        myAccount = await client.login(inputEmail);
      }

      const blockchainSpace = await client.createSpace("blockchain.xyz");

      if (myAccount) {
        console.warn(
          `account ${myAccount.did()} is adding a provider to space ${blockchainSpace.did()}`
        );
        await myAccount.provision(blockchainSpace.did());
      }

      await client.addSpace(await blockchainSpace.createAuthorization(client));

      await client.setCurrentSpace(blockchainSpace.did());

      // Set your Web3.Storage space (DID)
      await client.setCurrentSpace(
        "did:key:z6MkvUWLZYneDhUkumW2b2oqxNZFxaiW5fXy9FLEKinn2BmM"
      );

      const file = new File([result], "steganographic-image.png", {
        type: result.type,
      });

      const cid = await client.uploadFile(file);

      await blockchainSpace.save();

      console.log(cid.toString());
      setIpfsHash(cid.toString());
      setResult(result);
    } catch (error) {
      console.error("Error during hiding process:", error);
      alert("An error occurred");
    } finally {
      setHiding(false);
    }
  };

  return (
    <>
      <form id="form" className="grid gap-16">
        <div>
          <p className="mb-8">
            Add the image you want to hide the files inside
          </p>
          <FormFiles
            type="image"
            accept="image/"
            files={image}
            setFiles={setImage}
          />
        </div>
        <div>
          <p className="mb-8">Add the files you would like to hide</p>
          <FormFiles multiple files={files} setFiles={setFiles} />
        </div>

        <div>
          <p className="mb-4">
            Choose and confirm password{" "}
            <span className="text-gray-400">(optional)</span>
          </p>
          <FormPassword
            value={password}
            confirm={confirmPassword}
            onChange={setPassword}
            onConfirm={setConfirmPassword}
            valid={password === confirmPassword}
          />
        </div>
        <div className=" bg-white p-4">{ipfsHash}</div>

        <div>
          <ProgressButton onClick={hideFiles} progress={progress}>
            {hiding ? "Hiding files..." : "Hide files inside image"}
          </ProgressButton>
        </div>
      </form>
    </>
  );
};

export default StepsHide;
