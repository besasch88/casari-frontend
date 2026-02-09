export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly glob: (pattern: string, options?: { eager?: boolean; import?: string }) => Record<string, unknown>;
  }
}

declare global {
  interface Window {
    __ENV__?: {
      VITE_BACKEND_URL?: string;
    };
  }
}
