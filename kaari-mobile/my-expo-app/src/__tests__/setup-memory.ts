// Re-export the in-memory DB exposed by the jest mock
declare const globalThis: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mem = (globalThis as any).___MEM_DB || {
  reset: () => {},
  col: (_name: string) => new Map<string, any>(),
};


