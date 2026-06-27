import axios from "axios";

import { env } from "@philkart/env/web";

/** Single Axios instance pointed at the versioned API. */
export const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});
