import crypto from "crypto";
import { cookies } from "next/headers";
import { ADMIN_USER, ADMIN_PASS, COOKIE_SECRET, COOKIE_NAME } from "./constants";

function sign(value: string): string {
  return crypto.createHmac("sha256", COOKIE_SECRET).update(value).digest("hex");
}

export function createToken(): string {
  const payload = `${ADMIN_USER}:${Date.now()}`;
  return `${Buffer.from(payload).toString("base64")}.${sign(payload)}`;
}

export function verifyToken(token: string): boolean {
  const [encodedPayload, sig] = token.split(".");
  if (!encodedPayload || !sig) return false;
  const payload = Buffer.from(encodedPayload, "base64").toString();
  return sign(payload) === sig;
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export { COOKIE_NAME };
