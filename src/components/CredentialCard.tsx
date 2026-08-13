/**
 * Author: RawNuke
 * Copyright (c) 2026 RawNuke. All rights reserved.
 */

import type { Credential } from "@/hooks/useCredential";

interface CredentialCardProps {
  credential: Credential;
}

function KeyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2">
      <span className="text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0 w-32">
        {label}
      </span>
      <span className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
        {value}
      </span>
    </div>
  );
}

/** Renders a date value, falling back to the raw string when it cannot be parsed. */
function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

/** Renders an issuer value that may be a URI string or a { id, name } object. */
function formatIssuer(issuer: string | { id?: string; name?: string }): string {
  if (typeof issuer === "string") return issuer;
  return issuer?.name ?? issuer?.id ?? "unknown";
}

/**
 * Renders a single verifiable credential with its status badge.
 * Only the fields present on the credential are shown.
 */
export function CredentialCard({ credential }: CredentialCardProps) {
  const types = Array.isArray(credential.type) ? credential.type : [];

  return (
    <article className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-5 space-y-3">
      <header className="flex items-start justify-between gap-3">
        <h3 className="font-syne text-base font-bold text-gray-900 dark:text-gray-100">
          Credential
        </h3>
        {credential.status && (
          <span className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-mono text-blue-700 dark:text-blue-300">
            {credential.status}
          </span>
        )}
      </header>

      {credential.id && (
        <div className="text-xs font-mono text-gray-400 dark:text-gray-500 break-all">
          {credential.id}
        </div>
      )}

      {types.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <span
              key={type}
              className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-mono text-gray-600 dark:text-gray-300"
            >
              {type}
            </span>
          ))}
        </div>
      )}

      <dl className="space-y-1.5">
        {credential.issuer && (
          <KeyValueRow label="issuer" value={formatIssuer(credential.issuer)} />
        )}
        {credential.subject && (
          <KeyValueRow label="subject" value={credential.subject} />
        )}
        {credential.issuanceDate && (
          <KeyValueRow
            label="issued"
            value={formatDate(credential.issuanceDate)}
          />
        )}
        {credential.expirationDate && (
          <KeyValueRow
            label="expires"
            value={formatDate(credential.expirationDate)}
          />
        )}
      </dl>
    </article>
  );
}
