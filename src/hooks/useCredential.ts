/**
 * Author: RawNuke
 * Copyright (c) 2026 RawNuke. All rights reserved.
 */

"use client";

import { useState, useCallback } from "react";

/**
 * A verifiable credential as returned by the backend credentials API.
 * All fields are optional: the backend is not implemented yet, and a W3C
 * VC 2.0 credential does not guarantee every field. Components render only
 * the fields that are present.
 */
export interface Credential {
  id?: string;
  type?: string[];
  issuer?: string | { id?: string; name?: string };
  subject?: string;
  issuanceDate?: string;
  expirationDate?: string;
  credentialSubject?: Record<string, unknown>;
  status?: string;
}

interface UseCredentialReturn {
  credentials: Credential[];
  loading: boolean;
  /** null = no attempt yet; string = error message */
  error: string | null;
  /** true after a 404 — the DID is not registered */
  notFound: boolean;
  /** true after a 200 with an empty credential list */
  empty: boolean;
  issue: () => Promise<void>;
  verify: (identifier?: string) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const DID_PREFIX = "did:stellar:";

/** Strips the DID prefix when present so only the Stellar address is sent. */
function toAddress(identifier: string): string {
  const trimmed = identifier.trim();
  return trimmed.startsWith(DID_PREFIX)
    ? trimmed.slice(DID_PREFIX.length)
    : trimmed;
}

export function useCredential(subject?: string): UseCredentialReturn {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [empty, setEmpty] = useState(false);

  const issue = useCallback(async () => {
    // Stub — issuance will be implemented in a future issue
  }, []);

  const verify = useCallback(
    async (identifier?: string) => {
      const target = (identifier ?? subject ?? "").trim();
      if (!target) return;

      setLoading(true);
      setError(null);
      setNotFound(false);
      setEmpty(false);
      setCredentials([]);

      try {
        const res = await fetch(
          `${API_URL}/api/credentials/${encodeURIComponent(toAddress(target))}`
        );

        if (res.status === 404) {
          setNotFound(true);
          return;
        }

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }

        const data: unknown = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid response from the credentials API.");
        }

        if (data.length === 0) {
          setEmpty(true);
          return;
        }

        setCredentials(data as Credential[]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    },
    [subject]
  );

  return { credentials, loading, error, notFound, empty, issue, verify };
}
