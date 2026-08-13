"use client";

export function IssuerForm() {
  return (
    <form className="flex flex-col gap-4 max-w-md">
      {/* Issuance form fields will go here */}
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-mono text-sm">
        Issue Credential
      </button>
    </form>
  );
}
