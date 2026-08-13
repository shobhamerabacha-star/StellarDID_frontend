/**
 * Author: RawNuke
 * Copyright (c) 2026 RawNuke. All rights reserved.
 */

import { VerifierPanel } from "@/components/VerifierPanel";

export const metadata = {
  title: "Verify | StellarDID",
  description: "Check the status of verifiable credentials.",
};

export default function VerifyPage() {
  return (
    <main className="p-8 font-mono">
      <h1 className="text-3xl mb-4 font-syne">Verifier View</h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        Enter a did:stellar: identifier to check the credentials issued to that
        subject.
      </p>
      <VerifierPanel />
    </main>
  );
}
