/**
 * Author: RawNuke
 * Copyright (c) 2026 RawNuke. All rights reserved.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { useCredential } from "@/hooks/useCredential";
import { CredentialCard } from "@/components/CredentialCard";

/**
 * Verifier panel state machine.
 * idle → validating → loading → credentials | noCredentials | notFound | error | validationError
 */
type Phase =
  | "idle"
  | "validating"
  | "loading"
  | "credentials"
  | "noCredentials"
  | "notFound"
  | "error"
  | "validationError";

/** did:stellar: prefix plus a Stellar public key: G and 55 base32 characters. */
const DID_PATTERN = /^did:stellar:G[2-7A-Z]{55}$/;

const VALIDATION_MESSAGE =
  "Enter a valid DID in the form did:stellar:G… (G followed by 55 base32 characters).";

function LoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading credentials">
      <span className="sr-only">Loading credentials…</span>
      <div aria-hidden="true" className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-5 space-y-3 animate-pulse"
          >
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Interactive credential status check section.
 * Validates the DID format, delegates fetching to useCredential, and renders
 * each credential through CredentialCard.
 */
export function VerifierPanel() {
  const { credentials, loading, error, notFound, empty, verify } =
    useCredential();
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  // Sync the phase to the hook outcome once the request settles
  useEffect(() => {
    if (phase !== "validating" && phase !== "loading") return;
    if (loading) {
      setPhase("loading");
      return;
    }
    if (notFound) setPhase("notFound");
    else if (error) setPhase("error");
    else if (empty) setPhase("noCredentials");
    else if (credentials.length > 0) setPhase("credentials");
    else setPhase("idle");
  }, [phase, loading, error, notFound, empty, credentials]);

  const handleChange = useCallback((value: string) => {
    setInput(value);
    setPhase((prev) => (prev === "validationError" ? "idle" : prev));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;

      if (!DID_PATTERN.test(trimmed)) {
        setPhase("validationError");
        return;
      }

      setPhase("validating");
      verify(trimmed);
    },
    [input, verify]
  );

  const showResult = phase !== "idle" && phase !== "validationError";

  return (
    <section
      aria-labelledby="verifier-heading"
      className="w-full max-w-3xl mx-auto"
    >
      <h2
        id="verifier-heading"
        className="font-syne text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100"
      >
        Verify a DID
      </h2>

      {/* Lookup form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
        role="search"
        aria-label="Credential status lookup"
      >
        <label htmlFor="verify-did-input" className="sr-only">
          Enter a DID identifier (e.g. did:stellar:G…)
        </label>
        <input
          id="verify-did-input"
          type="text"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="did:stellar:G…"
          spellCheck={false}
          autoComplete="off"
          aria-invalid={phase === "validationError"}
          aria-describedby={
            phase === "validationError" ? "verify-did-error" : undefined
          }
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        {phase === "validationError" && (
          <p
            id="verify-did-error"
            role="alert"
            className="text-xs font-mono text-red-600 dark:text-red-400"
          >
            {VALIDATION_MESSAGE}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-blue-600 px-6 py-3 font-syne text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          {loading ? "Verifying…" : "Check credentials"}
        </button>
      </form>

      {/* Result area */}
      {showResult && (
        <div className="mt-6" aria-live="polite" aria-atomic="true">
          {/* Loading skeleton */}
          {(phase === "validating" || phase === "loading") && (
            <LoadingSkeleton />
          )}

          {/* Not found / 404 state */}
          {phase === "notFound" && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 px-6 py-10 text-center">
              <p className="font-syne text-sm font-semibold text-amber-800 dark:text-amber-300">
                DID not found
              </p>
              <p className="mt-1 text-xs font-mono text-amber-700 dark:text-amber-400">
                No on-chain record exists for this identifier.
              </p>
            </div>
          )}

          {/* Network / API error */}
          {phase === "error" && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-6 py-4"
            >
              <p className="font-syne text-sm font-semibold text-red-700 dark:text-red-400">
                Verification failed
              </p>
              <p className="mt-1 text-xs font-mono text-red-600 dark:text-red-500 break-all">
                {error}
              </p>
            </div>
          )}

          {/* No credentials empty state */}
          {phase === "noCredentials" && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-10 text-center">
              <p className="font-syne text-sm font-semibold text-gray-500 dark:text-gray-400">
                No credentials found
              </p>
              <p className="mt-1 text-xs font-mono text-gray-400 dark:text-gray-500">
                This DID exists but holds no verifiable credentials.
              </p>
            </div>
          )}

          {/* Credential list */}
          {phase === "credentials" && (
            <div className="space-y-4">
              <p className="font-syne text-sm font-semibold text-gray-700 dark:text-gray-300">
                {credentials.length}{" "}
                {credentials.length === 1 ? "credential" : "credentials"} found
              </p>
              <ul className="space-y-4 list-none p-0">
                {credentials.map((credential, index) => (
                  <li key={credential.id ?? index}>
                    <CredentialCard credential={credential} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
