"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDID } from "@/hooks/useDID";
import { DIDCard } from "@/components/DIDCard";

/**
 * Interactive DID resolver section.
 *
 * - Reads the `?did=` query param on mount and auto-resolves.
 * - Updates the URL param as the user resolves new identifiers.
 * - Delegates all data-fetching state to useDID.
 * - Renders DIDCard for results, inline states for loading / not-found / error.
 */
export function DIDResolver() {
  const { document, loading, error, notFound, resolve } = useDID();
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Pre-populate from ?did= and auto-resolve ─────────────────────────────
  useEffect(() => {
    const param = searchParams.get("did");
    if (param) {
      setInput(param);
      setSubmitted(true);
      resolve(param);
    }
    // Only run once on mount — exhaustive-deps would re-fire on every resolve change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;

      setSubmitted(true);
      resolve(trimmed);

      // Mirror the resolved DID into the URL without a navigation
      const params = new URLSearchParams(searchParams.toString());
      params.set("did", trimmed);
      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [input, resolve, router, searchParams]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section
      aria-labelledby="resolver-heading"
      className="w-full max-w-3xl mx-auto"
    >
      <h2
        id="resolver-heading"
        className="font-syne text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100"
      >
        Resolve a DID
      </h2>

      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
        role="search"
        aria-label="DID resolver search"
      >
        <label htmlFor="did-input" className="sr-only">
          Enter a DID identifier (e.g. did:stellar:G…)
        </label>
        <input
          id="did-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="did:stellar:G…"
          spellCheck={false}
          autoComplete="off"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-blue-600 px-6 py-3 font-syne text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          {loading ? "Resolving…" : "Search"}
        </button>
      </form>

      {/* Result area */}
      {submitted && (
        <div className="mt-6" aria-live="polite" aria-atomic="true">
          {/* Loading spinner */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <svg
                className="animate-spin size-8 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Resolving DID…"
                role="img"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          )}

          {/* Not found / 404 empty state */}
          {!loading && notFound && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 px-6 py-10 text-center">
              <p className="font-syne text-sm font-semibold text-amber-800 dark:text-amber-300">
                DID not registered
              </p>
              <p className="mt-1 text-xs font-mono text-amber-700 dark:text-amber-400">
                No on-chain record exists for this identifier.
              </p>
            </div>
          )}

          {/* Network / API error */}
          {!loading && error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-6 py-4"
            >
              <p className="font-syne text-sm font-semibold text-red-700 dark:text-red-400">
                Resolution failed
              </p>
              <p className="mt-1 text-xs font-mono text-red-600 dark:text-red-500 break-all">
                {error}
              </p>
            </div>
          )}

          {/* DID Document card */}
          {!loading && !error && !notFound && (
            <DIDCard document={document} />
          )}
        </div>
      )}
    </section>
  );
}
