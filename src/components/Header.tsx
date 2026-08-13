"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useWallet } from "@/hooks/useWallet";
import type { Network } from "@/lib/types";

const NETWORK_KEY = "stellardid_network";

/** Shorten a Stellar public key to G...XXXX (first 1 + last 4 chars). */
function shortenKey(key: string): string {
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export function Header() {
  // ── Network toggle ────────────────────────────────────────────────────────
  const [network, setNetwork] = useState<Network>("testnet");

  useEffect(() => {
    const stored = localStorage.getItem(NETWORK_KEY);
    if (stored === "mainnet" || stored === "testnet") {
      setNetwork(stored);
    }
  }, []);

  const toggleNetwork = () => {
    const next: Network = network === "testnet" ? "mainnet" : "testnet";
    setNetwork(next);
    localStorage.setItem(NETWORK_KEY, next);
  };

  // ── Wallet ────────────────────────────────────────────────────────────────
  const { isConnected, publicKey, walletAvailable, connect, disconnect } =
    useWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <header className="flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-background">
      {/* Brand */}
      <Link
        href="/"
        className="font-syne font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
      >
        StellarDID
      </Link>

      <div className="flex items-center gap-3">
        {/* Network toggle */}
        <button
          onClick={toggleNetwork}
          aria-label={`Switch to ${network === "testnet" ? "mainnet" : "testnet"}`}
          className={`px-3 py-1.5 rounded-full font-mono text-xs font-semibold transition-colors ${
            network === "mainnet"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800"
          }`}
        >
          {network}
        </button>

        {/* Wallet connect / connected dropdown */}
        {isConnected && publicKey ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="px-4 py-1.5 bg-blue-600 text-white rounded font-mono text-sm hover:bg-blue-700 transition-colors"
            >
              {shortenKey(publicKey)}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 rounded shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-50">
                <button
                  onClick={() => {
                    disconnect();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative group">
            <button
              onClick={walletAvailable ? connect : undefined}
              disabled={!walletAvailable}
              className={`px-4 py-1.5 rounded font-mono text-sm transition-colors ${
                walletAvailable
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              Connect Wallet
            </button>

            {/* Tooltip shown only when Freighter is not installed */}
            {!walletAvailable && (
              <div className="absolute right-0 mt-1 w-52 hidden group-hover:block rounded shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-50 px-3 py-2 text-xs text-gray-700 dark:text-gray-300">
                Freighter extension not detected.{" "}
                <a
                  href="https://freighter.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  Install Freighter
                </a>{" "}
                to connect.
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
