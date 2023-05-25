import { assert } from "std/testing/asserts.ts";

// Throws with an assertion error if the specified environment variable is not defined
export function ensureGetEnv(key: string) {
  const value = Deno.env.get(key);
  assert(value !== undefined, `Missing ${key} environment variable`);
  return value;
}
