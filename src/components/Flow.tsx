"use client";

import { useState } from "react";
import ChooseFlow from "./ChooseFlow";
import StepsFind from "./StepsFind";
import StepsHide from "./StepsHide";

const Flow = () => {
  const [flow, setFlow] = useState(null);
  const ChosenFlow =
    flow === "find" ? StepsFind : flow === "hide" ? StepsHide : null;

  return (
    <main className="relative">
      <div className="py-16 container xl:max-w-screen-xl mx-auto px-8">
        <noscript>
          <div className="mb-32 bg-gray-900 p-8 -mx-8 sm:-mx-4 sm:rounded-lg shadow-lg">
            PhotoCipher requires JavaScript to hide and find files within
            images!
          </div>
        </noscript>
        <ChooseFlow onChoice={setFlow} />
        <div>{ChosenFlow ? <ChosenFlow /> : null}</div>
      </div>
    </main>
  );
};

export default Flow;
