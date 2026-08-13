// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useCredential(_subject?: string) {
  return {
    credentials: [],
    loading: false,
    issue: async () => {},
    verify: async () => {}
  };
}
