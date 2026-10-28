"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { IssuerForm } from "@/components/IssuerForm";

export default function IssuePage() {
  const { isConnected, connect, publicKey } = useWallet();
  const [issuedId, setIssuedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = (id: string) => {
    setIssuedId(id);
    setError(null);
  };

  const handleError = (msg: string) => {
    setError(msg);
  };

  const handleReset = () => {
    setIssuedId(null);
    setError(null);
  };

  return (
    <main className="p-8 font-mono max-w-4xl mx-auto">
      <h1 className="text-3xl mb-2 font-syne font-bold text-gray-900 dark:text-gray-100">
        Issuer Panel
      </h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Publish verifiable credentials to a subject DID on the Stellar network.
      </p>

      {/* Dismissible Error Banner */}
      {error && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">Error:</span>
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-700 dark:text-red-300 hover:opacity-75 text-sm font-semibold ml-4 px-2 py-1 rounded"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Wallet Connection Gate */}
      {!isConnected ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
            🔒
          </div>
          <h2 className="text-xl font-bold font-syne text-gray-900 dark:text-gray-100">
            Wallet Connection Required
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            To issue verifiable credentials, you must connect an authorized issuer wallet.
            Only designated Stellar accounts can sign and anchor credential attestations to the registry.
          </p>
          <div>
            <button
              onClick={connect}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm inline-flex items-center gap-2"
            >
              Connect Freighter Wallet
            </button>
          </div>
        </div>
      ) : issuedId ? (
        /* Success Banner with "Issue another" reset button */
        <div
          role="status"
          className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
            <span className="text-2xl">✓</span>
            <div>
              <h3 className="font-bold text-lg font-syne">
                Credential Issued Successfully
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                The verifiable credential has been published and anchored.
              </p>
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-green-200 dark:border-green-800/60 font-mono text-xs break-all text-gray-800 dark:text-gray-200">
            <span className="text-gray-500 mr-2">Credential ID:</span>
            <span className="font-semibold text-green-700 dark:text-green-400">
              {issuedId}
            </span>
          </div>
          <div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
            >
              Issue another
            </button>
          </div>
        </div>
      ) : (
        /* Connected Form */
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <span>
              Issuer Account:{" "}
              <strong className="text-gray-700 dark:text-gray-300">
                {publicKey}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Connected
            </span>
          </div>
          <IssuerForm onSuccess={handleSuccess} onError={handleError} />
        </div>
      )}
    </main>
  );
}
