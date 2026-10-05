export const API_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9000";
export const ASSET_URL = process.env.NEXT_PUBLIC_GCS_BASE || API_URL;
