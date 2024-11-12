interface ImportMetaEnv {
  VITE_GOOGLE_SHEET_DEPLOY: string;
  VITE_TABLE_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
