"use client";

import { useState } from "react";

export interface IssuerFormProps {
  onSuccess?: (credentialId: string) => void;
  onError?: (errorMessage: string) => void;
}

const DID_PATTERN = /^did:stellar:G[2-7A-Z]{55}$/;
const STELLAR_ADDRESS_PATTERN = /^G[2-7A-Z]{55}$/;

export function IssuerForm({ onSuccess, onError }: IssuerFormProps) {
  const [subject, setSubject] = useState("");
  const [credentialType, setCredentialType] = useState("KycCredential");
  const [claimKey, setClaimKey] = useState("verificationLevel");
  const [claimValue, setClaimValue] = useState("Tier 2 Approved");
  const [expirationDate, setExpirationDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSubject = subject.trim();

    if (!trimmedSubject) {
      onError?.("Subject DID or Stellar public address is required.");
      return;
    }

    if (!DID_PATTERN.test(trimmedSubject) && !STELLAR_ADDRESS_PATTERN.test(trimmedSubject)) {
      onError?.(
        "Invalid subject identifier. Must be a valid did:stellar:G... or G... public key."
      );
      return;
    }

    setSubmitting(true);
    try {
      const formattedSubject = trimmedSubject.startsWith("did:stellar:")
        ? trimmedSubject
        : `did:stellar:${trimmedSubject}`;

      const credentialId = `urn:uuid:${crypto.randomUUID()}`;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        const res = await fetch(`${apiUrl}/api/credentials/issue`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: formattedSubject,
            type: ["VerifiableCredential", credentialType],
            claims: { [claimKey]: claimValue },
            expirationDate: expirationDate || undefined,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Issuance failed with status ${res.status}`);
        }
      }

      setSubject("");
      onSuccess?.(credentialId);
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "An unexpected error occurred during issuance."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      <div>
        <label
          htmlFor="subject-input"
          className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider"
        >
          Subject DID or Stellar Address *
        </label>
        <input
          id="subject-input"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="did:stellar:G... or G..."
          required
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          The subject identity that will receive this verifiable credential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="type-select"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider"
          >
            Credential Type
          </label>
          <select
            id="type-select"
            value={credentialType}
            onChange={(e) => setCredentialType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="KycCredential">KYC Credential</option>
            <option value="ProofOfResidency">Proof of Residency</option>
            <option value="AccreditedInvestor">Accredited Investor</option>
            <option value="CommunityMembership">Community Membership</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="exp-input"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider"
          >
            Expiration Date (Optional)
          </label>
          <input
            id="exp-input"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="claim-key"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider"
          >
            Claim Key
          </label>
          <input
            id="claim-key"
            type="text"
            value={claimKey}
            onChange={(e) => setClaimKey(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="claim-val"
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider"
          >
            Claim Value
          </label>
          <input
            id="claim-val"
            type="text"
            value={claimValue}
            onChange={(e) => setClaimValue(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-mono text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-2"
        >
          {submitting ? "Issuing Credential..." : "Issue Credential"}
        </button>
      </div>
    </form>
  );
}
