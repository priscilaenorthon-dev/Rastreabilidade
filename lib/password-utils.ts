export async function hashPassword(rawPassword: string): Promise<string> {
  const input = rawPassword.trim();
  const encoded = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  const bytes = new Uint8Array(digest);
  return [...bytes].map((item) => item.toString(16).padStart(2, '0')).join('');
}
