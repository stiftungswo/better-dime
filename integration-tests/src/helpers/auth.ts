const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

const SEED_ADMIN = { email: "zivi@example.com", password: "123456" };

export async function signIn(
  credentials = SEED_ADMIN,
): Promise<{ token: string; body: Record<string, unknown> }> {
  const res = await fetch(`${BASE_URL}/v2/employees/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employee: credentials }),
  });

  if (!res.ok) {
    throw new Error(`Sign-in failed: ${res.status} ${await res.text()}`);
  }

  const authorization = res.headers.get("Authorization");
  if (!authorization) {
    throw new Error("No Authorization header in sign-in response");
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    throw new Error(`Invalid Authorization header format: ${authorization}`);
  }
  const token = match[1];
  const body = (await res.json()) as Record<string, unknown>;
  return { token, body };
}
