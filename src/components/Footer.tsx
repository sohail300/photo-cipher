import React from "react";
import { Github } from "lucide-react";

const Footer = () => (
  <footer className="bg-zinc-900 text-gray-300 py-8">
    <div className="container xl:max-w-screen-xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold text-white mb-2">
            Group No. 29
          </h3>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/sohail300/photo-cipher"
            className="text-gray-500 hover:text-white transition-colors duration-300 group"
          >
            <Github
              className="w-7 h-7 group-hover:scale-110 transition-transform"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-800 text-center md:text-left">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
