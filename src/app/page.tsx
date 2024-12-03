"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black/90 to-black text-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute w-[200%] h-full left-[50%] top-0 translate-x-[-50%] stroke-gray-300/70 [mask-image:radial-gradient(48rem_48rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
              patternTransform="translate(0 0)"
            >
              <path d="M.5 100V.5H100" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-4xl text-center">
        <h1 className="bg-clip-text bg-gradient-to-br from-30% from-white to-white/40 opacity-1 pt-8 pb-0 font-medium text-5xl text-balance text-transparent sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tighter translate-y-[-1rem] animate-fade-in [--animation-delay:200ms]">
          Photo Cipher
        </h1>
        <span className="mt-[8px] text-xl w-4/5 mx-auto text-white/20 bg-clip-text bg-gradient-to-br from-20% from-white to-white/40 opacity-1 block">
          Transforming Your Images into Secure Gateways for Hidden Files,
          Blending Privacy, Innovation, and Seamless Accessibility.
        </span>
      </div>

      <button
        className="mt-8 px-8 py-2 rounded-full relative bg-slate-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600"
        onClick={() => router.push("/tool")}
      >
        <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
        <span className="relative z-20">Explore</span>
      </button>
    </div>
  );
}
