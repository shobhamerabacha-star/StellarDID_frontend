export type Network = 'testnet' | 'mainnet';

/** A single cryptographic key linked to a DID. */
export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase?: string;
  publicKeyJwk?: Record<string, string>;
}

/** A service endpoint advertised in a DID Document. */
export interface ServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string;
}

/** A W3C-compliant DID Document resolved from the registry. */
export interface DIDDocument {
  id: string;
  verificationMethod?: VerificationMethod[];
  /** Each entry is either a key id string or a full VerificationMethod object. */
  authentication?: (string | VerificationMethod)[];
  service?: ServiceEndpoint[];
}
