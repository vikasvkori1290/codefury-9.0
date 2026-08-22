import React from "react";
import { HiOutlineDocumentText } from "react-icons/hi2";

const DocsPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fafafa] text-zinc-900 px-4 py-16 font-sans">
      <div className="max-w-md w-full text-center space-y-4 p-8 bg-white border border-[#e4e4e7] shadow-xs">
        <div className="w-12 h-12 bg-orange-50 border border-orange-200 text-[#ea580c] flex items-center justify-center mx-auto text-xl font-bold">
          <HiOutlineDocumentText />
        </div>
        <h1 className="text-xl font-bold font-sans text-zinc-950">
          Documentation
        </h1>
        <p className="text-xs text-zinc-500 font-mono">
          Documentation is currently being updated. Check back soon.
        </p>
      </div>
    </div>
  );
};

export default DocsPage;
