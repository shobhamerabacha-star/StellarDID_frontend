"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
  label?: string;
}

/**
 * Small inline button that copies `value` to the clipboard.
 * Uses the Clipboard API — must stay a client component.
 */
export function CopyButton({ value, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore clipboard errors (e.g. in restricted iframes)
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : label}
      className="ml-2 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-mono
                 bg-gray-100 text-gray-600 hover:bg-gray-200
                 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700
                 transition-colors"
    >
      {copied ? (
        <>
          {/* Checkmark icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-3"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
              clipRule="evenodd"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          {/* Clipboard icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-3"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.5 2A1.5 1.5 0 0 0 4 3.5v9A1.5 1.5 0 0 0 5.5 14h5a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 10.5 2h-5Zm.75 2.25a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
              clipRule="evenodd"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}
