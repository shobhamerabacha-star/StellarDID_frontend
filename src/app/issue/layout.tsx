import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Issue Credentials | StellarDID",
  description: "Publish verifiable credentials to a subject DID.",
};

export default function IssueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
