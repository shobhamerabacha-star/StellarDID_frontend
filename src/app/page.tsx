import Link from "next/link";
import { Suspense } from "react";
import { DIDResolver } from "@/components/DIDResolver";

// ── Role card data ────────────────────────────────────────────────────────────

const roles = [
  {
    key: "holder",
    title: "Holder",
    description:
      "Connect your Freighter wallet, register your decentralised identity on-chain, and manage the credentials you've been issued.",
    href: "/dashboard",
    cta: "Go to Dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7"
        aria-hidden="true"
      >
        <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        <path d="M4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    accentLight: "border-blue-200 hover:border-blue-400",
    accentDark: "dark:border-blue-800 dark:hover:border-blue-500",
    iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    ctaClass:
      "bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-500 text-white",
  },
  {
    key: "issuer",
    title: "Issuer",
    description:
      "Select a subject address, choose a credential type, and publish a cryptographically signed verifiable credential to the Stellar registry.",
    href: "/issue",
    cta: "Issue a Credential",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7"
        aria-hidden="true"
      >
        <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    accentLight: "border-violet-200 hover:border-violet-400",
    accentDark: "dark:border-violet-800 dark:hover:border-violet-500",
    iconBg:
      "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
    ctaClass:
      "bg-violet-600 hover:bg-violet-700 focus-visible:outline-violet-500 text-white",
  },
  {
    key: "verifier",
    title: "Verifier",
    description:
      "Look up any DID, inspect its on-chain document, and check the current validity status of the credentials it holds.",
    href: "/verify",
    cta: "Verify a DID",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7"
        aria-hidden="true"
      >
        <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z" />
      </svg>
    ),
    accentLight: "border-emerald-200 hover:border-emerald-400",
    accentDark: "dark:border-emerald-800 dark:hover:border-emerald-500",
    iconBg:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    ctaClass:
      "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-500 text-white",
  },
] as const;

// ── Page ──────────────────────────────────────────────────────────────────────

/**
 * Public landing page — server component.
 * Interactive resolver is isolated in DIDResolver ("use client").
 */
export default function HomePage() {
  return (
    <main className="flex flex-col items-center">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="w-full text-center px-6 pt-20 pb-16 border-b border-gray-100 dark:border-gray-800"
      >
        <div className="max-w-3xl mx-auto space-y-5">
          <h1 className="font-syne text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-50 text-balance">
            StellarDID
          </h1>
          <p className="font-syne text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium">
            Self-sovereign identity infrastructure for the Stellar ecosystem.
          </p>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-balance">
            Register decentralised identifiers on-chain, issue verifiable
            credentials to any Stellar address, and give verifiers a single
            place to check identity claims all without a central authority.
          </p>
        </div>
      </section>

      {/* ── Role cards ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="roles-heading"
        className="w-full max-w-6xl px-6 py-16"
      >
        <h2
          id="roles-heading"
          className="font-syne text-2xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100"
        >
          Choose your role
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0">
          {roles.map((role) => (
            <li key={role.key}>
              <article
                className={`flex flex-col h-full rounded-xl border bg-white dark:bg-gray-900 p-6 shadow-sm transition-colors ${role.accentLight} ${role.accentDark}`}
              >
                {/* Icon */}
                <div
                  className={`mb-4 inline-flex size-12 items-center justify-center rounded-lg ${role.iconBg}`}
                >
                  {role.icon}
                </div>

                {/* Text */}
                <h3 className="font-syne text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {role.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">
                  {role.description}
                </p>

                {/* CTA */}
                <Link
                  href={role.href}
                  className={`mt-6 inline-block rounded-lg px-5 py-2.5 font-syne text-sm font-semibold text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${role.ctaClass}`}
                  aria-label={`${role.cta} — ${role.title} view`}
                >
                  {role.cta}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* ── DID Resolver ──────────────────────────────────────────────────── */}
      <section
        aria-label="DID resolver"
        className="w-full border-t border-gray-100 dark:border-gray-800 px-6 py-16"
      >
        {/*
          DIDResolver reads searchParams via useSearchParams(), which requires
          a Suspense boundary in Next.js 14 app router to avoid a static
          render bail-out.
        */}
        <Suspense fallback={null}>
          <DIDResolver />
        </Suspense>
      </section>

    </main>
  );
}
