//api/auth/[..all]/route.ts
import { auth } from "../../../../../lib/db/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);
export const { GET, POST } = handler;