import React, { useState } from "react";
import { HiOutlineClipboard, HiOutlineCheck } from "react-icons/hi2";

export const CodeBlock = ({ code, language = "python", filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="rounded-none border border-[#e4e4e7] bg-[#0c0c0e] overflow-hidden font-mono text-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#141418] border-b border-[#27272a]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-none bg-red-500/80 inline-block" />
            <span className="w-2 h-2 rounded-none bg-yellow-500/80 inline-block" />
            <span className="w-2 h-2 rounded-none bg-emerald-500/80 inline-block" />
          </div>
          {filename && <span className="text-zinc-400 text-[11px] ml-2 font-mono">{filename}</span>}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-[#1e1e24] hover:bg-[#27272f] px-2 py-1 rounded-none border border-[#27272a] transition-all cursor-pointer active:scale-95"
            title="Copy code"
          >
            {copied ? (
              <>
                <HiOutlineCheck className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <HiOutlineClipboard />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-x-auto text-zinc-200 leading-relaxed scrollbar-thin">
        <pre className="font-mono text-xs leading-5">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
